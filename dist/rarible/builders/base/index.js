"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
const utils_1 = require("../../../utils");
class BaseBuilder {
    constructor(chainId) {
        this.chainId = chainId;
    }
    defaultInitialize(params) {
        var _a;
        params.salt = (_a = params.salt) !== null && _a !== void 0 ? _a : (0, utils_1.getRandomBytes)();
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=index.js.map