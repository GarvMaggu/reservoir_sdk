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
const Types = __importStar(require("./types"));
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
    }
    getRaw() {
        var _a;
        return ((_a = this.params.kind) === null || _a === void 0 ? void 0 : _a.startsWith("erc721"))
            ? toRawErc721Order(this)
            : toRawErc1155Order(this);
    }
    hash() {
        const [types, value, structName] = this.getEip712TypesAndValue();
        return hash_1._TypedDataEncoder.hashStruct(structName, types, value);
    }
    async sign(signer) {
        const [types, value] = this.getEip712TypesAndValue();
        const { v, r, s } = (0, bytes_1.splitSignature)(await signer._signTypedData(EIP712_DOMAIN(this.chainId), types, value));
        this.params = {
            ...this.params,
            signatureType: 2,
            v,
            r,
            s,
        };
    }
    getSignatureData() {
        const [types, value] = this.getEip712TypesAndValue();
        return {
            signatureKind: "eip712",
            domain: EIP712_DOMAIN(this.chainId),
            types,
            value,
        };
    }
    checkSignature() {
        var _a, _b;
        const [types, value] = this.getEip712TypesAndValue();
        const signer = (0, wallet_1.verifyTypedData)(EIP712_DOMAIN(this.chainId), types, value, {
            v: this.params.v,
            r: (_a = this.params.r) !== null && _a !== void 0 ? _a : "",
            s: (_b = this.params.s) !== null && _b !== void 0 ? _b : "",
        });
        if ((0, utils_1.lc)(this.params.maker) !== (0, utils_1.lc)(signer)) {
            throw new Error("Invalid signature");
        }
    }
    checkValidity() {
        if (!this.getBuilder().isValid(this)) {
            throw new Error("Invalid order");
        }
    }
    getInfo() {
        return this.getBuilder().getInfo(this);
    }
    async checkFillability(provider) {
        var _a, _b;
        const chainId = await provider.getNetwork().then((n) => n.chainId);
        const exchange = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default, provider);
        let status;
        if ((_a = this.params.kind) === null || _a === void 0 ? void 0 : _a.startsWith("erc721")) {
            status = await exchange.getERC721OrderStatus(toRawErc721Order(this));
        }
        else {
            ({ status } = await exchange.getERC1155OrderInfo(toRawErc1155Order(this)));
        }
        if (status !== 1) {
            throw new Error("not-fillable");
        }
        // Determine the order's fees (which are to be payed by the buyer)
        let feeAmount = this.getFeeAmount();
        if (this.params.direction === Types.TradeDirection.BUY) {
            // Check that maker has enough balance to cover the payment
            // and the approval to the token transfer proxy is set
            const erc20 = new Common.Helpers.Erc20(provider, this.params.erc20Token);
            const balance = await erc20.getBalance(this.params.maker);
            if ((0, utils_1.bn)(balance).lt((0, utils_1.bn)(this.params.erc20TokenAmount).add(feeAmount))) {
                throw new Error("no-balance");
            }
            // Check allowance
            const allowance = await erc20.getAllowance(this.params.maker, Addresses.Exchange[chainId]);
            if ((0, utils_1.bn)(allowance).lt((0, utils_1.bn)(this.params.erc20TokenAmount).add(feeAmount))) {
                throw new Error("no-approval");
            }
        }
        else {
            if ((_b = this.params.kind) === null || _b === void 0 ? void 0 : _b.startsWith("erc721")) {
                const erc721 = new Common.Helpers.Erc721(provider, this.params.nft);
                // Check ownership
                const owner = await erc721.getOwner(this.params.nftId);
                if ((0, utils_1.lc)(owner) !== (0, utils_1.lc)(this.params.maker)) {
                    throw new Error("no-balance");
                }
                // Check approval
                const isApproved = await erc721.isApproved(this.params.maker, Addresses.Exchange[this.chainId]);
                if (!isApproved) {
                    throw new Error("no-approval");
                }
            }
            else {
                const erc1155 = new Common.Helpers.Erc1155(provider, this.params.nft);
                // Check balance
                const balance = await erc1155.getBalance(this.params.maker, this.params.nftId);
                if ((0, utils_1.bn)(balance).lt(this.params.nftAmount)) {
                    throw new Error("no-balance");
                }
                // Check approval
                const isApproved = await erc1155.isApproved(this.params.maker, Addresses.Exchange[this.chainId]);
                if (!isApproved) {
                    throw new Error("no-approval");
                }
            }
        }
    }
    buildMatching(data) {
        return this.getBuilder().buildMatching(this, data);
    }
    getFeeAmount() {
        let feeAmount = (0, utils_1.bn)(0);
        for (const { amount } of this.params.fees) {
            feeAmount = feeAmount.add(amount);
        }
        return feeAmount;
    }
    getEip712TypesAndValue() {
        return !this.params.nftAmount
            ? [ERC721_ORDER_EIP712_TYPES, toRawErc721Order(this), "ERC721Order"]
            : [ERC1155_ORDER_EIP712_TYPES, toRawErc1155Order(this), "ERC1155Order"];
    }
    getBuilder() {
        switch (this.params.kind) {
            case "erc721-contract-wide":
            case "erc1155-contract-wide": {
                return new builders_1.Builders.ContractWide(this.chainId);
            }
            case "erc721-single-token":
            case "erc1155-single-token": {
                return new builders_1.Builders.SingleToken(this.chainId);
            }
            case "erc721-token-range":
            case "erc1155-token-range": {
                return new builders_1.Builders.TokenRange(this.chainId);
            }
            case "erc721-token-list-bit-vector":
            case "erc1155-token-list-bit-vector": {
                return new builders_1.Builders.TokenList.BitVector(this.chainId);
            }
            case "erc721-token-list-packed-list":
            case "erc1155-token-list-packed-list": {
                return new builders_1.Builders.TokenList.PackedList(this.chainId);
            }
            default: {
                throw new Error("Unknown order kind");
            }
        }
    }
    detectKind() {
        // contract-wide
        {
            const builder = new builders_1.Builders.ContractWide(this.chainId);
            if (builder.isValid(this)) {
                return this.params.nftAmount
                    ? "erc1155-contract-wide"
                    : "erc721-contract-wide";
            }
        }
        // single-token
        {
            const builder = new builders_1.Builders.SingleToken(this.chainId);
            if (builder.isValid(this)) {
                return this.params.nftAmount
                    ? "erc1155-single-token"
                    : "erc721-single-token";
            }
        }
        // token-range
        {
            const builder = new builders_1.Builders.TokenRange(this.chainId);
            if (builder.isValid(this)) {
                return this.params.nftAmount
                    ? "erc1155-token-range"
                    : "erc721-token-range";
            }
        }
        // token-list
        {
            const builder = new builders_1.Builders.TokenList.BitVector(this.chainId);
            if (builder.isValid(this)) {
                return this.params.nftAmount
                    ? "erc1155-token-list-bit-vector"
                    : "erc721-token-list-bit-vector";
            }
        }
        {
            const builder = new builders_1.Builders.TokenList.PackedList(this.chainId);
            if (builder.isValid(this)) {
                return this.params.nftAmount
                    ? "erc1155-token-list-packed-list"
                    : "erc721-token-list-packed-list";
            }
        }
        throw new Error("Could not detect order kind (order might have unsupported params/calldata)");
    }
}
exports.Order = Order;
const EIP712_DOMAIN = (chainId) => ({
    name: "ZeroEx",
    version: "1.0.0",
    chainId,
    verifyingContract: Addresses.Exchange[chainId],
});
const ERC721_ORDER_EIP712_TYPES = {
    ERC721Order: [
        { name: "direction", type: "uint8" },
        { name: "maker", type: "address" },
        { name: "taker", type: "address" },
        { name: "expiry", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "erc20Token", type: "address" },
        { name: "erc20TokenAmount", type: "uint256" },
        { name: "fees", type: "Fee[]" },
        { name: "erc721Token", type: "address" },
        { name: "erc721TokenId", type: "uint256" },
        { name: "erc721TokenProperties", type: "Property[]" },
    ],
    Fee: [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "feeData", type: "bytes" },
    ],
    Property: [
        { name: "propertyValidator", type: "address" },
        { name: "propertyData", type: "bytes" },
    ],
};
const ERC1155_ORDER_EIP712_TYPES = {
    ERC1155Order: [
        { name: "direction", type: "uint8" },
        { name: "maker", type: "address" },
        { name: "taker", type: "address" },
        { name: "expiry", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "erc20Token", type: "address" },
        { name: "erc20TokenAmount", type: "uint256" },
        { name: "fees", type: "Fee[]" },
        { name: "erc1155Token", type: "address" },
        { name: "erc1155TokenId", type: "uint256" },
        { name: "erc1155TokenProperties", type: "Property[]" },
        { name: "erc1155TokenAmount", type: "uint128" },
    ],
    Fee: [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "feeData", type: "bytes" },
    ],
    Property: [
        { name: "propertyValidator", type: "address" },
        { name: "propertyData", type: "bytes" },
    ],
};
const toRawErc721Order = (order) => ({
    ...order.params,
    erc721Token: order.params.nft,
    erc721TokenId: order.params.nftId,
    erc721TokenProperties: order.params.nftProperties,
});
const toRawErc1155Order = (order) => ({
    ...order.params,
    erc1155Token: order.params.nft,
    erc1155TokenId: order.params.nftId,
    erc1155TokenProperties: order.params.nftProperties,
    erc1155TokenAmount: order.params.nftAmount,
});
const normalize = (order) => {
    // Perform some normalization operations on the order:
    // - convert bignumbers to strings where needed
    // - convert strings to numbers where needed
    // - lowercase all strings
    var _a, _b, _c, _d;
    return {
        kind: order.kind,
        direction: order.direction,
        maker: (0, utils_1.lc)(order.maker),
        taker: (0, utils_1.lc)(order.taker),
        expiry: (0, utils_1.n)(order.expiry),
        nonce: (0, utils_1.s)(order.nonce),
        erc20Token: (0, utils_1.lc)(order.erc20Token),
        erc20TokenAmount: (0, utils_1.s)(order.erc20TokenAmount),
        fees: order.fees.map(({ recipient, amount, feeData }) => ({
            recipient: (0, utils_1.lc)(recipient),
            amount: (0, utils_1.s)(amount),
            feeData: (0, utils_1.lc)(feeData),
        })),
        nft: (0, utils_1.lc)(order.nft),
        nftId: (0, utils_1.s)(order.nftId),
        nftProperties: order.nftProperties.map(({ propertyValidator, propertyData }) => ({
            propertyValidator: (0, utils_1.lc)(propertyValidator),
            propertyData: (0, utils_1.lc)(propertyData),
        })),
        nftAmount: order.nftAmount ? (0, utils_1.s)(order.nftAmount) : undefined,
        signatureType: (_a = order.signatureType) !== null && _a !== void 0 ? _a : 1,
        v: (_b = order.v) !== null && _b !== void 0 ? _b : 0,
        r: (_c = order.r) !== null && _c !== void 0 ? _c : constants_1.HashZero,
        s: (_d = order.s) !== null && _d !== void 0 ? _d : constants_1.HashZero,
    };
};
//# sourceMappingURL=order.js.map