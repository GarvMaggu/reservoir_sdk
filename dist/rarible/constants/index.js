"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_TYPES = exports.ORDER_DATA_TYPES = exports.DATA_TYPE_0X = exports.ORDER_DATA = void 0;
exports.ORDER_DATA = "ORDER_DATA";
exports.DATA_TYPE_0X = "0x";
// export const RARIBLE_TYPE = "RARIBLE_V1";
//TODO: These should be an enum
// export const RARIBLE_ORDER_TYPE_V1 = "V1";
// export const RARIBLE_ORDER_TYPE_V2 = "V2";
// export const RARIBLE_ORDER_TYPE_V3_SELL = "V3_SELL";
// export const RARIBLE_ORDER_TYPE_V3_BUY = "V3_BUY";
var ORDER_DATA_TYPES;
(function (ORDER_DATA_TYPES) {
    ORDER_DATA_TYPES["DEFAULT_DATA_TYPE"] = "0xffffffff";
    ORDER_DATA_TYPES["LEGACY"] = "LEGACY";
    ORDER_DATA_TYPES["V1"] = "V1";
    ORDER_DATA_TYPES["API_V1"] = "ETH_RARIBLE_V1";
    ORDER_DATA_TYPES["V2"] = "V2";
    ORDER_DATA_TYPES["API_V2"] = "ETH_RARIBLE_V2";
    ORDER_DATA_TYPES["V3_SELL"] = "V3_SELL";
    ORDER_DATA_TYPES["API_V3_SELL"] = "ETH_RARIBLE_V2_DATA_V3_SELL";
    ORDER_DATA_TYPES["V3_BUY"] = "V3_BUY";
    ORDER_DATA_TYPES["API_V3_BUY"] = "ETH_RARIBLE_V2_DATA_V3_BUY";
})(ORDER_DATA_TYPES = exports.ORDER_DATA_TYPES || (exports.ORDER_DATA_TYPES = {}));
var ORDER_TYPES;
(function (ORDER_TYPES) {
    ORDER_TYPES["V1"] = "RARIBLE_V1";
    ORDER_TYPES["V2"] = "RARIBLE_V2";
})(ORDER_TYPES = exports.ORDER_TYPES || (exports.ORDER_TYPES = {}));
//# sourceMappingURL=index.js.map