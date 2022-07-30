"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTokenBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const base_1 = require("../base");
const order_1 = require("../../order");
const Types = __importStar(require("../../types"));
const CommonAddresses = __importStar(require("../../../common/addresses"));
const utils_1 = require("../../../utils");
class SingleTokenBuilder extends base_1.BaseBuilder {
    getInfo(order) {
        try {
            const { side, isDynamic } = this.getBaseInfo(order);
            let taker = constants_1.AddressZero;
            const offerItem = order.params.offer[0];
            if (side === "sell") {
                // The offer item is the sold token
                const tokenKind = offerItem.itemType === Types.ItemType.ERC721 ? "erc721" : "erc1155";
                const contract = offerItem.token;
                const tokenId = offerItem.identifierOrCriteria;
                const amount = offerItem.startAmount;
                // Ensure all consideration items match (with the exception of the
                // last one which can match the offer item if the listing is meant
                // to be fillable only by a specific taker - eg. private)
                const fees = [];
                const c = order.params.consideration;
                const paymentToken = c[0].token;
                const price = (0, utils_1.bn)(c[0].startAmount);
                const endPrice = (0, utils_1.bn)(c[0].endAmount);
                for (let i = 1; i < c.length; i++) {
                    // Seaport private listings have the last consideration item match the offer item
                    if (i === c.length - 1 &&
                        c[i].token === offerItem.token &&
                        c[i].identifierOrCriteria === offerItem.identifierOrCriteria) {
                        taker = c[i].recipient;
                    }
                    else if (c[i].token !== paymentToken) {
                        throw new Error("Invalid consideration");
                    }
                    else {
                        fees.push({
                            recipient: c[i].recipient,
                            amount: c[i].startAmount,
                            endAmount: c[i].endAmount,
                        });
                    }
                }
                return {
                    tokenKind,
                    side,
                    contract,
                    tokenId,
                    amount,
                    paymentToken,
                    price: (0, utils_1.s)(price),
                    endPrice: (0, utils_1.s)(endPrice),
                    fees,
                    isDynamic,
                    taker,
                };
            }
            else {
                if (isDynamic) {
                    throw new Error("Reverse dutch auctions are not supported");
                }
                const paymentToken = offerItem.token;
                const price = offerItem.startAmount;
                // The first consideration item is the bought token
                const item = order.params.consideration[0];
                // The other items in the consideration are the fees
                const fees = [];
                for (let i = 1; i < order.params.consideration.length; i++) {
                    const consideration = order.params.consideration[i];
                    if (i > 1 && consideration.token !== paymentToken) {
                        throw new Error("Invalid consideration");
                    }
                    fees.push({
                        recipient: consideration.recipient,
                        amount: consideration.startAmount,
                    });
                }
                const tokenKind = item.itemType === Types.ItemType.ERC721 ? "erc721" : "erc1155";
                const contract = item.token;
                const tokenId = item.identifierOrCriteria;
                const amount = item.startAmount;
                return {
                    tokenKind,
                    side,
                    contract,
                    tokenId,
                    amount,
                    paymentToken,
                    price,
                    fees,
                    taker,
                };
            }
        }
        catch {
            return undefined;
        }
    }
    isValid(order) {
        try {
            if (!this.baseIsValid(order)) {
                return false;
            }
            const info = this.getInfo(order);
            if (!(info === null || info === void 0 ? void 0 : info.tokenId)) {
                return false;
            }
            const copyOrder = this.build({
                ...order.params,
                ...info,
            });
            if (!copyOrder) {
                return false;
            }
            if (copyOrder.hash() !== order.hash()) {
                return false;
            }
        }
        catch {
            return false;
        }
        return true;
    }
    build(params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.defaultInitialize(params);
        if (params.side === "sell") {
            return new order_1.Order(this.chainId, {
                kind: "single-token",
                offerer: params.offerer,
                zone: params.zone,
                offer: [
                    {
                        itemType: params.tokenKind === "erc721"
                            ? Types.ItemType.ERC721
                            : Types.ItemType.ERC1155,
                        token: params.contract,
                        identifierOrCriteria: (0, utils_1.s)(params.tokenId),
                        startAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_a = params.amount) !== null && _a !== void 0 ? _a : 1 : 1),
                        endAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_b = params.amount) !== null && _b !== void 0 ? _b : 1 : 1),
                    },
                ],
                consideration: [
                    {
                        itemType: Types.ItemType.NATIVE,
                        token: CommonAddresses.Eth[this.chainId],
                        identifierOrCriteria: "0",
                        startAmount: (0, utils_1.s)(params.price),
                        endAmount: (0, utils_1.s)((_c = params.endPrice) !== null && _c !== void 0 ? _c : params.price),
                        recipient: params.offerer,
                    },
                    ...(params.fees || []).map(({ amount, endAmount, recipient }) => ({
                        itemType: Types.ItemType.NATIVE,
                        token: CommonAddresses.Eth[this.chainId],
                        identifierOrCriteria: "0",
                        startAmount: (0, utils_1.s)(amount),
                        endAmount: (0, utils_1.s)(endAmount !== null && endAmount !== void 0 ? endAmount : amount),
                        recipient,
                    })),
                    ...(params.taker && params.taker !== constants_1.AddressZero
                        ? [
                            {
                                itemType: params.tokenKind === "erc721"
                                    ? Types.ItemType.ERC721
                                    : Types.ItemType.ERC1155,
                                token: params.contract,
                                identifierOrCriteria: (0, utils_1.s)(params.tokenId),
                                startAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_d = params.amount) !== null && _d !== void 0 ? _d : 1 : 1),
                                endAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_e = params.amount) !== null && _e !== void 0 ? _e : 1 : 1),
                                recipient: params.taker,
                            },
                        ]
                        : []),
                ],
                orderType: params.orderType !== undefined
                    ? params.orderType
                    : (params.zone === constants_1.AddressZero ? 0 : 2) +
                        (params.tokenKind === "erc1155" || (0, utils_1.bn)((_f = params.amount) !== null && _f !== void 0 ? _f : 1).gt(1)
                            ? Types.OrderType.PARTIAL_OPEN
                            : Types.OrderType.FULL_OPEN),
                startTime: params.startTime,
                endTime: params.endTime,
                zoneHash: params.zoneHash,
                salt: (0, utils_1.s)(params.salt),
                conduitKey: params.conduitKey,
                counter: (0, utils_1.s)(params.counter),
                signature: params.signature,
            });
        }
        else {
            if (params.taker && params.taker !== constants_1.AddressZero) {
                throw new Error("Private bids are not yet supported");
            }
            return new order_1.Order(this.chainId, {
                kind: "single-token",
                offerer: params.offerer,
                zone: params.zone,
                offer: [
                    {
                        itemType: Types.ItemType.ERC20,
                        token: params.paymentToken,
                        identifierOrCriteria: "0",
                        startAmount: (0, utils_1.s)(params.price),
                        endAmount: (0, utils_1.s)(params.price),
                    },
                ],
                consideration: [
                    {
                        itemType: params.tokenKind === "erc721"
                            ? Types.ItemType.ERC721
                            : Types.ItemType.ERC1155,
                        token: params.contract,
                        identifierOrCriteria: (0, utils_1.s)(params.tokenId),
                        startAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_g = params.amount) !== null && _g !== void 0 ? _g : 1 : 1),
                        endAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_h = params.amount) !== null && _h !== void 0 ? _h : 1 : 1),
                        recipient: params.offerer,
                    },
                    ...(params.fees || []).map(({ amount, recipient }) => ({
                        itemType: Types.ItemType.ERC20,
                        token: params.paymentToken,
                        identifierOrCriteria: "0",
                        startAmount: (0, utils_1.s)(amount),
                        endAmount: (0, utils_1.s)(amount),
                        recipient,
                    })),
                ],
                orderType: params.orderType !== undefined
                    ? params.orderType
                    : (params.zone === constants_1.AddressZero ? 0 : 2) +
                        (params.tokenKind === "erc1155" || (0, utils_1.bn)((_j = params.amount) !== null && _j !== void 0 ? _j : 1).gt(1)
                            ? Types.OrderType.PARTIAL_OPEN
                            : Types.OrderType.FULL_OPEN),
                startTime: params.startTime,
                endTime: params.endTime,
                zoneHash: params.zoneHash,
                salt: (0, utils_1.s)(params.salt),
                conduitKey: params.conduitKey,
                counter: (0, utils_1.s)(params.counter),
                signature: params.signature,
            });
        }
    }
    buildMatching(_order, data) {
        return {
            amount: (data === null || data === void 0 ? void 0 : data.amount) ? (0, utils_1.s)(data.amount) : undefined,
        };
    }
}
exports.SingleTokenBuilder = SingleTokenBuilder;
//# sourceMappingURL=index.js.map