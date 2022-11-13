"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderData = void 0;
const constants_1 = require("../../constants");
const buildOrderData = (params) => {
    switch (params.dataType) {
        // Can't find info about Legacy type in the contract but it's found in V1 orders that Rarible's API returns
        case constants_1.ORDER_DATA_TYPES.LEGACY:
            const legacyData = {
                dataType: constants_1.ORDER_DATA_TYPES.LEGACY,
                fee: params.fee,
            };
            return legacyData;
        case constants_1.ORDER_DATA_TYPES.V1:
            const v1Data = {
                dataType: constants_1.ORDER_DATA_TYPES.V1,
                payouts: params.payouts,
                originFees: params.originFees,
            };
            return v1Data;
        case constants_1.ORDER_DATA_TYPES.V2:
            const v2Data = {
                dataType: constants_1.ORDER_DATA_TYPES.V2,
                payouts: params.payouts,
                originFees: params.originFees,
            };
            return v2Data;
        case constants_1.ORDER_DATA_TYPES.V3_SELL:
            const v3SellData = {
                dataType: constants_1.ORDER_DATA_TYPES.V3_SELL,
                payouts: params.payouts[0],
                originFeeFirst: params.originFeeFirst,
                originFeeSecond: params.originFeeSecond,
                maxFeesBasePoint: params.maxFeesBasePoint,
                marketplaceMarker: params.marketplaceMarker,
            };
            return v3SellData;
        case constants_1.ORDER_DATA_TYPES.V3_BUY:
            const v3BuyData = {
                dataType: constants_1.ORDER_DATA_TYPES.V3_BUY,
                payouts: params.payouts[0],
                originFeeFirst: params.originFeeFirst,
                originFeeSecond: params.originFeeSecond,
                marketplaceMarker: params.marketplaceMarker,
            };
            return v3BuyData;
        default:
            throw Error("Unknown order data type");
    }
};
exports.buildOrderData = buildOrderData;
//# sourceMappingURL=index.js.map