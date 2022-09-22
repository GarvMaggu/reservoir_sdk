"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.TokenListBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const helpers_1 = require("../../../common/helpers");
const base_1 = require("../base");
const order_1 = require("../../order");
const Types = __importStar(require("../../types"));
const utils_1 = require("../../../utils");
class TokenListBuilder extends base_1.BaseBuilder {
    constructor(chainId) {
        super(chainId);
    }
    getInfo(order) {
        try {
            const { side, isDynamic } = this.getBaseInfo(order);
            const offerItem = order.params.offer[0];
            if (side === "buy") {
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
                const tokenKind = item.itemType === Types.ItemType.ERC721 ||
                    item.itemType === Types.ItemType.ERC721_WITH_CRITERIA
                    ? "erc721"
                    : "erc1155";
                const contract = item.token;
                const merkleRoot = item.identifierOrCriteria;
                const amount = item.startAmount;
                return {
                    tokenKind,
                    side,
                    contract,
                    merkleRoot,
                    amount,
                    paymentToken,
                    price,
                    fees,
                    taker: constants_1.AddressZero,
                };
            }
            else {
                throw new Error("Unsupported order side");
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
            if (!(info === null || info === void 0 ? void 0 : info.merkleRoot)) {
                return false;
            }
            const copyOrder = this.build({
                ...order.params,
                ...info,
                // We will anyway override the criteria which gets generated from `tokenIds`
                tokenIds: [0],
            });
            copyOrder.params.consideration[0].identifierOrCriteria = info.merkleRoot;
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
        var _a, _b, _c;
        this.defaultInitialize(params);
        if (params.side === "buy") {
            const merkleTree = (0, helpers_1.generateMerkleTree)(params.tokenIds);
            return new order_1.Order(this.chainId, {
                kind: "token-list",
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
                        itemType: 2 +
                            (params.tokenKind === "erc721"
                                ? Types.ItemType.ERC721
                                : Types.ItemType.ERC1155),
                        token: params.contract,
                        identifierOrCriteria: (0, utils_1.lc)(merkleTree.getHexRoot()),
                        startAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_a = params.amount) !== null && _a !== void 0 ? _a : 1 : 1),
                        endAmount: (0, utils_1.s)(params.tokenKind === "erc1155" ? (_b = params.amount) !== null && _b !== void 0 ? _b : 1 : 1),
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
                        (params.tokenKind === "erc1155" || (0, utils_1.bn)((_c = params.amount) !== null && _c !== void 0 ? _c : 1).gt(1)
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
            throw new Error("Unsupported order side");
        }
    }
    buildMatching(_order, data) {
        const merkleTree = (0, helpers_1.generateMerkleTree)(data.tokenIds);
        const merkleProof = (0, helpers_1.generateMerkleProof)(merkleTree, data.tokenId);
        return {
            amount: (data === null || data === void 0 ? void 0 : data.amount) ? (0, utils_1.s)(data.amount) : undefined,
            criteriaResolvers: [
                {
                    orderIndex: 0,
                    side: Types.Side.CONSIDERATION,
                    index: 0,
                    identifier: data.tokenId,
                    criteriaProof: merkleProof,
                },
            ],
        };
    }
}
exports.TokenListBuilder = TokenListBuilder;
//# sourceMappingURL=index.js.map