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
        // https://github.com/ourzora/v3/blob/main/contracts/modules/Asks/V1.1/AsksV1_1.sol#L117-L131
        askCurrency: (0, utils_1.lc)(order.askCurrency),
        askPrice: (0, utils_1.s)(order.askPrice),
        findersFeeBps: (0, utils_1.n)(order.findersFeeBps),
        sellerFundsRecipient: (0, utils_1.lc)(order.sellerFundsRecipient),
        tokenContract: (0, utils_1.lc)(order.tokenContract),
        tokenId: (0, utils_1.s)(order.tokenId), // uint256
    };
};
//# sourceMappingURL=order.js.map