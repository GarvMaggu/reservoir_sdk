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
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const solidity_1 = require("@ethersproject/solidity");
const Addresses = __importStar(require("./addresses"));
const Types = __importStar(require("./types"));
const CommonAddresses = __importStar(require("../common/addresses"));
const utils_1 = require("../utils");
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
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
        var _a, _b, _c;
        const recipient = (_a = options === null || options === void 0 ? void 0 : options.recipient) !== null && _a !== void 0 ? _a : constants_1.AddressZero;
        const conduitKey = (_b = options === null || options === void 0 ? void 0 : options.conduitKey) !== null && _b !== void 0 ? _b : constants_1.HashZero;
        const feesOnTop = (_c = options === null || options === void 0 ? void 0 : options.feesOnTop) !== null && _c !== void 0 ? _c : [];
        if (["single-token", "contract-wide", "token-list"].includes(order.params.kind || "")) {
            // Fill non-bundle orders
            order = order;
            let info = order.getInfo();
            if (!info) {
                throw new Error("Could not get order info");
            }
            if (info.side === "sell") {
                if (
                // Order is not private
                recipient === constants_1.AddressZero &&
                    // Order is single quantity
                    info.amount === "1" &&
                    // Order has no criteria
                    !matchParams.criteriaResolvers) {
                    info = info;
                    // Use "basic" fulfillment
                    return {
                        from: taker,
                        to: this.contract.address,
                        data: this.contract.interface.encodeFunctionData("fulfillBasicOrder", [
                            {
                                considerationToken: info.paymentToken,
                                considerationIdentifier: "0",
                                considerationAmount: info.price,
                                offerer: order.params.offerer,
                                zone: order.params.zone,
                                offerToken: info.contract,
                                offerIdentifier: info.tokenId,
                                offerAmount: info.amount,
                                basicOrderType: (info.tokenKind === "erc721"
                                    ? info.paymentToken === CommonAddresses.Eth[this.chainId]
                                        ? Types.BasicOrderType.ETH_TO_ERC721_FULL_OPEN
                                        : Types.BasicOrderType.ERC20_TO_ERC721_FULL_OPEN
                                    : info.paymentToken === CommonAddresses.Eth[this.chainId]
                                        ? Types.BasicOrderType.ETH_TO_ERC1155_FULL_OPEN
                                        : Types.BasicOrderType.ERC20_TO_ERC1155_FULL_OPEN) +
                                    order.params.orderType,
                                startTime: order.params.startTime,
                                endTime: order.params.endTime,
                                zoneHash: order.params.zoneHash,
                                salt: order.params.salt,
                                offererConduitKey: order.params.conduitKey,
                                fulfillerConduitKey: conduitKey,
                                totalOriginalAdditionalRecipients: order.params.consideration.length - 1,
                                additionalRecipients: [
                                    ...order.params.consideration
                                        .slice(1)
                                        .map(({ startAmount, recipient }) => ({
                                        amount: startAmount,
                                        recipient,
                                    })),
                                    ...feesOnTop,
                                ],
                                signature: order.params.signature,
                            },
                        ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
                        value: info.paymentToken === CommonAddresses.Eth[this.chainId]
                            ? (0, utils_1.bn)(order.getMatchingPrice())
                                .mul(matchParams.amount || "1")
                                .div(info.amount)
                                .toHexString()
                            : undefined,
                    };
                }
                else {
                    // Use "advanced" fullfillment
                    return {
                        from: taker,
                        to: this.contract.address,
                        data: this.contract.interface.encodeFunctionData("fulfillAdvancedOrder", [
                            {
                                parameters: {
                                    ...order.params,
                                    totalOriginalConsiderationItems: order.params.consideration.length,
                                },
                                numerator: matchParams.amount || "1",
                                denominator: info.amount,
                                signature: order.params.signature,
                                extraData: "0x",
                            },
                            matchParams.criteriaResolvers || [],
                            conduitKey,
                            recipient,
                        ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
                        value: info.paymentToken === CommonAddresses.Eth[this.chainId]
                            ? (0, utils_1.bn)(order.getMatchingPrice())
                                .mul(matchParams.amount || "1")
                                .div(info.amount)
                                .toHexString()
                            : undefined,
                    };
                }
            }
            else {
                if (
                // Order is not private
                recipient === constants_1.AddressZero &&
                    // Order is single quantity
                    info.amount === "1" &&
                    // Order has no criteria
                    !matchParams.criteriaResolvers) {
                    info = info;
                    // Use "basic" fulfillment
                    return {
                        from: taker,
                        to: this.contract.address,
                        data: this.contract.interface.encodeFunctionData("fulfillBasicOrder", [
                            {
                                considerationToken: info.contract,
                                considerationIdentifier: info.tokenId,
                                considerationAmount: info.amount,
                                offerer: order.params.offerer,
                                zone: order.params.zone,
                                offerToken: info.paymentToken,
                                offerIdentifier: "0",
                                offerAmount: info.price,
                                basicOrderType: (info.tokenKind === "erc721"
                                    ? Types.BasicOrderType.ERC721_TO_ERC20_FULL_OPEN
                                    : Types.BasicOrderType.ERC1155_TO_ERC20_FULL_OPEN) +
                                    order.params.orderType,
                                startTime: order.params.startTime,
                                endTime: order.params.endTime,
                                zoneHash: order.params.zoneHash,
                                salt: order.params.salt,
                                offererConduitKey: order.params.conduitKey,
                                fulfillerConduitKey: conduitKey,
                                totalOriginalAdditionalRecipients: order.params.consideration.length - 1,
                                additionalRecipients: [
                                    ...order.params.consideration
                                        .slice(1)
                                        .map(({ startAmount, recipient }) => ({
                                        amount: startAmount,
                                        recipient,
                                    })),
                                    ...feesOnTop,
                                ],
                                signature: order.params.signature,
                            },
                        ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
                    };
                }
                else {
                    // Use "advanced" fulfillment
                    return {
                        from: taker,
                        to: this.contract.address,
                        data: this.contract.interface.encodeFunctionData("fulfillAdvancedOrder", [
                            {
                                parameters: {
                                    ...order.params,
                                    totalOriginalConsiderationItems: order.params.consideration.length,
                                },
                                numerator: matchParams.amount || "1",
                                denominator: info.amount,
                                signature: order.params.signature,
                                extraData: "0x",
                            },
                            matchParams.criteriaResolvers || [],
                            conduitKey,
                            recipient,
                        ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
                    };
                }
            }
        }
        else {
            // Fill bundle orders
            order = order;
            let info = order.getInfo();
            if (!info) {
                throw new Error("Could not get order info");
            }
            if (order.params.kind === "bundle-ask") {
                return {
                    from: taker,
                    to: this.contract.address,
                    data: this.contract.interface.encodeFunctionData("fulfillAdvancedOrder", [
                        {
                            parameters: {
                                ...order.params,
                                totalOriginalConsiderationItems: order.params.consideration.length,
                            },
                            numerator: matchParams.amount || "1",
                            denominator: "1",
                            signature: order.params.signature,
                            extraData: "0x",
                        },
                        matchParams.criteriaResolvers || [],
                        conduitKey,
                        recipient,
                    ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
                    value: info.paymentToken ===
                        CommonAddresses.Eth[this.chainId]
                        ? (0, utils_1.bn)(order.getMatchingPrice())
                            .mul(matchParams.amount || "1")
                            .toHexString()
                        : undefined,
                };
            }
            else {
                throw new Error("Unsupported order kind");
            }
        }
    }
    // --- Batch fill orders ---
    async fillOrders(taker, orders, matchParams, options) {
        const tx = this.fillOrdersTx(await taker.getAddress(), orders, matchParams, options);
        return taker.sendTransaction(tx);
    }
    fillOrdersTx(taker, orders, matchParams, options) {
        var _a, _b, _c;
        const recipient = (_a = options === null || options === void 0 ? void 0 : options.recipient) !== null && _a !== void 0 ? _a : constants_1.AddressZero;
        const conduitKey = (_b = options === null || options === void 0 ? void 0 : options.conduitKey) !== null && _b !== void 0 ? _b : constants_1.HashZero;
        return {
            from: taker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("fulfillAvailableAdvancedOrders", [
                orders.map((order, i) => ({
                    parameters: {
                        ...order.params,
                        totalOriginalConsiderationItems: order.params.consideration.length,
                    },
                    numerator: matchParams[i].amount || "1",
                    denominator: order.getInfo().amount,
                    signature: order.params.signature,
                    extraData: "0x",
                })),
                matchParams
                    .map((m, i) => {
                    var _a;
                    return ((_a = m.criteriaResolvers) !== null && _a !== void 0 ? _a : []).map((resolver) => ({
                        ...resolver,
                        orderIndex: i,
                    }));
                })
                    .flat(),
                // TODO: Optimize fulfillment components
                orders
                    .map((order, i) => order.params.offer.map((_, j) => ({
                    orderIndex: i,
                    itemIndex: j,
                })))
                    .flat()
                    .map((x) => [x]),
                orders
                    .map((order, i) => order.params.consideration.map((_, j) => ({
                    orderIndex: i,
                    itemIndex: j,
                })))
                    .flat()
                    .map((x) => [x]),
                conduitKey,
                recipient,
                (_c = options === null || options === void 0 ? void 0 : options.maxOrdersToFulfill) !== null && _c !== void 0 ? _c : 255,
            ]) + (0, utils_1.generateReferrerBytes)(options === null || options === void 0 ? void 0 : options.referrer),
            value: (0, utils_1.bn)(orders
                .filter((order) => {
                const info = order.getInfo();
                return (info &&
                    info.side === "sell" &&
                    info.paymentToken === CommonAddresses.Eth[this.chainId]);
            })
                .map((order, i) => (0, utils_1.bn)(order.getMatchingPrice())
                .mul(matchParams[i].amount || "1")
                .div(order.getInfo().amount))
                .reduce((a, b) => (0, utils_1.bn)(a).add(b), (0, utils_1.bn)(0))).toHexString(),
        };
    }
    // --- Cancel order ---
    async cancelOrder(maker, order) {
        const tx = this.cancelOrderTx(await maker.getAddress(), order);
        return maker.sendTransaction(tx);
    }
    cancelOrderTx(maker, order) {
        return {
            from: maker,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("cancel", [
                [order.params],
            ]),
        };
    }
    // --- Get counter (eg. nonce) ---
    async getCounter(provider, user) {
        return this.contract.connect(provider).getCounter(user);
    }
    // --- Derive conduit from key ---
    deriveConduit(conduitKey) {
        return conduitKey === constants_1.HashZero
            ? Addresses.Exchange[this.chainId]
            : "0x" +
                (0, solidity_1.keccak256)(["bytes1", "address", "bytes32", "bytes32"], [
                    "0xff",
                    Addresses.ConduitController[this.chainId],
                    conduitKey,
                    // https://github.com/ProjectOpenSea/seaport/blob/0a8e82ce7262b5ce0e67fa98a2131fd4c47c84e9/contracts/conduit/ConduitController.sol#L493
                    "0x023d904f2503c37127200ca07b976c3a53cc562623f67023115bf311f5805059",
                ]).slice(-40);
    }
    // --- Derive basic sale information ---
    deriveBasicSale(spentItems, receivedItems) {
        // Normalize
        const nSpentItems = [];
        for (const spentItem of spentItems) {
            nSpentItems.push({
                itemType: (0, utils_1.n)(spentItem.itemType),
                token: (0, utils_1.lc)(spentItem.token),
                identifier: (0, utils_1.s)(spentItem.identifier),
                amount: (0, utils_1.s)(spentItem.amount),
            });
        }
        const nReceivedItems = [];
        for (const receivedItem of receivedItems) {
            nReceivedItems.push({
                itemType: (0, utils_1.n)(receivedItem.itemType),
                token: (0, utils_1.lc)(receivedItem.token),
                identifier: (0, utils_1.s)(receivedItem.identifier),
                amount: (0, utils_1.s)(receivedItem.amount),
                recipient: (0, utils_1.lc)(receivedItem.recipient),
            });
        }
        try {
            if (nSpentItems.length === 1) {
                if (nSpentItems[0].itemType >= 2) {
                    // Listing got filled
                    const mainConsideration = nReceivedItems[0];
                    if (mainConsideration.itemType >= 2) {
                        throw new Error("Not a basic sale");
                    }
                    // Keep track of any "false" consideration items and remove them from price computation
                    const falseReceivedItemsIndexes = [];
                    let recipientOverride;
                    for (let i = 1; i < nReceivedItems.length; i++) {
                        if (nReceivedItems[i].itemType == nSpentItems[0].itemType &&
                            nReceivedItems[i].token == nSpentItems[0].token &&
                            nReceivedItems[i].identifier == nSpentItems[0].identifier) {
                            recipientOverride = nReceivedItems[i].recipient;
                            falseReceivedItemsIndexes.push(i);
                        }
                        else if (nReceivedItems[i].itemType !== mainConsideration.itemType ||
                            nReceivedItems[i].token !== mainConsideration.token) {
                            throw new Error("Not a basic sale");
                        }
                    }
                    return {
                        // To cover the generic `matchOrders` case
                        recipientOverride,
                        contract: nSpentItems[0].token,
                        tokenId: nSpentItems[0].identifier,
                        amount: nSpentItems[0].amount,
                        paymentToken: mainConsideration.token,
                        price: nReceivedItems
                            .filter((_, i) => !falseReceivedItemsIndexes.includes(i))
                            .map((c) => (0, utils_1.bn)(c.amount))
                            .reduce((a, b) => a.add(b))
                            .toString(),
                        side: "sell",
                    };
                }
                else {
                    // Bid got filled
                    const mainConsideration = nReceivedItems[0];
                    if (mainConsideration.itemType < 2) {
                        throw new Error("Not a basic sale");
                    }
                    for (let i = 1; i < nReceivedItems.length; i++) {
                        if (nReceivedItems[i].itemType !== nSpentItems[0].itemType ||
                            nReceivedItems[i].token !== nSpentItems[0].token) {
                            throw new Error("Not a basic sale");
                        }
                    }
                    return {
                        recipientOverride: undefined,
                        contract: mainConsideration.token,
                        tokenId: mainConsideration.identifier,
                        amount: mainConsideration.amount,
                        paymentToken: nSpentItems[0].token,
                        price: nSpentItems[0].amount,
                        side: "buy",
                    };
                }
            }
        }
        catch {
            return undefined;
        }
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map