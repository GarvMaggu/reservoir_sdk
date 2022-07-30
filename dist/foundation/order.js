"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const utils_1 = require("../utils");
class Order {
    constructor(chainId, params) {
        this.chainId = chainId;
        try {
            this.params = normalize(params);
        }
        catch {
            throw new Error("Invalid params");
        }
    }
}
exports.Order = Order;
const normalize = (order) => {
    // Perform some normalization operations on the order:
    // - convert bignumbers to strings where needed
    // - convert strings to numbers where needed
    // - lowercase all strings
    return {
        maker: (0, utils_1.lc)(order.maker),
        contract: (0, utils_1.lc)(order.contract),
        tokenId: (0, utils_1.s)(order.tokenId),
        price: (0, utils_1.s)(order.price),
    };
};
//# sourceMappingURL=order.js.map