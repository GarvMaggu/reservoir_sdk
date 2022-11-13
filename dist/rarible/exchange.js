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
const Types = __importStar(require("./types"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
const lib_1 = require("ethers/lib");
const utils_2 = require("./utils");
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Fill order ---
    async fillOrder(taker, makerOrder, options) {
        const tx = await this.fillOrderTx(await taker.getAddress(), makerOrder, options);
        return taker.sendTransaction(tx);
    }
    /**
     * Calculate transaction value in case its a ETH order
     */
    calculateTxValue(takeClass, takeAmount) {
        let value = lib_1.BigNumber.from(0);
        // "ETH" can only be TAKE'a asset class in case it is a direct buy from a listing.
        // In this case transaction value is the ETH value from order.take.amount.
        // There can't be situations when ETH is a MAKE's asset class
        if (takeClass === "ETH") {
            value = lib_1.BigNumber.from(takeAmount);
        }
        return value;
    }
    async fillOrderTx(taker, makerOrder, options) {
        var _a;
        let result;
        const side = (_a = makerOrder.getInfo()) === null || _a === void 0 ? void 0 : _a.side;
        const takerOrderParams = makerOrder.buildMatching(taker, options);
        const value = this.calculateTxValue(makerOrder.params.take.assetType.assetClass, makerOrder.params.take.value);
        //TODO: We can refactor this in the future to use directAcceptBid function to cost less gass
        if (side === "buy" &&
            makerOrder.params.take.assetType.assetClass ===
                Types.AssetClass.COLLECTION) {
            result = await this.contract.populateTransaction.matchOrders((0, utils_2.encodeForMatchOrders)(makerOrder.params), makerOrder.params.signature, (0, utils_2.encodeForMatchOrders)(takerOrderParams), "0x", {
                from: taker,
                value: value.toString(),
            });
        }
        else if (side === "buy" &&
            (makerOrder.params.take.assetType.assetClass ===
                Types.AssetClass.ERC1155 ||
                makerOrder.params.take.assetType.assetClass === Types.AssetClass.ERC721)) {
            const encodedOrder = (0, utils_2.encodeForContract)(makerOrder.params, takerOrderParams);
            result = await this.contract.populateTransaction.directAcceptBid(encodedOrder, {
                from: taker,
                value: value.toString(),
            });
        }
        else if (side === "sell") {
            const encodedOrder = (0, utils_2.encodeForContract)(makerOrder.params, takerOrderParams);
            result = await this.contract.populateTransaction.directPurchase(encodedOrder, {
                from: taker,
                value: value.toString(),
            });
        }
        else {
            throw Error("Unknown order side");
        }
        return {
            from: result.from,
            to: result.to,
            data: result.data + (0, utils_1.generateSourceBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: result.value && result.value.toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = await this.cancelOrderTx(order.params);
        return maker.sendTransaction(tx);
    }
    async cancelOrderTx(orderParams) {
        const { from, to, data, value } = await this.contract.populateTransaction.cancel((0, utils_2.encodeForMatchOrders)(orderParams));
        return {
            from: from,
            to: to,
            data: data,
            value: value && value.toHexString(),
        };
    }
    /**
     * Get the fill amount of a specifc order
     * @returns uint256 order fill
     */
    async getOrderFill(provider, order) {
        const hash = order.hashOrderKey();
        return this.contract.connect(provider).fills(hash);
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map