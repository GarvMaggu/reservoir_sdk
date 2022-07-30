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
exports.BundleAskBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const bundle_1 = require("../base/bundle");
const bundle_order_1 = require("../../bundle-order");
const Types = __importStar(require("../../types"));
const utils_1 = require("../../../utils");
class BundleAskBuilder extends bundle_1.BaseBundleBuilder {
    constructor(chainId) {
        super(chainId);
    }
    getInfo(order) {
        // By default anyone can fill orders, unless the order is explicitly private
        let taker = constants_1.AddressZero;
        // Keep track of fees
        const fees = [];
        const o = order.params.offer;
        const c = order.params.consideration;
        // Detect the price and payment token from the first consideration item
        const paymentToken = c[0].token;
        let price = (0, utils_1.bn)(c[0].endAmount);
        // Last `c.length - o.length` consideration items could be reserved for private listings
        const last = c.length - o.length;
        for (let i = 1; i < c.length; i++) {
            // Handle private listings
            if (i >= last &&
                c[i].token === o[i - last].token &&
                c[i].identifierOrCriteria === o[i - last].identifierOrCriteria) {
                if (taker !== constants_1.AddressZero && taker !== c[i].recipient) {
                    // Ensure all specified recipients match
                    throw new Error("Invalid consideration");
                }
                else {
                    taker = c[i].recipient;
                }
            }
            else if (c[i].token !== paymentToken) {
                // Ensure all consideration items have the same token
                throw new Error("Invalid consideration");
            }
            else {
                // Any payment on top of the first consideration is considered a fee
                fees.push({
                    recipient: c[i].recipient,
                    amount: c[i].startAmount,
                });
            }
        }
        return {
            offerItems: order.params.offer.map((o) => ({
                tokenKind: o.itemType === Types.ItemType.ERC721 ? "erc721" : "erc1155",
                contract: o.token,
                tokenId: o.identifierOrCriteria,
                amount: o.endAmount,
            })),
            considerationItems: order.params.consideration.map((o) => ({
                tokenKind: "erc20",
                contract: o.token,
                tokenId: o.identifierOrCriteria,
                amount: o.endAmount,
            })),
            paymentToken,
            price: (0, utils_1.s)(price),
            fees,
            taker,
        };
    }
    isValid(order) {
        try {
            if (!this.baseIsValid(order)) {
                return false;
            }
            // Extract info from the order
            const info = this.getInfo(order);
            // Build a copy order which is for sure well-formatted
            const copyOrder = this.build({
                ...order.params,
                ...info,
            });
            if (!copyOrder) {
                return false;
            }
            // Ensure the original and the copy orders match
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
        this.defaultInitialize(params);
        for (const item of params.offerItems) {
            if (item.tokenKind === "erc20") {
                throw new Error("Unsupported offer item kind");
            }
        }
        const currency = params.considerationItems[0].contract;
        if (currency !== constants_1.AddressZero) {
            throw new Error("Unsupported currency");
        }
        for (const item of params.considerationItems) {
            if (item.tokenKind !== "erc20") {
                throw new Error("Unsupported consideration item kind");
            }
            if (item.contract !== currency) {
                throw new Error("Non-matching consideration item");
            }
        }
        return new bundle_order_1.BundleOrder(this.chainId, {
            kind: "bundle-ask",
            offerer: params.offerer,
            zone: params.zone,
            offer: params.offerItems.map((item) => {
                var _a, _b;
                return ({
                    itemType: item.tokenKind === "erc721"
                        ? Types.ItemType.ERC721
                        : Types.ItemType.ERC1155,
                    token: item.contract,
                    identifierOrCriteria: (0, utils_1.s)(item.tokenId),
                    startAmount: (0, utils_1.s)(item.tokenKind === "erc1155" ? (_a = item.amount) !== null && _a !== void 0 ? _a : 1 : 1),
                    endAmount: (0, utils_1.s)(item.tokenKind === "erc1155" ? (_b = item.amount) !== null && _b !== void 0 ? _b : 1 : 1),
                });
            }),
            consideration: [
                {
                    itemType: currency === constants_1.AddressZero
                        ? Types.ItemType.NATIVE
                        : Types.ItemType.ERC20,
                    token: currency,
                    identifierOrCriteria: "0",
                    startAmount: (0, utils_1.s)(params.considerationItems[0].amount),
                    endAmount: (0, utils_1.s)(params.considerationItems[0].amount),
                    recipient: params.offerer,
                },
                ...(params.fees || []).map(({ amount, recipient }) => ({
                    itemType: currency === constants_1.AddressZero
                        ? Types.ItemType.NATIVE
                        : Types.ItemType.ERC20,
                    token: currency,
                    identifierOrCriteria: "0",
                    startAmount: (0, utils_1.s)(amount),
                    endAmount: (0, utils_1.s)(amount),
                    recipient,
                })),
                ...(params.taker && params.taker !== constants_1.AddressZero
                    ? params.offerItems.map((item) => {
                        var _a, _b;
                        return ({
                            itemType: item.tokenKind === "erc721"
                                ? Types.ItemType.ERC721
                                : Types.ItemType.ERC1155,
                            token: item.contract,
                            identifierOrCriteria: (0, utils_1.s)(item.tokenId),
                            startAmount: (0, utils_1.s)(item.tokenKind === "erc1155" ? (_a = item.amount) !== null && _a !== void 0 ? _a : 1 : 1),
                            endAmount: (0, utils_1.s)(item.tokenKind === "erc1155" ? (_b = item.amount) !== null && _b !== void 0 ? _b : 1 : 1),
                            recipient: params.taker,
                        });
                    })
                    : []),
            ],
            orderType: params.orderType !== undefined
                ? params.orderType
                : (params.zone === constants_1.AddressZero ? 0 : 2) + Types.OrderType.FULL_OPEN,
            startTime: params.startTime,
            endTime: params.endTime,
            zoneHash: params.zoneHash,
            salt: (0, utils_1.s)(params.salt),
            conduitKey: params.conduitKey,
            counter: (0, utils_1.s)(params.counter),
            signature: params.signature,
        });
    }
    buildMatching(_order, _data) {
        return {};
    }
}
exports.BundleAskBuilder = BundleAskBuilder;
//# sourceMappingURL=bundle-ask.js.map