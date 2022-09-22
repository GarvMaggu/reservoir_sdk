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
exports.Exchange = void 0;
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
// Zora:
// - escrowed orderbook
// - fully on-chain
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Create order ---
    async createOrder(maker, order) {
        const tx = this.createOrderTx(await maker.getAddress(), order);
        return maker.sendTransaction(tx);
    }
    createOrderTx(maker, order) {
        return {
            from: maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("createAsk", [
                order.params.tokenContract,
                order.params.tokenId,
                order.params.askPrice,
                order.params.askCurrency,
                order.params.sellerFundsRecipient,
                order.params.findersFeeBps,
            ]),
        };
    }
    // --- Fill order ---
    async fillOrder(taker, order, options) {
        const tx = this.fillOrderTx(await taker.getAddress(), order, options);
        return taker.sendTransaction(tx);
    }
    fillOrderTx(taker, order, options) {
        var _a;
        return {
            from: taker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("fillAsk", [
                order.params.tokenContract,
                order.params.tokenId,
                order.params.askCurrency,
                order.params.askPrice,
                (_a = options === null || options === void 0 ? void 0 : options.finder) !== null && _a !== void 0 ? _a : constants_1.AddressZero,
            ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.finder),
            value: (0, utils_1.bn)(order.params.askPrice).toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = this.cancelOrderTx(await maker.getAddress(), order);
        return maker.sendTransaction(tx);
    }
    cancelOrderTx(maker, order) {
        return {
            from: maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("cancelAsk", [
                order.params.tokenContract,
                order.params.tokenId,
            ]),
        };
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map