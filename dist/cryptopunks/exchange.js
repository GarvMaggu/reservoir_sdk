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
// CryptoPunks:
// - escrowed orderbook
// - fully on-chain
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Create listing ---
    async createListing(maker, order) {
        const tx = this.createListingTx(order);
        return maker.sendTransaction(tx);
    }
    createListingTx(order) {
        if (order.params.side !== "sell") {
            throw new Error("Invalid order side");
        }
        return {
            from: order.params.maker,
            to: this.contract.address,
            data: order.params.taker
                ? this.contract.interface.encodeFunctionData("offerPunkForSaleToAddress", [order.params.tokenId, order.params.price, order.params.taker])
                : this.contract.interface.encodeFunctionData("offerPunkForSale", [
                    order.params.tokenId,
                    order.params.price,
                ]),
        };
    }
    // --- Cancel listing ---
    async cancelListing(maker, order) {
        const tx = this.cancelListingTx(order);
        return maker.sendTransaction(tx);
    }
    cancelListingTx(order) {
        if (order.params.side !== "sell") {
            throw new Error("Invalid order side");
        }
        return {
            from: order.params.maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("punkNoLongerForSale", [
                order.params.tokenId,
            ]),
        };
    }
    // --- Fill listing ---
    async fillListing(taker, order, options) {
        const tx = this.fillListingTx(await taker.getAddress(), order, options);
        return taker.sendTransaction(tx);
    }
    fillListingTx(taker, order, options) {
        return {
            from: taker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("buyPunk", [
                order.params.tokenId,
            ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: (0, utils_1.bn)(order.params.price).toHexString(),
        };
    }
    // --- Create bid ---
    async createBid(maker, order) {
        const tx = this.createBidTx(order);
        return maker.sendTransaction(tx);
    }
    createBidTx(order) {
        if (order.params.side !== "buy") {
            throw new Error("Invalid order side");
        }
        return {
            from: order.params.maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("enterBidForPunk", [
                order.params.tokenId,
            ]),
            value: (0, utils_1.bn)(order.params.price).toHexString(),
        };
    }
    // --- Cancel bid ---
    async cancelBid(maker, order) {
        const tx = this.cancelBidTx(order);
        return maker.sendTransaction(tx);
    }
    cancelBidTx(order) {
        if (order.params.side !== "buy") {
            throw new Error("Invalid order side");
        }
        return {
            from: order.params.maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("withdrawBidForPunk", [
                order.params.tokenId,
            ]),
        };
    }
    // --- Fill bid ---
    async fillBid(taker, order, options) {
        const tx = this.fillBidTx(await taker.getAddress(), order, options);
        return taker.sendTransaction(tx);
    }
    fillBidTx(taker, order, options) {
        return {
            from: taker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("acceptBidForPunk", [
                order.params.tokenId,
                order.params.price,
            ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
        };
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map