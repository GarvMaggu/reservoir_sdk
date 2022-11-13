"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTokenBuilder = void 0;
const base_1 = require("../base");
const order_1 = require("../../order");
const utils_1 = require("../../../utils");
const ethers_1 = require("ethers/lib/ethers");
const types_1 = require("../../types");
const constants_1 = require("../../constants");
const utils_2 = require("../utils");
const utils_3 = require("../../utils");
class SingleTokenBuilder extends base_1.BaseBuilder {
    getInfo(order) {
        const side = (0, utils_3.getOrderSide)(order.params.make.assetType.assetClass, order.params.take.assetType.assetClass);
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
                assetClass: params.tokenKind.toUpperCase(),
                contract: (0, utils_1.lc)(params.contract),
                tokenId: params.tokenId,
                ...(params.uri ? { uri: params.uri } : {}),
                ...(params.supply ? { supply: params.supply } : {}),
                ...(params.creators ? { creators: params.creators } : {}),
                ...(params.signatures ? { signatures: params.signatures } : {}),
                ...(params.royalties ? { royalties: params.royalties } : {}),
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
            kind: "single-token",
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
        const rightOrder = {
            type: order.type,
            maker: (0, utils_1.lc)(taker),
            taker: order.maker,
            make: JSON.parse(JSON.stringify(order.take)),
            take: JSON.parse(JSON.stringify(order.make)),
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
            rightOrder.take.value = ethers_1.BigNumber.from(rightOrder.take.value).div(oldValue - rightOrder.make.value || "1");
        }
        return rightOrder;
    }
}
exports.SingleTokenBuilder = SingleTokenBuilder;
//# sourceMappingURL=index.js.map