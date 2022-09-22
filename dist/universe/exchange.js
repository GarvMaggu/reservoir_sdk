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
const lib_1 = require("ethers/lib");
const utils_2 = require("./utils");
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Fill order ---
    async fillOrder(taker, makerOrder, takerOrderParams, options) {
        const tx = await this.fillOrderTx(await taker.getAddress(), makerOrder, takerOrderParams, options);
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
    async fillOrderTx(taker, makerOrder, takerOrderParams, options) {
        // 3. generate the match tx
        const value = this.calculateTxValue(makerOrder.params.take.assetType.assetClass, makerOrder.params.take.value);
        const { from, to, data, value: matchedValue, } = await this.contract.populateTransaction.matchOrders((0, utils_2.encode)(makerOrder.params), makerOrder.params.signature, (0, utils_2.encode)(takerOrderParams), "0x", {
            from: taker,
            value: value.toString(),
        });
        return {
            from: from,
            to: to,
            data: data + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: matchedValue && matchedValue.toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = await this.contract.populateTransaction.cancel((0, utils_2.encode)(order.params));
        return maker.sendTransaction(tx);
    }
    /**
     * Get the DAO fee from the marketplace contract
     * @returns uint DAO fee
     */
    async getDaoFee(provider) {
        return this.contract.connect(provider).daoFee();
    }
    /**
     * Get the fee receiver the marketplace contract (will always be the DAO unless voted otherwise)
     * @returns string DAO address
     */
    async getFeeReceiver(provider) {
        return this.contract.connect(provider).defaultFeeReceiver();
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