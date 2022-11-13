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
exports.ContractWideBuilder = void 0;
const base_1 = require("../base");
const order_1 = require("../../order");
const Types = __importStar(require("../../types"));
const utils_1 = require("../../../utils");
const ethers_1 = require("ethers/lib/ethers");
const types_1 = require("../../types");
const constants_1 = require("../../constants");
const utils_2 = require("../utils");
class ContractWideBuilder extends base_1.BaseBuilder {
    getInfo(order) {
        let side;
        const makeAssetClass = order.params.make.assetType.assetClass;
        const takeAssetClass = order.params.take.assetType.assetClass;
        if ((makeAssetClass === Types.AssetClass.ERC721 ||
            makeAssetClass === Types.AssetClass.ERC1155) &&
            (takeAssetClass === Types.AssetClass.ERC20 ||
                takeAssetClass === Types.AssetClass.ETH)) {
            side = "sell";
        }
        else if (makeAssetClass === Types.AssetClass.ERC20 &&
            (takeAssetClass === Types.AssetClass.ERC721 ||
                takeAssetClass === Types.AssetClass.ERC1155 ||
                takeAssetClass === Types.AssetClass.COLLECTION)) {
            side = "buy";
        }
        else {
            throw new Error("Invalid asset class");
        }
        return {
            side,
        };
    }
    isValid(order) {
        //TODO: Add more validations (used by indexer)
        const { side } = this.getInfo(order);
        try {
            const nftInfo = side === "buy" ? order.params.take : order.params.make;
            const paymentInfo = side === "buy" ? order.params.make : order.params.take;
            let dataType = order.params.data.dataType;
            let data = JSON.parse(JSON.stringify(order.params.data));
            if (!Array.isArray(data.payouts)) {
                data.payouts = [data.payouts];
            }
            const copyOrder = this.build({
                ...order.params,
                ...data,
                dataType,
                side,
                maker: order.params.maker,
                tokenKind: nftInfo.assetType.assetClass,
                contract: (0, utils_1.lc)(nftInfo.assetType.contract),
                tokenId: nftInfo.assetType.tokenId,
                price: paymentInfo.value,
                paymentToken: paymentInfo.assetType.assetClass === types_1.AssetClass.ETH
                    ? ethers_1.constants.AddressZero
                    : (0, utils_1.lc)(paymentInfo.assetType.contract),
                tokenAmount: (0, utils_1.n)(nftInfo.value),
                uri: nftInfo.assetType.uri,
                supply: nftInfo.assetType.supply,
                royalties: nftInfo.assetType.royalties,
                signatures: nftInfo.assetType.signatures,
                creators: nftInfo.assetType.creators,
            });
            if (!copyOrder) {
                return false;
            }
            if (copyOrder.hashOrderKey() !== order.hashOrderKey()) {
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
        const nftInfo = {
            assetType: {
                assetClass: Types.AssetClass.COLLECTION,
                contract: (0, utils_1.lc)(params.contract),
            },
            value: (0, utils_1.s)(params.tokenAmount || 1),
        };
        const paymentInfo = {
            assetType: {
                ...(params.paymentToken && params.paymentToken !== ethers_1.constants.AddressZero
                    ? {
                        assetClass: types_1.AssetClass.ERC20,
                        contract: (0, utils_1.lc)(params.paymentToken),
                    }
                    : {
                        assetClass: types_1.AssetClass.ETH,
                    }),
            },
            value: params.price,
        };
        return new order_1.Order(this.chainId, {
            side: params.side,
            kind: "contract-wide",
            type: params.orderType,
            maker: params.maker,
            make: params.side === "buy" ? paymentInfo : nftInfo,
            taker: ethers_1.constants.AddressZero,
            take: params.side === "buy" ? nftInfo : paymentInfo,
            salt: (0, utils_1.s)(params.salt),
            start: params.startTime,
            end: params.endTime,
            data: (0, utils_2.buildOrderData)(params),
        });
    }
    buildMatching(order, taker, data) {
        let make, take = null;
        if (order.side === "buy") {
            take = JSON.parse(JSON.stringify(order.make));
            make = {
                assetType: {
                    assetClass: data.assetClass,
                    contract: order.take.assetType.contract,
                    tokenId: data.tokenId,
                },
                value: order.take.value,
            };
        }
        else {
            throw Error("Unknown side");
        }
        const rightOrder = {
            type: order.type,
            maker: (0, utils_1.lc)(taker),
            taker: order.maker,
            make,
            take,
            salt: 0,
            start: order.start,
            end: order.end,
            data: JSON.parse(JSON.stringify(order.data)),
        };
        if (order.data.dataType === constants_1.ORDER_DATA_TYPES.V2) {
            rightOrder.data.payouts = null;
            rightOrder.data.originFees = null;
        }
        // `V3` orders can only be matched if buy-order is `V3_BUY` and the sell-order is `V3_SELL`
        if (order.data.dataType === constants_1.ORDER_DATA_TYPES.V3_SELL) {
            rightOrder.data.dataType = constants_1.ORDER_DATA_TYPES.V3_BUY;
            rightOrder.data.originFeeFirst = null;
            rightOrder.data.originFeeSecond = null;
            rightOrder.data.maxFeesBasePoint = null;
            rightOrder.data.payouts = null;
        }
        else if (order.data.dataType === constants_1.ORDER_DATA_TYPES.V3_BUY) {
            rightOrder.data.dataType = constants_1.ORDER_DATA_TYPES.V3_SELL;
            rightOrder.data.originFeeFirst = null;
            rightOrder.data.originFeeSecond = null;
            rightOrder.data.payouts = null;
        }
        // for erc1155 we need to take the value from request (the amount parameter)
        if (types_1.AssetClass.ERC1155 == order.make.assetType.assetClass) {
            rightOrder.take.value = Math.floor(Number(data.amount)).toString();
        }
        if (types_1.AssetClass.ERC1155 == order.take.assetType.assetClass) {
            const oldValue = rightOrder.make.value;
            rightOrder.make.value = Math.floor(Number(data.amount)).toString();
            rightOrder.take.value = ethers_1.BigNumber.from(rightOrder.take.value)
                .div(oldValue - rightOrder.make.value || "1")
                .toString();
        }
        return rightOrder;
    }
}
exports.ContractWideBuilder = ContractWideBuilder;
//# sourceMappingURL=index.js.map