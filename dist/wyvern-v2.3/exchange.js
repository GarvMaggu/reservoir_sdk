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
const CommonAddresses = __importStar(require("../common/addresses"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
    }
    // --- Fill order ---
    async fillOrder(taker, buyOrder, sellOrder, options) {
        const tx = this.fillOrderTx(await taker.getAddress(), buyOrder, sellOrder, options);
        return taker.sendTransaction(tx);
    }
    fillOrderTx(taker, buyOrder, sellOrder, options) {
        const addrs = [
            buyOrder.params.exchange,
            buyOrder.params.maker,
            buyOrder.params.taker,
            buyOrder.params.feeRecipient,
            buyOrder.params.target,
            buyOrder.params.staticTarget,
            buyOrder.params.paymentToken,
            sellOrder.params.exchange,
            sellOrder.params.maker,
            sellOrder.params.taker,
            sellOrder.params.feeRecipient,
            sellOrder.params.target,
            sellOrder.params.staticTarget,
            sellOrder.params.paymentToken,
        ];
        const uints = [
            buyOrder.params.makerRelayerFee,
            buyOrder.params.takerRelayerFee,
            0,
            0,
            buyOrder.params.basePrice,
            buyOrder.params.extra,
            buyOrder.params.listingTime,
            buyOrder.params.expirationTime,
            buyOrder.params.salt,
            sellOrder.params.makerRelayerFee,
            sellOrder.params.takerRelayerFee,
            0,
            0,
            sellOrder.params.basePrice,
            sellOrder.params.extra,
            sellOrder.params.listingTime,
            sellOrder.params.expirationTime,
            sellOrder.params.salt,
        ];
        const feeMethodsSidesKindsHowToCalls = [
            1,
            buyOrder.params.side,
            buyOrder.params.saleKind,
            buyOrder.params.howToCall,
            1,
            sellOrder.params.side,
            sellOrder.params.saleKind,
            sellOrder.params.howToCall,
        ];
        const data = new contracts_1.Contract(buyOrder.params.exchange, Exchange_json_1.default).interface.encodeFunctionData("atomicMatch_", [
            addrs,
            uints,
            feeMethodsSidesKindsHowToCalls,
            buyOrder.params.calldata,
            sellOrder.params.calldata,
            buyOrder.params.replacementPattern,
            sellOrder.params.replacementPattern,
            buyOrder.params.staticExtradata,
            sellOrder.params.staticExtradata,
            [buyOrder.params.v, sellOrder.params.v],
            [
                buyOrder.params.r,
                buyOrder.params.s,
                sellOrder.params.r,
                sellOrder.params.s,
                constants_1.HashZero.slice(0, -1) + "f",
            ],
        ]);
        const value = buyOrder.params.paymentToken === CommonAddresses.Eth[this.chainId]
            ? buyOrder.getMatchingPrice()
            : undefined;
        return {
            from: taker,
            to: buyOrder.params.exchange,
            data: data + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: value ? (0, utils_1.bn)(value).toHexString() : undefined,
        };
    }
    cancelTransaction(maker, order) {
        const addrs = [
            order.params.exchange,
            order.params.maker,
            order.params.taker,
            order.params.feeRecipient,
            order.params.target,
            order.params.staticTarget,
            order.params.paymentToken,
        ];
        const uints = [
            order.params.makerRelayerFee,
            order.params.takerRelayerFee,
            0,
            0,
            order.params.basePrice,
            order.params.extra,
            order.params.listingTime,
            order.params.expirationTime,
            order.params.salt,
        ];
        const data = new contracts_1.Contract(order.params.exchange, Exchange_json_1.default).interface.encodeFunctionData("cancelOrder_", [
            addrs,
            uints,
            1,
            order.params.side,
            order.params.saleKind,
            order.params.howToCall,
            order.params.calldata,
            order.params.replacementPattern,
            order.params.staticExtradata,
            order.params.v,
            order.params.r,
            order.params.s,
        ]);
        return { from: maker, to: order.params.exchange, data };
    }
    async cancel(maker, order) {
        const addrs = [
            order.params.exchange,
            order.params.maker,
            order.params.taker,
            order.params.feeRecipient,
            order.params.target,
            order.params.staticTarget,
            order.params.paymentToken,
        ];
        const uints = [
            order.params.makerRelayerFee,
            order.params.takerRelayerFee,
            0,
            0,
            order.params.basePrice,
            order.params.extra,
            order.params.listingTime,
            order.params.expirationTime,
            order.params.salt,
        ];
        return new contracts_1.Contract(order.params.exchange, Exchange_json_1.default)
            .connect(maker)
            .cancelOrder_(addrs, uints, 1, // feeMethod (always 1 - SplitFee)
        order.params.side, order.params.saleKind, order.params.howToCall, order.params.calldata, order.params.replacementPattern, order.params.staticExtradata, order.params.v, order.params.r, order.params.s);
    }
    async incrementNonce(user) {
        return new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default)
            .connect(user)
            .incrementNonce();
    }
    async getNonce(provider, user) {
        return new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default)
            .connect(provider)
            .nonces(user);
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map