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
exports.PackedListTokenListBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const base_1 = require("../../base");
const Addresses = __importStar(require("../../../addresses"));
const order_1 = require("../../../order");
const Types = __importStar(require("../../../types"));
const CommonAddresses = __importStar(require("../../../../common/addresses"));
const packed_list_1 = require("../../../../common/helpers/packed-list");
const utils_1 = require("../../../../utils");
class PackedListTokenListBuilder extends base_1.BaseBuilder {
    isValid(order) {
        try {
            const copyOrder = this.build({
                ...order.params,
                direction: order.params.direction === Types.TradeDirection.SELL ? "sell" : "buy",
                contract: order.params.nft,
                maker: order.params.maker,
                price: order.params.erc20TokenAmount,
                amount: order.params.nftAmount,
                tokenIds: (0, packed_list_1.decomposePackedList)(order.params.nftProperties[0].propertyData),
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
        this.defaultInitialize(params);
        return new order_1.Order(this.chainId, {
            kind: params.amount
                ? "erc1155-token-list-packed-list"
                : "erc721-token-list-packed-list",
            direction: params.direction === "sell"
                ? Types.TradeDirection.SELL
                : Types.TradeDirection.BUY,
            maker: params.maker,
            taker: constants_1.AddressZero,
            expiry: params.expiry,
            nonce: (0, utils_1.s)(params.nonce),
            erc20Token: params.direction === "sell"
                ? Addresses.Eth[this.chainId]
                : CommonAddresses.Weth[this.chainId],
            erc20TokenAmount: (0, utils_1.s)(params.price),
            fees: params.fees.map(({ recipient, amount }) => ({
                recipient: (0, utils_1.lc)(recipient),
                amount: (0, utils_1.s)(amount),
                feeData: utils_1.BytesEmpty,
            })),
            nft: params.contract,
            nftId: "0",
            nftProperties: [
                {
                    propertyValidator: Addresses.PackedListValidator[this.chainId],
                    propertyData: (0, packed_list_1.generatePackedList)(params.tokenIds),
                },
            ],
            nftAmount: params.amount ? (0, utils_1.s)(params.amount) : undefined,
            signatureType: params.signatureType,
            v: params.v,
            r: params.r,
            s: params.s,
        });
    }
    buildMatching(_order, data) {
        return {
            nftId: (0, utils_1.s)(data.tokenId),
            nftAmount: data.amount ? (0, utils_1.s)(data.amount) : "1",
            unwrapNativeToken: data.unwrapNativeToken,
        };
    }
    getInfo(order) {
        const tokenIds = (0, packed_list_1.decomposePackedList)(order.params.nftProperties[0].propertyData);
        return { tokenIds };
    }
}
exports.PackedListTokenListBuilder = PackedListTokenListBuilder;
//# sourceMappingURL=index.js.map