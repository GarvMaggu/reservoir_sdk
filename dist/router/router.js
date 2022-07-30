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
exports.Router = void 0;
const abi_1 = require("@ethersproject/abi");
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const types_1 = require("./types");
const Sdk = __importStar(require("../index"));
const utils_1 = require("../utils");
const Erc721_json_1 = __importDefault(require("../common/abis/Erc721.json"));
const Erc1155_json_1 = __importDefault(require("../common/abis/Erc1155.json"));
const ReservoirV5_0_0_json_1 = __importDefault(require("./abis/ReservoirV5_0_0.json"));
class Router {
    constructor(chainId, provider) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.Router[chainId], ReservoirV5_0_0_json_1.default, provider);
        this.provider = provider;
    }
    async fillListingsTx(details, taker, options) {
        // Assume the listing details are consistent with the underlying order object
        var _a, _b;
        // Orders on exchanges that support batch filling will be batch filled
        // natively so that filling is as efficient as possible while the rest
        // of the orders will be filled individually.
        // Native batch filling:
        // - OpenDao
        // - Seaport
        // - X2Y2 (not supported yet)
        // - ZeroExV4
        // If all orders are Seaport, then we fill on Seaport directly
        // TODO: Once the modular router is implemented, a refactoring
        // might be needed - to use the router-generated order instead
        // of treating Seaport as a special case (this is not possible
        // at the moment because the router has separate functions for
        // filling ERC721 vs ERC1155).
        if (details.every(({ kind }) => kind === "seaport") &&
            // TODO: Look into using tips for fees on top (only doable on Seaport)
            (!(options === null || options === void 0 ? void 0 : options.fee) || Number(options.fee.bps) === 0) &&
            // Skip direct filling if disabled via the options
            !(options === null || options === void 0 ? void 0 : options.noDirectFilling)) {
            const exchange = new Sdk.Seaport.Exchange(this.chainId);
            if (details.length === 1) {
                const order = details[0].order;
                return exchange.fillOrderTx(taker, order, order.buildMatching({ amount: details[0].amount }), options);
            }
            else {
                const orders = details.map((d) => d.order);
                return exchange.fillOrdersTx(taker, orders, orders.map((order, i) => order.buildMatching({ amount: details[i].amount })), options);
            }
        }
        // Keep track of batch-fillable orders
        const opendaoErc721Details = [];
        const opendaoErc1155Details = [];
        const zeroexV4Erc721Details = [];
        const zeroexV4Erc1155Details = [];
        for (let i = 0; i < details.length; i++) {
            const { kind, contractKind } = details[i];
            switch (kind) {
                case "opendao": {
                    (contractKind === "erc721"
                        ? opendaoErc721Details
                        : opendaoErc1155Details).push(details[i]);
                    break;
                }
                case "zeroex-v4": {
                    (contractKind === "erc721"
                        ? zeroexV4Erc721Details
                        : zeroexV4Erc1155Details).push(details[i]);
                    break;
                }
            }
        }
        const fee = (options === null || options === void 0 ? void 0 : options.fee) ? options.fee : { recipient: constants_1.AddressZero, bps: 0 };
        // Keep track of all listings to be filled through the router
        const routerTxs = [];
        // Only batch-fill if there are multiple orders
        if (opendaoErc721Details.length > 1) {
            const exchange = new Sdk.OpenDao.Exchange(this.chainId);
            const tx = exchange.batchBuyTx(taker, opendaoErc721Details.map((detail) => detail.order), opendaoErc721Details.map((detail) => {
                var _a;
                return detail.order.buildMatching({
                    amount: (_a = detail.amount) !== null && _a !== void 0 ? _a : 1,
                });
            }));
            routerTxs.push({
                from: taker,
                to: this.contract.address,
                data: this.contract.interface.encodeFunctionData("batchERC721ListingFill", [
                    tx.data,
                    opendaoErc721Details.map((detail) => detail.contract),
                    opendaoErc721Details.map((detail) => detail.tokenId),
                    taker,
                    fee.recipient,
                    fee.bps,
                ]),
                value: (0, utils_1.bn)(tx.value)
                    .add((0, utils_1.bn)(tx.value).mul(fee.bps).div(10000))
                    .toHexString(),
            });
            // Delete any batch-filled orders
            details = details.filter(({ kind, contractKind }) => kind !== "opendao" && contractKind !== "erc721");
        }
        if (opendaoErc1155Details.length > 1) {
            const exchange = new Sdk.OpenDao.Exchange(this.chainId);
            const tx = exchange.batchBuyTx(taker, opendaoErc1155Details.map((detail) => detail.order), opendaoErc1155Details.map((detail) => {
                var _a;
                return detail.order.buildMatching({
                    amount: (_a = detail.amount) !== null && _a !== void 0 ? _a : 1,
                });
            }));
            routerTxs.push({
                from: taker,
                to: this.contract.address,
                data: this.contract.interface.encodeFunctionData("batchERC1155ListingFill", [
                    tx.data,
                    opendaoErc1155Details.map((detail) => detail.contract),
                    opendaoErc1155Details.map((detail) => detail.tokenId),
                    opendaoErc1155Details.map((detail) => { var _a; return (_a = detail.amount) !== null && _a !== void 0 ? _a : 1; }),
                    taker,
                    fee.recipient,
                    fee.bps,
                ]),
                value: (0, utils_1.bn)(tx.value)
                    .add((0, utils_1.bn)(tx.value).mul(fee.bps).div(10000))
                    .toHexString(),
            });
            // Delete any batch-filled orders
            details = details.filter(({ kind, contractKind }) => kind !== "opendao" && contractKind !== "erc1155");
        }
        if (zeroexV4Erc721Details.length > 1) {
            const exchange = new Sdk.ZeroExV4.Exchange(this.chainId);
            const tx = exchange.batchBuyTx(taker, zeroexV4Erc1155Details.map((detail) => detail.order), zeroexV4Erc1155Details.map((detail) => {
                var _a;
                return detail.order.buildMatching({
                    amount: (_a = detail.amount) !== null && _a !== void 0 ? _a : 1,
                });
            }));
            routerTxs.push({
                from: taker,
                to: this.contract.address,
                data: this.contract.interface.encodeFunctionData("batchERC721ListingFill", [
                    tx.data,
                    zeroexV4Erc721Details.map((detail) => detail.contract),
                    zeroexV4Erc721Details.map((detail) => detail.tokenId),
                    taker,
                    fee.recipient,
                    fee.bps,
                ]),
                value: (0, utils_1.bn)(tx.value)
                    .add((0, utils_1.bn)(tx.value).mul(fee.bps).div(10000))
                    .toHexString(),
            });
            // Delete any batch-filled orders
            details = details.filter(({ kind, contractKind }) => kind !== "zeroex-v4" && contractKind !== "erc721");
        }
        if (zeroexV4Erc1155Details.length > 1) {
            const exchange = new Sdk.ZeroExV4.Exchange(this.chainId);
            const tx = exchange.batchBuyTx(taker, zeroexV4Erc1155Details.map((detail) => detail.order), zeroexV4Erc1155Details.map((detail) => {
                var _a;
                return detail.order.buildMatching({
                    amount: (_a = detail.amount) !== null && _a !== void 0 ? _a : 1,
                });
            }));
            routerTxs.push({
                from: taker,
                to: this.contract.address,
                data: this.contract.interface.encodeFunctionData("batchERC1155ListingFill", [
                    tx.data,
                    zeroexV4Erc1155Details.map((detail) => detail.contract),
                    zeroexV4Erc1155Details.map((detail) => detail.tokenId),
                    zeroexV4Erc1155Details.map((detail) => { var _a; return (_a = detail.amount) !== null && _a !== void 0 ? _a : 1; }),
                    taker,
                    fee.recipient,
                    fee.bps,
                ]),
                value: (0, utils_1.bn)(tx.value)
                    .add((0, utils_1.bn)(tx.value).mul(fee.bps).div(10000))
                    .toHexString(),
            });
            // Delete any batch-filled orders
            details = details.filter(({ kind, contractKind }) => kind !== "zeroex-v4" && contractKind !== "erc1155");
        }
        // Rest of orders are individually filled
        for (const detail of details) {
            const { tx, exchangeKind, maker, isEscrowed } = await this.generateNativeListingFillTx(detail, taker);
            if (detail.contractKind === "erc721") {
                routerTxs.push({
                    from: taker,
                    to: this.contract.address,
                    data: !(options === null || options === void 0 ? void 0 : options.skipPrecheck) && !isEscrowed
                        ? this.contract.interface.encodeFunctionData("singleERC721ListingFillWithPrecheck", [
                            tx.data,
                            exchangeKind,
                            detail.contract,
                            detail.tokenId,
                            taker,
                            maker,
                            fee.recipient,
                            fee.bps,
                        ])
                        : this.contract.interface.encodeFunctionData("singleERC721ListingFill", [
                            tx.data,
                            exchangeKind,
                            detail.contract,
                            detail.tokenId,
                            taker,
                            fee.recipient,
                            fee.bps,
                        ]),
                    value: (0, utils_1.bn)(tx.value)
                        // Add the referrer fee
                        .add((0, utils_1.bn)(tx.value).mul(fee.bps).div(10000))
                        .toHexString(),
                });
            }
            else {
                routerTxs.push({
                    from: taker,
                    to: this.contract.address,
                    data: !(options === null || options === void 0 ? void 0 : options.skipPrecheck) && !isEscrowed
                        ? this.contract.interface.encodeFunctionData("singleERC1155ListingFillWithPrecheck", [
                            tx.data,
                            exchangeKind,
                            detail.contract,
                            detail.tokenId,
                            (_a = detail.amount) !== null && _a !== void 0 ? _a : 1,
                            taker,
                            maker,
                            fee.recipient,
                            fee.bps,
                        ])
                        : this.contract.interface.encodeFunctionData("singleERC1155ListingFill", [
                            tx.data,
                            exchangeKind,
                            detail.contract,
                            detail.tokenId,
                            (_b = detail.amount) !== null && _b !== void 0 ? _b : 1,
                            taker,
                            fee.recipient,
                            fee.bps,
                        ]),
                    value: (0, utils_1.bn)(tx.value)
                        // Add the referrer fee
                        .add((0, utils_1.bn)(tx.value).mul(fee.bps).div(10000))
                        .toHexString(),
                });
            }
        }
        if (routerTxs.length === 1) {
            return {
                ...routerTxs[0],
                data: routerTxs[0].data + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            };
        }
        else if (routerTxs.length > 1) {
            return {
                from: taker,
                to: this.contract.address,
                data: this.contract.interface.encodeFunctionData("multiListingFill", [
                    routerTxs.map((tx) => tx.data),
                    routerTxs.map((tx) => tx.value.toString()),
                    !(options === null || options === void 0 ? void 0 : options.partial),
                ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
                value: routerTxs
                    .map((tx) => (0, utils_1.bn)(tx.value))
                    .reduce((a, b) => a.add(b), (0, utils_1.bn)(0))
                    .toHexString(),
            };
        }
        else {
            throw new Error("Could not generate transaction");
        }
    }
    async fillBidTx(detail, taker, options) {
        // Assume the bid details are consistent with the underlying order object
        const { tx, exchangeKind } = await this.generateNativeBidFillTx(detail);
        // Wrap the exchange-specific fill transaction via the router
        // (use the `onReceived` hooks for single token filling)
        if (detail.contractKind === "erc721") {
            return {
                from: taker,
                to: detail.contract,
                data: new abi_1.Interface(Erc721_json_1.default).encodeFunctionData("safeTransferFrom(address,address,uint256,bytes)", [
                    taker,
                    this.contract.address,
                    detail.tokenId,
                    this.contract.interface.encodeFunctionData("singleERC721BidFill", [tx.data, exchangeKind, detail.contract, taker, true]),
                ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            };
        }
        else {
            return {
                from: taker,
                to: detail.contract,
                data: new abi_1.Interface(Erc1155_json_1.default).encodeFunctionData("safeTransferFrom(address,address,uint256,uint256,bytes)", [
                    taker,
                    this.contract.address,
                    detail.tokenId,
                    // TODO: Support selling a quantity greater than 1
                    1,
                    this.contract.interface.encodeFunctionData("singleERC1155BidFill", [tx.data, exchangeKind, detail.contract, taker, true]),
                ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            };
        }
        // Direct filling (requires approval):
        // const { tx } = await this.generateNativeBidFillTx(detail, taker, {
        //   noRouter: true,
        // });
        // return {
        //   ...tx,
        //   data: tx.data + generateReferrerBytes(options?.referrer),
        // };
    }
    async generateNativeListingFillTx({ kind, order, tokenId, amount }, taker) {
        // In all below cases we set the router contract as the taker
        // since forwarding any received token to the actual taker of
        // the order will be done on-chain by the router (unless it's
        // possible to specify a token recipient other than the taker
        // natively - only Wyvern V2.3 supports this).
        if (kind === "foundation") {
            order = order;
            const exchange = new Sdk.Foundation.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(this.contract.address, order),
                exchangeKind: types_1.ExchangeKind.FOUNDATION,
                maker: order.params.maker,
                isEscrowed: true,
            };
        }
        else if (kind === "looks-rare") {
            order = order;
            const matchParams = order.buildMatching(this.contract.address, {
                tokenId,
            });
            const exchange = new Sdk.LooksRare.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(this.contract.address, order, matchParams),
                exchangeKind: types_1.ExchangeKind.LOOKS_RARE,
                maker: order.params.signer,
            };
        }
        else if (kind === "opendao") {
            order = order;
            const matchParams = order.buildMatching();
            const exchange = new Sdk.OpenDao.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(this.contract.address, order, matchParams),
                exchangeKind: types_1.ExchangeKind.ZEROEX_V4,
                maker: order.params.maker,
            };
        }
        else if (kind === "wyvern-v2.3") {
            order = order;
            const matchParams = order.buildMatching(this.contract.address, {
                order,
                nonce: 0,
                // Wyvern v2.3 supports specifying a recipient other than the taker
                recipient: taker,
            });
            // Set the listing time in the past so that on-chain validation passes
            matchParams.params.listingTime = await this.provider
                .getBlock("latest")
                .then((b) => b.timestamp - 2 * 60);
            const exchange = new Sdk.WyvernV23.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(this.contract.address, matchParams, order),
                exchangeKind: types_1.ExchangeKind.WYVERN_V23,
                maker: order.params.maker,
            };
        }
        else if (kind === "x2y2") {
            order = order;
            // X2Y2 requires an API key to fill
            const exchange = new Sdk.X2Y2.Exchange(this.chainId, String(process.env.X2Y2_API_KEY));
            return {
                tx: await exchange.fillOrderTx(this.contract.address, order),
                exchangeKind: types_1.ExchangeKind.X2Y2,
                maker: order.params.maker,
            };
        }
        else if (kind === "zeroex-v4") {
            order = order;
            // Support passing an amount for partially fillable erc1155 orders
            const matchParams = order.buildMatching({ amount });
            const exchange = new Sdk.ZeroExV4.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(this.contract.address, order, matchParams),
                exchangeKind: types_1.ExchangeKind.ZEROEX_V4,
                maker: order.params.maker,
            };
        }
        else if (kind === "seaport") {
            order = order;
            // Support passing an amount for partially fillable orders
            const matchParams = order.buildMatching({ amount });
            const exchange = new Sdk.Seaport.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(this.contract.address, order, matchParams, {
                    recipient: taker,
                }),
                exchangeKind: types_1.ExchangeKind.SEAPORT,
                maker: order.params.offerer,
            };
        }
        throw new Error("Unreachable");
    }
    async generateNativeBidFillTx({ kind, order, tokenId, extraArgs, }) {
        // When filling through the router, in all below cases we set
        // the router contract as the taker since forwarding received
        // tokens to the actual taker of the order will be taken care
        // of on-chain by the router.
        const filler = this.contract.address;
        if (kind === "looks-rare") {
            order = order;
            const matchParams = order.buildMatching(filler, {
                tokenId,
                ...(extraArgs || {}),
            });
            const exchange = new Sdk.LooksRare.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(filler, order, matchParams),
                exchangeKind: types_1.ExchangeKind.LOOKS_RARE,
            };
        }
        else if (kind === "opendao") {
            order = order;
            const matchParams = order.buildMatching({
                tokenId,
                amount: 1,
                // Do not unwrap in order to be compatible with the router
                unwrapNativeToken: false,
            });
            const exchange = new Sdk.OpenDao.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(filler, order, matchParams, {
                    // Do not use the `onReceived` hook filling to be compatible with the router
                    noDirectTransfer: true,
                }),
                exchangeKind: types_1.ExchangeKind.ZEROEX_V4,
            };
        }
        else if (kind === "wyvern-v2.3") {
            order = order;
            const matchParams = order.buildMatching(filler, {
                tokenId,
                nonce: 0,
                ...(extraArgs || {}),
            });
            // Set the listing time in the past so that on-chain validation passes
            matchParams.params.listingTime = await this.provider
                .getBlock("latest")
                .then((b) => b.timestamp - 2 * 60);
            const exchange = new Sdk.WyvernV23.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(filler, order, matchParams),
                exchangeKind: types_1.ExchangeKind.WYVERN_V23,
            };
        }
        else if (kind === "zeroex-v4") {
            order = order;
            const matchParams = order.buildMatching({
                tokenId,
                amount: 1,
                // Do not unwrap in order to be compatible with the router
                unwrapNativeToken: false,
            });
            const exchange = new Sdk.ZeroExV4.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(filler, order, matchParams, {
                    // Do not use the `onReceived` hook filling to be compatible with the router
                    noDirectTransfer: true,
                }),
                exchangeKind: types_1.ExchangeKind.ZEROEX_V4,
            };
        }
        else if (kind === "seaport") {
            order = order;
            const matchParams = order.buildMatching({
                tokenId,
                ...(extraArgs || {}),
                amount: 1,
            });
            const exchange = new Sdk.Seaport.Exchange(this.chainId);
            return {
                tx: exchange.fillOrderTx(filler, order, matchParams, 
                // Force using `fulfillAdvancedOrder` to pass router selector whitelist
                {
                    recipient: filler,
                }),
                exchangeKind: types_1.ExchangeKind.SEAPORT,
            };
        }
        throw new Error("Unreachable");
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map