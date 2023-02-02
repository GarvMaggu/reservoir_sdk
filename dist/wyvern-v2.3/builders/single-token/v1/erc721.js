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
exports.SingleTokenErc721BuilderV1 = void 0;
const abi_1 = require("@ethersproject/abi");
const constants_1 = require("@ethersproject/constants");
const base_1 = require("../../base");
const Addresses = __importStar(require("../../../addresses"));
const order_1 = require("../../../order");
const Types = __importStar(require("../../../types"));
const utils_1 = require("../../../../utils");
const Erc721_json_1 = __importDefault(require("../../../../common/abis/Erc721.json"));
// Wyvern V2 calldata:
// `transferFrom(address from, address to, uint256 tokenId)`
const REPLACEMENT_PATTERN_BUY = 
// `transferFrom` 4byte selector
"0x00000000" +
    // `from` (empty)
    "f".repeat(64) +
    // `to` (required)
    "0".repeat(64) +
    // `tokenId` (required)
    "0".repeat(64);
const REPLACEMENT_PATTERN_SELL = 
// `transferFrom` 4byte selector
"0x00000000" +
    // `from` (required)
    "0".repeat(64) +
    // `to` (empty)
    "f".repeat(64) +
    // `tokenId` (required)
    "0".repeat(64);
class SingleTokenErc721BuilderV1 extends base_1.BaseBuilder {
    constructor(chainId) {
        super(chainId);
    }
    getInfo(order) {
        try {
            const result = new abi_1.Interface(Erc721_json_1.default).decodeFunctionData("transferFrom", order.params.calldata);
            return {
                contract: order.params.target,
                tokenId: result.tokenId.toString(),
            };
        }
        catch {
            return undefined;
        }
    }
    isValid(order) {
        const info = this.getInfo(order);
        if (!info) {
            return false;
        }
        try {
            const copyOrder = this.build({
                ...order.params,
                contract: info.contract,
                tokenId: info.tokenId,
                side: order.params.side === Types.OrderSide.BUY ? "buy" : "sell",
                price: order.params.basePrice,
                fee: 0,
            });
            if (!copyOrder) {
                return false;
            }
            copyOrder.params.taker = order.params.taker;
            copyOrder.params.makerRelayerFee = order.params.makerRelayerFee;
            copyOrder.params.takerRelayerFee = order.params.takerRelayerFee;
            if (copyOrder.hash() !== order.hash()) {
                return false;
            }
        }
        catch {
            return false;
        }
        return true;
    }
    build(params) {
        var _a;
        const saleKind = this.defaultInitialize(params);
        if (params.side === "buy") {
            return new order_1.Order(this.chainId, {
                kind: "erc721-single-token",
                exchange: Addresses.Exchange[this.chainId],
                maker: params.maker,
                taker: constants_1.AddressZero,
                makerRelayerFee: 0,
                takerRelayerFee: params.fee,
                feeRecipient: params.feeRecipient,
                side: Types.OrderSide.BUY,
                saleKind,
                target: params.contract,
                howToCall: Types.OrderHowToCall.CALL,
                calldata: new abi_1.Interface(Erc721_json_1.default).encodeFunctionData("transferFrom", [
                    constants_1.AddressZero,
                    (_a = params.recipient) !== null && _a !== void 0 ? _a : params.maker,
                    params.tokenId,
                ]),
                replacementPattern: REPLACEMENT_PATTERN_BUY,
                staticTarget: constants_1.AddressZero,
                staticExtradata: utils_1.BytesEmpty,
                paymentToken: params.paymentToken,
                basePrice: (0, utils_1.s)(params.price),
                extra: (0, utils_1.s)(params.extra),
                listingTime: params.listingTime,
                expirationTime: params.expirationTime,
                salt: (0, utils_1.s)(params.salt),
                nonce: (0, utils_1.s)(params.nonce),
                v: params.v,
                r: params.r,
                s: params.s,
            });
        }
        else if (params.side === "sell") {
            return new order_1.Order(this.chainId, {
                kind: "erc721-single-token",
                exchange: Addresses.Exchange[this.chainId],
                maker: params.maker,
                taker: constants_1.AddressZero,
                makerRelayerFee: params.fee,
                takerRelayerFee: 0,
                feeRecipient: params.feeRecipient,
                side: Types.OrderSide.SELL,
                saleKind,
                target: params.contract,
                howToCall: Types.OrderHowToCall.CALL,
                calldata: new abi_1.Interface(Erc721_json_1.default).encodeFunctionData("transferFrom", [
                    params.maker,
                    constants_1.AddressZero,
                    params.tokenId,
                ]),
                replacementPattern: REPLACEMENT_PATTERN_SELL,
                staticTarget: constants_1.AddressZero,
                staticExtradata: utils_1.BytesEmpty,
                paymentToken: params.paymentToken,
                basePrice: (0, utils_1.s)(params.price),
                extra: (0, utils_1.s)(params.extra),
                listingTime: params.listingTime,
                expirationTime: params.expirationTime,
                salt: (0, utils_1.s)(params.salt),
                nonce: (0, utils_1.s)(params.nonce),
                v: params.v,
                r: params.r,
                s: params.s,
            });
        }
        else {
            throw new Error("Invalid order side");
        }
    }
    buildMatching(order, taker, data) {
        const info = this.getInfo(order);
        if (!info) {
            throw new Error("Invalid order");
        }
        if (order.params.side === Types.OrderSide.BUY) {
            const matchingOrder = this.build({
                maker: taker,
                contract: info.contract,
                tokenId: info.tokenId,
                side: "sell",
                price: order.getMatchingPrice(),
                paymentToken: order.params.paymentToken,
                recipient: data.recipient,
                fee: 0,
                feeRecipient: constants_1.AddressZero,
                listingTime: (0, utils_1.getCurrentTimestamp)(-60),
                expirationTime: 0,
                salt: (0, utils_1.getRandomBytes)(),
                nonce: data.nonce,
            });
            matchingOrder.params.takerRelayerFee = order.params.takerRelayerFee;
            return matchingOrder;
        }
        else if (order.params.side === Types.OrderSide.SELL) {
            const matchingOrder = this.build({
                maker: taker,
                contract: info.contract,
                tokenId: info.tokenId,
                side: "buy",
                price: order.getMatchingPrice(),
                paymentToken: order.params.paymentToken,
                recipient: data.recipient,
                fee: 0,
                feeRecipient: constants_1.AddressZero,
                listingTime: (0, utils_1.getCurrentTimestamp)(-60),
                expirationTime: 0,
                salt: (0, utils_1.getRandomBytes)(),
                nonce: data.nonce,
            });
            matchingOrder.params.makerRelayerFee = order.params.makerRelayerFee;
            return matchingOrder;
        }
        else {
            throw new Error("Invalid order side");
        }
    }
}
exports.SingleTokenErc721BuilderV1 = SingleTokenErc721BuilderV1;
//# sourceMappingURL=erc721.js.map