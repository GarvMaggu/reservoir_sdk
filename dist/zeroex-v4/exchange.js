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
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const Types = __importStar(require("./types"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
const Erc721_json_1 = __importDefault(require("../common/abis/Erc721.json"));
const Erc1155_json_1 = __importDefault(require("../common/abis/Erc1155.json"));
class Exchange {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default);
    }
    // --- Fill order ---
    async fillOrder(taker, order, matchParams, options) {
        const tx = this.fillOrderTx(await taker.getAddress(), order, matchParams, options);
        return taker.sendTransaction(tx);
    }
    fillOrderTx(taker, order, matchParams, options) {
        var _a, _b, _c, _d, _e;
        const feeAmount = order.getFeeAmount();
        let to = this.contract.address;
        let data;
        let value;
        if ((_a = order.params.kind) === null || _a === void 0 ? void 0 : _a.startsWith("erc721")) {
            const erc721 = new contracts_1.Contract(order.params.nft, Erc721_json_1.default);
            if (order.params.direction === Types.TradeDirection.BUY) {
                if (options === null || options === void 0 ? void 0 : options.noDirectTransfer) {
                    data = this.contract.interface.encodeFunctionData("sellERC721", [
                        order.getRaw(),
                        order.getRaw(),
                        matchParams.nftId,
                        (_b = matchParams.unwrapNativeToken) !== null && _b !== void 0 ? _b : true,
                        utils_1.BytesEmpty,
                    ]);
                }
                else {
                    to = erc721.address;
                    data = erc721.interface.encodeFunctionData("safeTransferFrom(address,address,uint256,bytes)", [
                        taker,
                        this.contract.address,
                        matchParams.nftId,
                        abi_1.defaultAbiCoder.encode([Erc721OrderAbiType, SignatureAbiType, "bool"], [
                            order.getRaw(),
                            order.getRaw(),
                            (_c = matchParams.unwrapNativeToken) !== null && _c !== void 0 ? _c : true,
                        ]),
                    ]);
                }
            }
            else {
                data = this.contract.interface.encodeFunctionData("buyERC721", [
                    order.getRaw(),
                    order.getRaw(),
                    utils_1.BytesEmpty,
                ]);
                value = (0, utils_1.bn)(order.params.erc20TokenAmount).add(feeAmount);
            }
        }
        else {
            const erc1155 = new contracts_1.Contract(order.params.nft, Erc1155_json_1.default);
            if (order.params.direction === Types.TradeDirection.BUY) {
                if (options === null || options === void 0 ? void 0 : options.noDirectTransfer) {
                    data = this.contract.interface.encodeFunctionData("sellERC1155", [
                        order.getRaw(),
                        order.getRaw(),
                        matchParams.nftId,
                        matchParams.nftAmount,
                        (_d = matchParams.unwrapNativeToken) !== null && _d !== void 0 ? _d : true,
                        utils_1.BytesEmpty,
                    ]);
                }
                else {
                    to = erc1155.address;
                    data = erc1155.interface.encodeFunctionData("safeTransferFrom", [
                        taker,
                        this.contract.address,
                        matchParams.nftId,
                        matchParams.nftAmount,
                        abi_1.defaultAbiCoder.encode([Erc1155OrderAbiType, SignatureAbiType, "bool"], [
                            order.getRaw(),
                            order.getRaw(),
                            (_e = matchParams.unwrapNativeToken) !== null && _e !== void 0 ? _e : false,
                        ]),
                    ]);
                }
            }
            else {
                data = this.contract.interface.encodeFunctionData("buyERC1155", [
                    order.getRaw(),
                    order.getRaw(),
                    matchParams.nftAmount,
                    utils_1.BytesEmpty,
                ]);
                value = (0, utils_1.bn)(matchParams.nftAmount)
                    .mul(order.params.erc20TokenAmount)
                    .add(order.params.nftAmount)
                    .sub(1)
                    .div(order.params.nftAmount)
                    // Buyer pays the fees
                    .add(feeAmount.mul(matchParams.nftAmount).div(order.params.nftAmount));
            }
        }
        return {
            from: taker,
            to,
            data: data + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: value && (0, utils_1.bn)(value).toHexString(),
        };
    }
    // --- Batch fill listings ---
    async batchBuy(taker, orders, matchParams, options) {
        const tx = this.batchBuyTx(await taker.getAddress(), orders, matchParams, options);
        return taker.sendTransaction(tx);
    }
    batchBuyTx(taker, orders, matchParams, options) {
        var _a, _b;
        const sellOrders = [];
        const signatures = [];
        const fillAmounts = [];
        const callbackData = [];
        const tokenKind = (_a = orders[0].params.kind) === null || _a === void 0 ? void 0 : _a.split("-")[0];
        if (!tokenKind) {
            throw new Error("Could not detect token kind");
        }
        let value = (0, utils_1.bn)(0);
        for (let i = 0; i < Math.min(orders.length, matchParams.length); i++) {
            if (orders[i].params.direction !== Types.TradeDirection.SELL) {
                throw new Error("Invalid side");
            }
            if (((_b = orders[i].params.kind) === null || _b === void 0 ? void 0 : _b.split("-")[0]) !== tokenKind) {
                throw new Error("Invalid kind");
            }
            const feeAmount = orders[i].getFeeAmount();
            value = value.add((0, utils_1.bn)(matchParams[i].nftAmount)
                .mul(orders[i].params.erc20TokenAmount)
                .add(orders[i].params.nftAmount)
                .sub(1)
                .div(orders[i].params.nftAmount)
                // Buyer pays the fees
                .add(feeAmount
                .mul(matchParams[i].nftAmount)
                .div(orders[i].params.nftAmount)));
            sellOrders.push(orders[i].getRaw());
            signatures.push(orders[i].getRaw());
            fillAmounts.push(matchParams[i].nftAmount);
            callbackData.push(utils_1.BytesEmpty);
        }
        return {
            from: taker,
            to: this.contract.address,
            data: (tokenKind === "erc1155"
                ? this.contract.interface.encodeFunctionData("batchBuyERC1155s", [
                    sellOrders,
                    signatures,
                    fillAmounts,
                    callbackData,
                    false,
                ])
                : this.contract.interface.encodeFunctionData("batchBuyERC721s", [
                    sellOrders,
                    signatures,
                    callbackData,
                    false,
                ])) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: value && (0, utils_1.bn)(value).toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = this.cancelOrderTx(await maker.getAddress(), order);
        return maker.sendTransaction(tx);
    }
    cancelOrderTx(maker, order) {
        var _a;
        let data;
        if ((_a = order.params.kind) === null || _a === void 0 ? void 0 : _a.startsWith("erc721")) {
            data = this.contract.interface.encodeFunctionData("cancelERC721Order", [
                order.params.nonce,
            ]);
        }
        else {
            data = this.contract.interface.encodeFunctionData("cancelERC1155Order", [
                order.params.nonce,
            ]);
        }
        return {
            from: maker,
            to: this.contract.address,
            data,
        };
    }
}
exports.Exchange = Exchange;
const Erc721OrderAbiType = `(
  uint8 direction,
  address maker,
  address taker,
  uint256 expiry,
  uint256 nonce,
  address erc20Token,
  uint256 erc20TokenAmount,
  (address recipient, uint256 amount, bytes feeData)[] fees,
  address erc721Token,
  uint256 erc721TokenId,
  (address propertyValidator, bytes propertyData)[] erc721TokenProperties
)`;
const Erc1155OrderAbiType = `(
  uint8 direction,
  address maker,
  address taker,
  uint256 expiry,
  uint256 nonce,
  address erc20Token,
  uint256 erc20TokenAmount,
  (address recipient, uint256 amount, bytes feeData)[] fees,
  address erc1155Token,
  uint256 erc1155TokenId,
  (address propertyValidator, bytes propertyData)[] erc1155TokenProperties,
  uint128 erc1155TokenAmount
)`;
const SignatureAbiType = `(
  uint8 signatureType,
  uint8 v,
  bytes32 r,
  bytes32 s
)`;
//# sourceMappingURL=exchange.js.map