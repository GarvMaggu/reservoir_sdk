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
const abi_1 = require("@ethersproject/abi");
const bytes_1 = require("@ethersproject/bytes");
const contracts_1 = require("@ethersproject/contracts");
const keccak256_1 = require("@ethersproject/keccak256");
const axios_1 = __importDefault(require("axios"));
const Addresses = __importStar(require("./addresses"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
class Exchange {
    constructor(chainId, apiKey) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
        this.apiKey = apiKey;
    }
    // --- Fill order ---
    async fillOrder(taker, order, options) {
        const tx = await this.fillOrderTx(await taker.getAddress(), order, options);
        return taker.sendTransaction(tx);
    }
    async fillOrderTx(taker, order, options) {
        const response = await axios_1.default.post("https://api.x2y2.org/api/orders/sign", {
            caller: taker,
            // COMPLETE_SELL_OFFER
            op: 1,
            amountToEth: "0",
            amountToWeth: "0",
            items: [
                {
                    orderId: order.params.id,
                    currency: order.params.currency,
                    price: order.params.price,
                },
            ],
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this.apiKey,
            },
        });
        return {
            from: taker,
            data: this.contract.interface.getSighash("run") +
                response.data.data[0].input.slice(2) +
                (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            to: this.contract.address,
            value: (0, utils_1.bn)(order.params.price).toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = await this.cancelOrderTx(maker, order);
        return maker.sendTransaction(tx);
    }
    async cancelOrderTx(maker, order) {
        const signMessage = (0, keccak256_1.keccak256)("0x");
        const sign = await maker.signMessage((0, bytes_1.arrayify)(signMessage));
        const response = await axios_1.default.post("https://api.x2y2.org/api/orders/cancel", {
            caller: maker,
            // CANCEL_OFFER
            op: 3,
            items: [{ orderId: order.params.id }],
            sign_message: signMessage,
            sign,
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this.apiKey,
            },
        });
        const input = abi_1.defaultAbiCoder.decode([
            "(bytes32[] itemHashes, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
        ], response.data.input)[0];
        return {
            from: await maker.getAddress(),
            data: this.contract.interface.encodeFunctionData("cancel", [
                input.itemHashes,
                input.deadline,
                input.v,
                input.r,
                input.s,
            ]),
            to: this.contract.address,
        };
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map