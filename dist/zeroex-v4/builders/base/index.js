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
        params.fees = (_a = params.fees) !== null && _a !== void 0 ? _a : [];
        params.expiry = (_b = params.expiry) !== null && _b !== void 0 ? _b : (0, utils_1.getCurrentTimestamp)(365 * 24 * 60 * 60);
        params.nonce = (_c = params.nonce) !== null && _c !== void 0 ? _c : (0, utils_1.getRandomBytes)();
        params.signatureType = (_d = params.signatureType) !== null && _d !== void 0 ? _d : 2;
        params.v = (_e = params.v) !== null && _e !== void 0 ? _e : 0;
        params.r = (_f = params.r) !== null && _f !== void 0 ? _f : constants_1.HashZero;
        params.s = (_g = params.s) !== null && _g !== void 0 ? _g : constants_1.HashZero;
    }
    getInfo(_order) {
        return {};
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=index.js.map