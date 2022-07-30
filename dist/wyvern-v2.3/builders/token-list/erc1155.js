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
exports.TokenListErc1155Builder = void 0;
const abi_1 = require("@ethersproject/abi");
const constants_1 = require("@ethersproject/constants");
const helpers_1 = require("../../../common/helpers");
const base_1 = require("../base");
const Addresses = __importStar(require("../../addresses"));
const order_1 = require("../../order");
const Types = __importStar(require("../../types"));
const utils_1 = require("../../../utils");
const TokenListVerifier_json_1 = __importDefault(require("../../abis/TokenListVerifier.json"));
const Erc1155_json_1 = __importDefault(require("../../../common/abis/Erc1155.json"));
// Wyvern V2 calldata:
// `safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes data)`
const REPLACEMENT_PATTERN_BUY = (numTokens) => {
    const numMerkleTreeLevels = Math.ceil(Math.log2(numTokens));
    return (
    // `safeTransferFrom` 4byte selector
    "0x00000000" +
        // `from` (empty)
        "f".repeat(64) +
        // `to` (required)
        "0".repeat(64) +
        // `tokenId` (empty)
        "f".repeat(64) +
        // `amount` (required)
        "0".repeat(64) +
        // empty `data` (required)
        "0".repeat(128) +
        // merkle root (required)
        "0".repeat(64) +
        // merkle proof (empty)
        "0".repeat(128) +
        "f".repeat(64).repeat(numMerkleTreeLevels));
};
const REPLACEMENT_PATTERN_SELL = (numTokens) => {
    const numMerkleTreeLevels = Math.ceil(Math.log2(numTokens));
    return (
    // `safeTransferFrom` 4byte selector
    "0x00000000" +
        // `from` (empty)
        "0".repeat(64) +
        // `to` (required)
        "f".repeat(64) +
        // `tokenId` (empty)
        "0".repeat(64) +
        // `amount` (required)
        "0".repeat(64) +
        // empty `data` (required)
        "0".repeat(128) +
        // merkle root (empty)
        "f".repeat(64) +
        // merkle proof (required)
        "0".repeat(128) +
        "0".repeat(64).repeat(numMerkleTreeLevels));
};
class TokenListErc1155Builder extends base_1.BaseBuilder {
    constructor(chainId) {
        super(chainId);
    }
    getInfo(order) {
        try {
            const [merkleRoot] = abi_1.defaultAbiCoder.decode(["bytes32"], "0x" + order.params.calldata.slice(2).slice(392, 392 + 64));
            return {
                contract: order.params.target,
                merkleRoot,
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
                tokenIds: [0],
                side: order.params.side === Types.OrderSide.BUY ? "buy" : "sell",
                price: order.params.basePrice,
                fee: 0,
            });
            copyOrder.params.calldata =
                "0x" +
                    copyOrder.params.calldata.slice(2).slice(0, 392) +
                    order.params.calldata.slice(2).slice(392);
            copyOrder.params.replacementPattern =
                "0x" +
                    copyOrder.params.replacementPattern.slice(2).slice(0, 584) +
                    order.params.replacementPattern.slice(2).slice(584);
            copyOrder.params.staticExtradata =
                "0x" +
                    copyOrder.params.staticExtradata.slice(2).slice(0, 74) +
                    order.params.staticExtradata.slice(2).slice(74);
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
            const numMerkleTreeLevels = Math.ceil(Math.log2(params.tokenIds.length));
            const merkleTree = (0, helpers_1.generateMerkleTree)(params.tokenIds);
            const calldata = new abi_1.Interface(Erc1155_json_1.default).encodeFunctionData("safeTransferFrom", [
                constants_1.AddressZero,
                (_a = params.recipient) !== null && _a !== void 0 ? _a : params.maker,
                0,
                1,
                "0x",
            ]) +
                // merkle root
                merkleTree.getHexRoot().slice(2) +
                // merkle proof
                abi_1.defaultAbiCoder.encode(["uint256"], [64]).slice(2) +
                abi_1.defaultAbiCoder.encode(["uint256"], [numMerkleTreeLevels]).slice(2) +
                "0".repeat(64).repeat(numMerkleTreeLevels);
            const staticExtradata = new abi_1.Interface(TokenListVerifier_json_1.default).getSighash("verifyErc1155") +
                abi_1.defaultAbiCoder.encode(["uint256"], [32]).slice(2) +
                abi_1.defaultAbiCoder
                    .encode(["uint256"], [calldata.slice(2).length / 2])
                    .slice(2);
            return new order_1.Order(this.chainId, {
                kind: "erc1155-token-list",
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
                calldata,
                replacementPattern: REPLACEMENT_PATTERN_BUY(params.tokenIds.length),
                staticTarget: Addresses.TokenListVerifier[this.chainId],
                staticExtradata,
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
            throw new Error("Unsupported order side");
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
        const numMerkleTreeLevels = Math.ceil(Math.log2(data.tokenIds.length));
        const merkleTree = (0, helpers_1.generateMerkleTree)(data.tokenIds);
        if (merkleTree.getHexRoot() !== info.merkleRoot) {
            throw new Error("Token ids not matching merkle root");
        }
        const merkleProof = (0, helpers_1.generateMerkleProof)(merkleTree, data.tokenId)
            .map((proof) => proof.slice(2))
            .join("");
        if (order.params.side === Types.OrderSide.BUY) {
            const calldata = new abi_1.Interface(Erc1155_json_1.default).encodeFunctionData("safeTransferFrom", [taker, constants_1.AddressZero, data.tokenId, 1, "0x"]) +
                // merkle root
                "0".repeat(64) +
                // merkle proof
                abi_1.defaultAbiCoder.encode(["uint256"], [64]).slice(2) +
                abi_1.defaultAbiCoder.encode(["uint256"], [numMerkleTreeLevels]).slice(2) +
                merkleProof;
            return new order_1.Order(this.chainId, {
                kind: "erc1155-token-list",
                exchange: Addresses.Exchange[this.chainId],
                maker: taker,
                taker: constants_1.AddressZero,
                makerRelayerFee: 0,
                takerRelayerFee: order.params.takerRelayerFee,
                feeRecipient: constants_1.AddressZero,
                side: Types.OrderSide.SELL,
                saleKind: Types.OrderSaleKind.FIXED_PRICE,
                target: info.contract,
                howToCall: Types.OrderHowToCall.CALL,
                calldata,
                replacementPattern: REPLACEMENT_PATTERN_SELL(data.tokenIds.length),
                staticTarget: constants_1.AddressZero,
                staticExtradata: "0x",
                paymentToken: order.params.paymentToken,
                basePrice: (0, utils_1.s)(order.getMatchingPrice()),
                extra: (0, utils_1.s)(order.params.extra),
                listingTime: (0, utils_1.getCurrentTimestamp)(-60),
                expirationTime: 0,
                salt: (0, utils_1.s)((0, utils_1.getRandomBytes)()),
                nonce: (0, utils_1.s)(data.nonce),
            });
        }
        else if (order.params.side === Types.OrderSide.SELL) {
            throw new Error("Unsupported order side");
        }
        else {
            throw new Error("Invalid order side");
        }
    }
}
exports.TokenListErc1155Builder = TokenListErc1155Builder;
//# sourceMappingURL=erc1155.js.map