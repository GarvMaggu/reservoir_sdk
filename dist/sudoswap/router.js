"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const utils_1 = require("../utils");
const Router_json_1 = __importDefault(require("./abis/Router.json"));
// Sudoswap:
// - fully on-chain
// - pooled liquidity
class Router {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.RouterWithRoyalties[this.chainId], Router_json_1.default);
    }
    // --- Fill buy order ---
    async fillBuyOrder(taker, order, tokenId, options) {
        const tx = this.fillBuyOrderTx(await taker.getAddress(), order, tokenId, options);
        return taker.sendTransaction(tx);
    }
    fillBuyOrderTx(taker, order, tokenId, options) {
        var _a, _b;
        return {
            from: taker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("swapNFTsForToken", [
                [
                    {
                        pair: order.params.pair,
                        nftIds: [tokenId],
                    },
                ],
                (_a = order.params.price) !== null && _a !== void 0 ? _a : 0,
                (_b = options === null || options === void 0 ? void 0 : options.recipient) !== null && _b !== void 0 ? _b : taker,
                Math.floor(Date.now() / 1000) + 10 * 60,
            ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
        };
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map