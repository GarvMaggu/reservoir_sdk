"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
class BaseBuilder {
    constructor(chainId) {
        this.chainId = chainId;
    }
    defaultInitialize(params) {
        // Default listing time is 5 minutes in the past to allow for any
        // time discrepancies when checking the order's validity on-chain
        // params.start = params.start ?? getCurrentTimestamp(-5 * 60);
        // params.end = params.end ?? getCurrentTimestamp(365 * 24 * 60 * 60);
        // params.signature = params.signature ?? "0x";
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=index.js.map