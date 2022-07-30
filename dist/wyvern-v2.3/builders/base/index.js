"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const utils_1 = require("../../../utils");
const types_1 = require("../../types");
class BaseBuilder {
    constructor(chainId) {
        this.chainId = chainId;
    }
    defaultInitialize(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Default listing time is 5 minutes in the past to allow for any
        // time discrepancies when checking the order's validity on-chain
        params.listingTime = (_a = params.listingTime) !== null && _a !== void 0 ? _a : (0, utils_1.getCurrentTimestamp)(-5 * 60);
        params.expirationTime = (_b = params.expirationTime) !== null && _b !== void 0 ? _b : 0;
        params.salt = (_c = params.salt) !== null && _c !== void 0 ? _c : (0, utils_1.getRandomBytes)();
        params.extra = (_d = params.extra) !== null && _d !== void 0 ? _d : "0";
        params.v = (_e = params.v) !== null && _e !== void 0 ? _e : 0;
        params.r = (_f = params.r) !== null && _f !== void 0 ? _f : constants_1.HashZero;
        params.s = (_g = params.s) !== null && _g !== void 0 ? _g : constants_1.HashZero;
        if (this.isDutchAuction(params)) {
            this.validateDutchAuction(params);
            return types_1.OrderSaleKind.DUTCH_AUCTION;
        }
        else {
            return types_1.OrderSaleKind.FIXED_PRICE;
        }
    }
    isDutchAuction(params) {
        // The order's `extra` parameters specifies dutch auction details
        return (0, utils_1.bn)((params === null || params === void 0 ? void 0 : params.extra) || 0).gt(0);
    }
    validateDutchAuction(params) {
        if (this.isDutchAuction(params)) {
            // Make sure the expiration time is valid
            if ((0, utils_1.bn)(params.listingTime).gte((0, utils_1.bn)(params.expirationTime))) {
                throw new Error("Invalid listing/expiration time");
            }
            // We don't support dutch auctions for buy orders
            if (params.side === "buy") {
                throw new Error("Unsupported side");
            }
        }
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=index.js.map