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
exports.Order = void 0;
const bytes_1 = require("@ethersproject/bytes");
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const hash_1 = require("@ethersproject/hash");
const wallet_1 = require("@ethersproject/wallet");
const Addresses = __importStar(require("./addresses"));
const builders_1 = require("./builders");
const Common = __importStar(require("../common"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
class Order {
    constructor(chainId, params) {
        this.chainId = chainId;
        try {
            this.params = normalize(params);
        }
        catch {
            throw new Error("Invalid params");
        }
        // Detect kind
        if (!params.kind) {
            this.params.kind = this.detectKind();
        }
        // Perform light validations
        // Validate listing and expiration times
        if (this.params.startTime >= this.params.endTime) {
            throw new Error("Invalid listing and/or expiration time");
        }
    }
    hash() {
        return hash_1._TypedDataEncoder.hashStruct("MakerOrder", EIP712_TYPES, this.params);
    }
    async sign(signer) {
        const { v, r, s } = (0, bytes_1.splitSignature)(await signer._signTypedData(EIP712_DOMAIN(this.chainId), EIP712_TYPES, this.params));
        this.params = {
            ...this.params,
            v,
            r,
            s,
        };
    }
    getSignatureData() {
        return {
            signatureKind: "eip712",
            domain: EIP712_DOMAIN(this.chainId),
            types: EIP712_TYPES,
            value: toRawOrder(this),
        };
    }
    checkSignature() {
        var _a, _b;
        const signer = (0, wallet_1.verifyTypedData)(EIP712_DOMAIN(this.chainId), EIP712_TYPES, toRawOrder(this), {
            v: this.params.v,
            r: (_a = this.params.r) !== null && _a !== void 0 ? _a : "",
            s: (_b = this.params.s) !== null && _b !== void 0 ? _b : "",
        });
        if ((0, utils_1.lc)(this.params.signer) !== (0, utils_1.lc)(signer)) {
            throw new Error("Invalid signature");
        }
    }
    checkValidity() {
        if (!this.getBuilder().isValid(this)) {
            throw new Error("Invalid order");
        }
    }
    async checkFillability(provider) {
        const chainId = await provider.getNetwork().then((n) => n.chainId);
        const exchange = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default, provider);
        const executedOrCancelled = await exchange.isUserOrderNonceExecutedOrCancelled(this.params.signer, this.params.nonce);
        if (executedOrCancelled) {
            throw new Error("executed-or-cancelled");
        }
        if (this.params.isOrderAsk) {
            // Detect the collection kind (erc721 or erc1155)
            let kind;
            if (!kind) {
                const erc721 = new Common.Helpers.Erc721(provider, this.params.collection);
                if (await erc721.isValid()) {
                    kind = "erc721";
                    // Check ownership
                    const owner = await erc721.getOwner(this.params.tokenId);
                    if ((0, utils_1.lc)(owner) !== (0, utils_1.lc)(this.params.signer)) {
                        throw new Error("no-balance");
                    }
                    // Check approval
                    const isApproved = await erc721.isApproved(this.params.signer, Addresses.TransferManagerErc721[this.chainId]);
                    if (!isApproved) {
                        throw new Error("no-approval");
                    }
                }
            }
            if (!kind) {
                const erc1155 = new Common.Helpers.Erc1155(provider, this.params.collection);
                if (await erc1155.isValid()) {
                    kind = "erc1155";
                    // Check balance
                    const balance = await erc1155.getBalance(this.params.signer, this.params.tokenId);
                    if ((0, utils_1.bn)(balance).lt(1)) {
                        throw new Error("no-balance");
                    }
                    // Check approval
                    const isApproved = await erc1155.isApproved(this.params.signer, Addresses.TransferManagerErc1155[this.chainId]);
                    if (!isApproved) {
                        throw new Error("no-approval");
                    }
                }
            }
            if (!kind) {
                throw new Error("invalid");
            }
        }
        else {
            // Check that maker has enough balance to cover the payment
            // and the approval to the token transfer proxy is set
            const erc20 = new Common.Helpers.Erc20(provider, this.params.currency);
            const balance = await erc20.getBalance(this.params.signer);
            if ((0, utils_1.bn)(balance).lt(this.params.price)) {
                throw new Error("no-balance");
            }
            // Check allowance
            const allowance = await erc20.getAllowance(this.params.signer, Addresses.Exchange[chainId]);
            if ((0, utils_1.bn)(allowance).lt(this.params.price)) {
                throw new Error("no-approval");
            }
        }
    }
    buildMatching(taker, data) {
        return this.getBuilder().buildMatching(this, taker, data);
    }
    getBuilder() {
        switch (this.params.kind) {
            case "single-token": {
                return new builders_1.Builders.SingleToken(this.chainId);
            }
            case "contract-wide": {
                return new builders_1.Builders.ContractWide(this.chainId);
            }
            default: {
                throw new Error("Unknown order kind");
            }
        }
    }
    detectKind() {
        // single-token
        {
            const builder = new builders_1.Builders.SingleToken(this.chainId);
            if (builder.isValid(this)) {
                return "single-token";
            }
        }
        // contract-wide
        {
            const builder = new builders_1.Builders.ContractWide(this.chainId);
            if (builder.isValid(this)) {
                return "contract-wide";
            }
        }
        throw new Error("Could not detect order kind (order might have unsupported params/calldata)");
    }
}
exports.Order = Order;
const EIP712_DOMAIN = (chainId) => ({
    name: "LooksRareExchange",
    version: "1",
    chainId,
    verifyingContract: Addresses.Exchange[chainId],
});
const EIP712_TYPES = {
    MakerOrder: [
        { name: "isOrderAsk", type: "bool" },
        { name: "signer", type: "address" },
        { name: "collection", type: "address" },
        { name: "price", type: "uint256" },
        { name: "tokenId", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "strategy", type: "address" },
        { name: "currency", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "startTime", type: "uint256" },
        { name: "endTime", type: "uint256" },
        { name: "minPercentageToAsk", type: "uint256" },
        { name: "params", type: "bytes" },
    ],
};
const toRawOrder = (order) => ({
    ...order.params,
});
const normalize = (order) => {
    // Perform some normalization operations on the order:
    // - convert bignumbers to strings where needed
    // - convert strings to numbers where needed
    // - lowercase all strings
    var _a, _b, _c;
    return {
        kind: order.kind,
        isOrderAsk: order.isOrderAsk,
        signer: (0, utils_1.lc)(order.signer),
        collection: (0, utils_1.lc)(order.collection),
        price: (0, utils_1.s)(order.price),
        tokenId: (0, utils_1.s)(order.tokenId),
        amount: (0, utils_1.s)(order.amount),
        strategy: (0, utils_1.lc)(order.strategy),
        currency: (0, utils_1.lc)(order.currency),
        nonce: (0, utils_1.s)(order.nonce),
        startTime: (0, utils_1.n)(order.startTime),
        endTime: (0, utils_1.n)(order.endTime),
        minPercentageToAsk: (0, utils_1.n)(order.minPercentageToAsk),
        params: (0, utils_1.lc)(order.params),
        v: (_a = order.v) !== null && _a !== void 0 ? _a : 0,
        r: (_b = order.r) !== null && _b !== void 0 ? _b : constants_1.HashZero,
        s: (_c = order.s) !== null && _c !== void 0 ? _c : constants_1.HashZero,
    };
};
//# sourceMappingURL=order.js.map