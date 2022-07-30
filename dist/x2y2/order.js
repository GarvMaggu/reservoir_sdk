"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const constants_1 = require("@ethersproject/constants");
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
        kind: order.kind,
        id: order.id,
        type: (0, utils_1.s)(order.type),
        currency: (0, utils_1.lc)(order.currency),
        price: (0, utils_1.s)(order.price),
        maker: (0, utils_1.lc)(order.maker),
        taker: order.taker ? (0, utils_1.lc)(order.taker) : constants_1.AddressZero,
        deadline: (0, utils_1.n)(order.deadline),
        itemHash: (0, utils_1.lc)(order.itemHash),
        nft: {
            token: (0, utils_1.lc)(order.nft.token),
            tokenId: (0, utils_1.s)(order.nft.tokenId),
        },
    };
};
//# sourceMappingURL=order.js.map