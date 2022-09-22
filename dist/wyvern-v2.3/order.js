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
exports.Order = void 0;
const bytes_1 = require("@ethersproject/bytes");
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const hash_1 = require("@ethersproject/hash");
const wallet_1 = require("@ethersproject/wallet");
const Addresses = __importStar(require("./addresses"));
const helpers_1 = require("./helpers");
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
        // Perform light validations
        // Validate fees
        if (this.params.makerRelayerFee > 10000 ||
            this.params.takerRelayerFee > 10000) {
            throw new Error("Invalid fees");
        }
        // Validate side
        if (this.params.side !== Types.OrderSide.BUY &&
            this.params.side !== Types.OrderSide.SELL) {
            throw new Error("Invalid side");
        }
        // Validate sale kind
        if (this.params.saleKind !== Types.OrderSaleKind.FIXED_PRICE &&
            this.params.saleKind !== Types.OrderSaleKind.DUTCH_AUCTION) {
            throw new Error("Invalid sale kind");
        }
        // Validate call method
        if (this.params.howToCall !== Types.OrderHowToCall.CALL &&
            this.params.howToCall !== Types.OrderHowToCall.DELEGATE_CALL) {
            throw new Error("Invalid call method");
        }
        // Validate listing and expiration times
        if (this.params.expirationTime !== 0 &&
            this.params.listingTime >= this.params.expirationTime) {
            throw new Error("Invalid listing and/or expiration time");
        }
        // Validate exchange
        if (this.params.exchange !== Addresses.Exchange[this.chainId]) {
            throw new Error("Invalid exchange");
        }
    }
    hash() {
        return hash_1._TypedDataEncoder.hashStruct("Order", EIP712_TYPES, toRawOrder(this));
    }
    prefixHash() {
        return hash_1._TypedDataEncoder.hash(EIP712_DOMAIN(this.chainId), EIP712_TYPES, toRawOrder(this));
    }
    async sign(signer) {
        const { v, r, s } = (0, bytes_1.splitSignature)(await signer._signTypedData(EIP712_DOMAIN(this.chainId), EIP712_TYPES, toRawOrder(this)));
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
    /**
     * Build a matching buy order for a sell order and vice versa
     * @param taker The taker's Ethereum address
     * @param data Any aditional arguments
     * @returns The matching Wyvern v2 order
     */
    buildMatching(taker, data) {
        return this.getBuilder().buildMatching(this, taker, data);
    }
    /**
     * Check the validity of the order's signature
     */
    checkSignature() {
        var _a, _b;
        const signer = (0, wallet_1.verifyTypedData)(EIP712_DOMAIN(this.chainId), EIP712_TYPES, toRawOrder(this), {
            v: this.params.v,
            r: (_a = this.params.r) !== null && _a !== void 0 ? _a : "",
            s: (_b = this.params.s) !== null && _b !== void 0 ? _b : "",
        });
        if ((0, utils_1.lc)(this.params.maker) !== (0, utils_1.lc)(signer)) {
            throw new Error("Invalid signature");
        }
    }
    /**
     * Check the order's validity
     */
    checkValidity() {
        if (!this.getBuilder().isValid(this)) {
            throw new Error("Invalid order");
        }
    }
    getInfo() {
        return this.getBuilder().getInfo(this);
    }
    getMatchingPrice(timestampOverride) {
        // https://github.com/ProjectWyvern/wyvern-ethereum/blob/bfca101b2407e4938398fccd8d1c485394db7e01/contracts/exchange/SaleKindInterface.sol#L70-L87
        if (this.params.saleKind === Types.OrderSaleKind.FIXED_PRICE) {
            return (0, utils_1.bn)(this.params.basePrice);
        }
        else {
            // Set a delay of 1 minute to allow for any timestamp discrepancies
            const diff = (0, utils_1.bn)(this.params.extra)
                .mul((0, utils_1.bn)(timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : (0, utils_1.getCurrentTimestamp)(-60)).sub(this.params.listingTime))
                .div((0, utils_1.bn)(this.params.expirationTime).sub(this.params.listingTime));
            return (0, utils_1.bn)(this.params.basePrice).sub(diff);
        }
    }
    isDutchAuction() {
        return this.params.saleKind === Types.OrderSaleKind.DUTCH_AUCTION;
    }
    /**
     * Check the order's fillability
     * @param provider A read-only abstraction to access the blockchain data
     */
    async checkFillability(provider) {
        var _a, _b;
        const chainId = await provider.getNetwork().then((n) => n.chainId);
        // Make sure the order is not cancelled or filled
        const hash = this.prefixHash();
        const exchange = new contracts_1.Contract(this.params.exchange, Exchange_json_1.default, provider);
        const filledOrCancelled = await exchange.cancelledOrFinalized(hash);
        if (filledOrCancelled) {
            throw new Error("filled-or-cancelled");
        }
        // Make sure the order has a valid nonce
        const nonce = await exchange.nonces(this.params.maker);
        if (nonce.toString() !== this.params.nonce) {
            throw new Error("nonce-invalidated");
        }
        if (this.params.side === Types.OrderSide.BUY) {
            // Check that maker has enough balance to cover the payment
            // and the approval to the token transfer proxy is set
            const erc20 = new Common.Helpers.Erc20(provider, this.params.paymentToken);
            // Check balance
            const balance = await erc20.getBalance(this.params.maker);
            if ((0, utils_1.bn)(balance).lt(this.params.basePrice)) {
                throw new Error("no-balance");
            }
            // Check allowance
            const allowance = await erc20.getAllowance(this.params.maker, Addresses.TokenTransferProxy[chainId]);
            if ((0, utils_1.bn)(allowance).lt(this.params.basePrice)) {
                throw new Error("no-approval");
            }
        }
        else {
            // Check that maker owns the token id put on sale and
            // the approval to the make'rs proxy is set
            const proxyRegistry = new helpers_1.ProxyRegistry(provider, chainId);
            const proxy = await proxyRegistry.getProxy(this.params.maker);
            if (!proxy) {
                throw new Error("no-proxy");
            }
            let kind;
            if ((_a = this.params.kind) === null || _a === void 0 ? void 0 : _a.startsWith("erc721")) {
                kind = "erc721";
            }
            else if ((_b = this.params.kind) === null || _b === void 0 ? void 0 : _b.startsWith("erc1155")) {
                kind = "erc1155";
            }
            else {
                throw new Error("invalid");
            }
            const { contract, tokenId } = this.getInfo();
            if (!contract || !tokenId) {
                throw new Error("invalid");
            }
            if (kind === "erc721") {
                const erc721 = new Common.Helpers.Erc721(provider, contract);
                // Check ownership
                const owner = await erc721.getOwner(tokenId);
                if ((0, utils_1.lc)(owner) !== (0, utils_1.lc)(this.params.maker)) {
                    throw new Error("no-balance");
                }
                // Check approval
                const isApproved = await erc721.isApproved(this.params.maker, proxy);
                if (!isApproved) {
                    throw new Error("no-approval");
                }
            }
            else if (kind === "erc1155") {
                const erc1155 = new Common.Helpers.Erc1155(provider, contract);
                // Check balance
                const balance = await erc1155.getBalance(this.params.maker, tokenId);
                if ((0, utils_1.bn)(balance).lt(1)) {
                    throw new Error("no-balance");
                }
                // Check approval
                const isApproved = await erc1155.isApproved(this.params.maker, proxy);
                if (!isApproved) {
                    throw new Error("no-approval");
                }
            }
        }
    }
    getBuilder() {
        switch (this.params.kind) {
            case "erc721-contract-wide": {
                return new builders_1.Builders.Erc721.ContractWide(this.chainId);
            }
            case "erc721-single-token": {
                return new builders_1.Builders.Erc721.SingleToken.V1(this.chainId);
            }
            case "erc721-single-token-v2": {
                return new builders_1.Builders.Erc721.SingleToken.V2(this.chainId);
            }
            case "erc721-token-list": {
                return new builders_1.Builders.Erc721.TokenList(this.chainId);
            }
            case "erc721-token-range": {
                return new builders_1.Builders.Erc721.TokenRange(this.chainId);
            }
            case "erc1155-contract-wide": {
                return new builders_1.Builders.Erc1155.ContractWide(this.chainId);
            }
            case "erc1155-single-token": {
                return new builders_1.Builders.Erc1155.SingleToken.V1(this.chainId);
            }
            case "erc1155-single-token-v2": {
                return new builders_1.Builders.Erc1155.SingleToken.V2(this.chainId);
            }
            case "erc1155-token-list": {
                return new builders_1.Builders.Erc1155.TokenList(this.chainId);
            }
            case "erc1155-token-range": {
                return new builders_1.Builders.Erc1155.TokenRange(this.chainId);
            }
            default: {
                throw new Error("Unknown order kind");
            }
        }
    }
    detectKind() {
        // erc721-contract-wide
        {
            const builder = new builders_1.Builders.Erc721.ContractWide(this.chainId);
            if (builder.isValid(this)) {
                return "erc721-contract-wide";
            }
        }
        // erc721-single-token
        {
            const builder = new builders_1.Builders.Erc721.SingleToken.V1(this.chainId);
            if (builder.isValid(this)) {
                return "erc721-single-token";
            }
        }
        // erc721-single-token-v2
        {
            const builder = new builders_1.Builders.Erc721.SingleToken.V2(this.chainId);
            if (builder.isValid(this)) {
                return "erc721-single-token-v2";
            }
        }
        // erc721-token-list
        {
            const builder = new builders_1.Builders.Erc721.TokenList(this.chainId);
            if (builder.isValid(this)) {
                return "erc721-token-list";
            }
        }
        // erc721-token-range
        {
            const builder = new builders_1.Builders.Erc721.TokenRange(this.chainId);
            if (builder.isValid(this)) {
                return "erc721-token-range";
            }
        }
        // erc1155-contract-wide
        {
            const builder = new builders_1.Builders.Erc1155.ContractWide(this.chainId);
            if (builder.isValid(this)) {
                return "erc1155-contract-wide";
            }
        }
        // erc1155-single-token
        {
            const builder = new builders_1.Builders.Erc1155.SingleToken.V1(this.chainId);
            if (builder.isValid(this)) {
                return "erc1155-single-token";
            }
        }
        // erc1155-single-token-v2
        {
            const builder = new builders_1.Builders.Erc1155.SingleToken.V2(this.chainId);
            if (builder.isValid(this)) {
                return "erc1155-single-token-v2";
            }
        }
        // erc1155-token-list
        {
            const builder = new builders_1.Builders.Erc1155.TokenList(this.chainId);
            if (builder.isValid(this)) {
                return "erc1155-token-list";
            }
        }
        // erc1155-token-range
        {
            const builder = new builders_1.Builders.Erc1155.TokenRange(this.chainId);
            if (builder.isValid(this)) {
                return "erc1155-token-range";
            }
        }
        throw new Error("Could not detect order kind (order might have unsupported params/calldata)");
    }
}
exports.Order = Order;
const EIP712_DOMAIN = (chainId) => ({
    name: "Wyvern Exchange Contract",
    version: "2.3",
    chainId,
    verifyingContract: Addresses.Exchange[chainId],
});
const EIP712_TYPES = {
    Order: [
        { name: "exchange", type: "address" },
        { name: "maker", type: "address" },
        { name: "taker", type: "address" },
        { name: "makerRelayerFee", type: "uint256" },
        { name: "takerRelayerFee", type: "uint256" },
        { name: "makerProtocolFee", type: "uint256" },
        { name: "takerProtocolFee", type: "uint256" },
        { name: "feeRecipient", type: "address" },
        { name: "feeMethod", type: "uint8" },
        { name: "side", type: "uint8" },
        { name: "saleKind", type: "uint8" },
        { name: "target", type: "address" },
        { name: "howToCall", type: "uint8" },
        { name: "calldata", type: "bytes" },
        { name: "replacementPattern", type: "bytes" },
        { name: "staticTarget", type: "address" },
        { name: "staticExtradata", type: "bytes" },
        { name: "paymentToken", type: "address" },
        { name: "basePrice", type: "uint256" },
        { name: "extra", type: "uint256" },
        { name: "listingTime", type: "uint256" },
        { name: "expirationTime", type: "uint256" },
        { name: "salt", type: "uint256" },
        { name: "nonce", type: "uint256" },
    ],
};
const toRawOrder = (order) => ({
    ...order.params,
    makerProtocolFee: 0,
    takerProtocolFee: 0,
    feeMethod: 1,
});
const normalize = (order) => {
    // Perform some normalization operations on the order:
    // - convert bignumbers to strings where needed
    // - convert strings to numbers where needed
    // - lowercase all strings
    var _a, _b, _c;
    return {
        kind: order.kind,
        exchange: (0, utils_1.lc)(order.exchange),
        maker: (0, utils_1.lc)(order.maker),
        taker: (0, utils_1.lc)(order.taker),
        makerRelayerFee: (0, utils_1.n)(order.makerRelayerFee),
        takerRelayerFee: (0, utils_1.n)(order.takerRelayerFee),
        feeRecipient: (0, utils_1.lc)(order.feeRecipient),
        side: (0, utils_1.n)(order.side),
        saleKind: (0, utils_1.n)(order.saleKind),
        target: (0, utils_1.lc)(order.target),
        howToCall: (0, utils_1.n)(order.howToCall),
        calldata: (0, utils_1.lc)(order.calldata),
        replacementPattern: (0, utils_1.lc)(order.replacementPattern),
        staticTarget: (0, utils_1.lc)(order.staticTarget),
        staticExtradata: (0, utils_1.lc)(order.staticExtradata),
        paymentToken: (0, utils_1.lc)(order.paymentToken),
        basePrice: (0, utils_1.s)(order.basePrice),
        extra: (0, utils_1.s)(order.extra),
        listingTime: (0, utils_1.n)(order.listingTime),
        expirationTime: (0, utils_1.n)(order.expirationTime),
        salt: (0, utils_1.s)(order.salt),
        nonce: (0, utils_1.s)(order.nonce),
        v: (_a = order.v) !== null && _a !== void 0 ? _a : 0,
        r: (_b = order.r) !== null && _b !== void 0 ? _b : constants_1.HashZero,
        s: (_c = order.s) !== null && _c !== void 0 ? _c : constants_1.HashZero,
    };
};
//# sourceMappingURL=order.js.map