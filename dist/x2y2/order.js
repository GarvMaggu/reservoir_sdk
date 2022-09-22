"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const abi_1 = require("@ethersproject/abi");
const constants_1 = require("@ethersproject/constants");
const Types = __importStar(require("./types"));
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
    static fromLocalOrder(chainId, localOrder) {
        if (localOrder.items.length !== 1) {
            throw new Error("Batch orders are no supported");
        }
        const decodedItems = abi_1.defaultAbiCoder.decode(["(address token, uint256 tokenId)[]"], localOrder.items[0].data);
        if (decodedItems.length !== 1) {
            throw new Error("Bundle orders are not supported");
        }
        return new Order(chainId, {
            type: localOrder.intent === Types.Intent.SELL ? "sell" : "buy",
            currency: localOrder.currency,
            price: localOrder.items[0].price,
            maker: localOrder.user,
            taker: constants_1.AddressZero,
            deadline: localOrder.deadline,
            nft: {
                token: decodedItems[0][0].token,
                tokenId: decodedItems[0][0].tokenId,
            },
            // The fields below are mocked (they are only available on upstream orders)
            id: 0,
            itemHash: constants_1.HashZero,
        });
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
            tokenId: order.nft.tokenId !== undefined ? (0, utils_1.s)(order.nft.tokenId) : undefined,
        },
    };
};
//# sourceMappingURL=order.js.map