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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exchange = void 0;
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Fill order ---
    async fillOrder(taker, makerOrder, takerOrderParams, options) {
        const tx = this.fillOrderTx(await taker.getAddress(), makerOrder, takerOrderParams, options);
        return taker.sendTransaction(tx);
    }
    fillOrderTx(taker, makerOrder, takerOrderParams, options) {
        let data;
        let value;
        if (makerOrder.params.isOrderAsk) {
            data = this.contract.interface.encodeFunctionData("matchAskWithTakerBidUsingETHAndWETH", [takerOrderParams, makerOrder.params]);
            value = makerOrder.params.price;
        }
        else {
            data = this.contract.interface.encodeFunctionData("matchBidWithTakerAsk", [takerOrderParams, makerOrder.params]);
        }
        return {
            from: taker,
            to: this.contract.address,
            data: data + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: value && (0, utils_1.bn)(value).toHexString(),
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
            data: this.contract.interface.encodeFunctionData("cancelMultipleMakerOrders", [[order.params.nonce]]),
        };
    }
    // --- Get nonce ---
    async getNonce(provider, user) {
        return new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default)
            .connect(provider)
            .userMinOrderNonce(user);
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map