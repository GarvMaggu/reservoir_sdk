"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const utils_1 = require("../../../utils");
class BaseBuilder {
    constructor(chainId) {
        this.chainId = chainId;
    }
    defaultInitialize(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Default listing time is 5 minutes in the past to allow for any
        // time discrepancies when checking the order's validity on-chain
        params.startTime = (_a = params.startTime) !== null && _a !== void 0 ? _a : (0, utils_1.getCurrentTimestamp)(-5 * 60);
        params.endTime = (_b = params.endTime) !== null && _b !== void 0 ? _b : (0, utils_1.getCurrentTimestamp)(365 * 24 * 60 * 60);
        params.minPercentageToAsk = (_c = params.minPercentageToAsk) !== null && _c !== void 0 ? _c : 8500;
        params.nonce = (_d = params.nonce) !== null && _d !== void 0 ? _d : (0, utils_1.getRandomBytes)(10);
        params.v = (_e = params.v) !== null && _e !== void 0 ? _e : 0;
        params.r = (_f = params.r) !== null && _f !== void 0 ? _f : constants_1.HashZero;
        params.s = (_g = params.s) !== null && _g !== void 0 ? _g : constants_1.HashZero;
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=index.js.map