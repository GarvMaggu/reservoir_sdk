"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBundleBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const utils_1 = require("../../../utils");
class BaseBundleBuilder {
    constructor(chainId) {
        this.chainId = chainId;
    }
    defaultInitialize(params) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // Default listing time is 5 minutes in the past to allow for any
        // time discrepancies when checking the order's validity on-chain
        params.startTime = (_a = params.startTime) !== null && _a !== void 0 ? _a : (0, utils_1.getCurrentTimestamp)(-5 * 60);
        params.endTime = (_b = params.endTime) !== null && _b !== void 0 ? _b : 0;
        params.taker = (_c = params.taker) !== null && _c !== void 0 ? _c : constants_1.AddressZero;
        params.conduitKey = (_d = params.conduitKey) !== null && _d !== void 0 ? _d : constants_1.HashZero;
        params.zone = (_e = params.zone) !== null && _e !== void 0 ? _e : constants_1.AddressZero;
        params.zoneHash = (_f = params.zoneHash) !== null && _f !== void 0 ? _f : constants_1.HashZero;
        params.salt = (_g = params.salt) !== null && _g !== void 0 ? _g : (0, utils_1.getRandomBytes)();
        params.signature = (_h = params.signature) !== null && _h !== void 0 ? _h : constants_1.HashZero;
    }
    baseIsValid(order) {
        for (let i = 0; i < order.params.offer.length; i++) {
            if (order.params.offer[i].startAmount == "0" ||
                order.params.offer[i].endAmount == "0") {
                return false;
            }
        }
        for (let i = 0; i < order.params.consideration.length; i++) {
            if (order.params.consideration[i].startAmount == "0" ||
                order.params.consideration[i].endAmount == "0") {
                return false;
            }
        }
        return true;
    }
}
exports.BaseBundleBuilder = BaseBundleBuilder;
//# sourceMappingURL=bundle.js.map