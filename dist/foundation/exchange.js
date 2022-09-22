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
// Foundation:
// - escrowed orderbook
// - fully on-chain
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Create order ---
    async createOrder(maker, order) {
        const tx = this.createOrderTx(order);
        return maker.sendTransaction(tx);
    }
    createOrderTx(order) {
        return {
            from: order.params.maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("setBuyPrice", [
                order.params.contract,
                order.params.tokenId,
                order.params.price,
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
            data: this.contract.interface.encodeFunctionData("buyV2", [
                order.params.contract,
                order.params.tokenId,
                order.params.price,
                (_a = options === null || options === void 0 ? void 0 : options.nativeReferrerAddress) !== null && _a !== void 0 ? _a : constants_1.AddressZero,
            ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: (0, utils_1.bn)(order.params.price).toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = this.cancelOrderTx(order);
        return maker.sendTransaction(tx);
    }
    cancelOrderTx(order) {
        return {
            from: order.params.maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("cancelBuyPrice", [
                order.params.contract,
                order.params.tokenId,
            ]),
        };
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map