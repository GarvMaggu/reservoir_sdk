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
exports.ORDER_EIP712_TYPES = exports.BundleOrder = void 0;
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const hash_1 = require("@ethersproject/hash");
const wallet_1 = require("@ethersproject/wallet");
const Addresses = __importStar(require("./addresses"));
const builders_1 = require("./builders");
const Common = __importStar(require("../common"));
const utils_1 = require("../utils");
const ConduitController_json_1 = __importDefault(require("./abis/ConduitController.json"));
const Exchange_json_1 = __importDefault(require("./abis/Exchange.json"));
class BundleOrder {
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
    hash() {
        return hash_1._TypedDataEncoder.hashStruct("OrderComponents", exports.ORDER_EIP712_TYPES, this.params);
    }
    async sign(signer) {
        const signature = await signer._signTypedData(EIP712_DOMAIN(this.chainId), exports.ORDER_EIP712_TYPES, this.params);
        this.params = {
            ...this.params,
            signature,
        };
    }
    getSignatureData() {
        return {
            signatureKind: "eip712",
            domain: EIP712_DOMAIN(this.chainId),
            types: exports.ORDER_EIP712_TYPES,
            value: this.params,
        };
    }
    checkSignature() {
        const signer = (0, wallet_1.verifyTypedData)(EIP712_DOMAIN(this.chainId), exports.ORDER_EIP712_TYPES, this.params, this.params.signature);
        if ((0, utils_1.lc)(this.params.offerer) !== (0, utils_1.lc)(signer)) {
            throw new Error("Invalid signature");
        }
    }
    checkValidity() {
        if (!this.getBuilder().isValid(this)) {
            throw new Error("Invalid order");
        }
    }
    getMatchingPrice() {
        const info = this.getInfo();
        if (!info) {
            throw new Error("Could not get order info");
        }
        if (this.params.kind === "bundle-ask") {
            return (0, utils_1.bn)(info.price).add(this.getFeeAmount());
        }
        return (0, utils_1.bn)(0);
    }
    getInfo() {
        return this.getBuilder().getInfo(this);
    }
    getFeeAmount() {
        const info = this.getBuilder().getInfo(this);
        if (info.fees) {
            let feeAmount = (0, utils_1.bn)(0);
            for (const { amount } of info.fees) {
                feeAmount = feeAmount.add(amount);
            }
            return feeAmount;
        }
        return (0, utils_1.bn)(0);
    }
    buildMatching(data) {
        return this.getBuilder().buildMatching(this, data);
    }
    async checkFillability(provider) {
        const conduitController = new contracts_1.Contract(Addresses.ConduitController[this.chainId], ConduitController_json_1.default, provider);
        const exchange = new contracts_1.Contract(Addresses.Exchange[this.chainId], Exchange_json_1.default, provider);
        const status = await exchange.getOrderStatus(this.hash());
        if (status.isCancelled) {
            throw new Error("not-fillable");
        }
        if (status.isValidated && (0, utils_1.bn)(status.totalFilled).gte(status.totalSize)) {
            throw new Error("not-fillable");
        }
        const makerConduit = this.params.conduitKey === constants_1.HashZero
            ? Addresses.Exchange[this.chainId]
            : await conduitController
                .getConduit(this.params.conduitKey)
                .then((result) => {
                if (!result.exists) {
                    throw new Error("invalid-conduit");
                }
                else {
                    return result.conduit;
                }
            });
        for (const item of this.getInfo().offerItems) {
            if (item.tokenKind === "erc20") {
                // Check that maker has enough balance to cover the payment
                // and the approval to the corresponding conduit is set
                const erc20 = new Common.Helpers.Erc20(provider, item.amount);
                const balance = await erc20.getBalance(this.params.offerer);
                if ((0, utils_1.bn)(balance).lt(item.amount)) {
                    throw new Error("no-balance");
                }
                // Check allowance
                const allowance = await erc20.getAllowance(this.params.offerer, makerConduit);
                if ((0, utils_1.bn)(allowance).lt(item.amount)) {
                    throw new Error("no-approval");
                }
            }
            else if (item.tokenKind === "erc721") {
                const erc721 = new Common.Helpers.Erc721(provider, item.contract);
                // Check ownership
                const owner = await erc721.getOwner(item.tokenId);
                if ((0, utils_1.lc)(owner) !== (0, utils_1.lc)(this.params.offerer)) {
                    throw new Error("no-balance");
                }
                // Check approval
                const isApproved = await erc721.isApproved(this.params.offerer, makerConduit);
                if (!isApproved) {
                    throw new Error("no-approval");
                }
            }
            else {
                const erc1155 = new Common.Helpers.Erc1155(provider, item.contract);
                // Check balance
                const balance = await erc1155.getBalance(this.params.offerer, item.tokenId);
                if ((0, utils_1.bn)(balance).lt(item.amount || 1)) {
                    throw new Error("no-balance");
                }
                // Check approval
                const isApproved = await erc1155.isApproved(this.params.offerer, makerConduit);
                if (!isApproved) {
                    throw new Error("no-approval");
                }
            }
        }
    }
    getBuilder() {
        switch (this.params.kind) {
            case "bundle-ask": {
                return new builders_1.Builders.Bundle.BundleAsk(this.chainId);
            }
            default: {
                throw new Error("Unknown order kind");
            }
        }
    }
    detectKind() {
        // bundle-ask
        {
            const builder = new builders_1.Builders.Bundle.BundleAsk(this.chainId);
            if (builder.isValid(this)) {
                return "bundle-ask";
            }
        }
        throw new Error("Could not detect order kind (order might have unsupported params/calldata)");
    }
}
exports.BundleOrder = BundleOrder;
const EIP712_DOMAIN = (chainId) => ({
    name: "Seaport",
    version: "1.1",
    chainId,
    verifyingContract: Addresses.Exchange[chainId],
});
exports.ORDER_EIP712_TYPES = {
    OrderComponents: [
        { name: "offerer", type: "address" },
        { name: "zone", type: "address" },
        { name: "offer", type: "OfferItem[]" },
        { name: "consideration", type: "ConsiderationItem[]" },
        { name: "orderType", type: "uint8" },
        { name: "startTime", type: "uint256" },
        { name: "endTime", type: "uint256" },
        { name: "zoneHash", type: "bytes32" },
        { name: "salt", type: "uint256" },
        { name: "conduitKey", type: "bytes32" },
        { name: "counter", type: "uint256" },
    ],
    OfferItem: [
        { name: "itemType", type: "uint8" },
        { name: "token", type: "address" },
        { name: "identifierOrCriteria", type: "uint256" },
        { name: "startAmount", type: "uint256" },
        { name: "endAmount", type: "uint256" },
    ],
    ConsiderationItem: [
        { name: "itemType", type: "uint8" },
        { name: "token", type: "address" },
        { name: "identifierOrCriteria", type: "uint256" },
        { name: "startAmount", type: "uint256" },
        { name: "endAmount", type: "uint256" },
        { name: "recipient", type: "address" },
    ],
};
const normalize = (order) => {
    // Perform some normalization operations on the order:
    // - convert bignumbers to strings where needed
    // - convert strings to numbers where needed
    // - lowercase all strings
    return {
        kind: order.kind,
        offerer: (0, utils_1.lc)(order.offerer),
        zone: (0, utils_1.lc)(order.zone),
        offer: order.offer.map((o) => ({
            itemType: (0, utils_1.n)(o.itemType),
            token: (0, utils_1.lc)(o.token),
            identifierOrCriteria: (0, utils_1.s)(o.identifierOrCriteria),
            startAmount: (0, utils_1.s)(o.startAmount),
            endAmount: (0, utils_1.s)(o.endAmount),
        })),
        consideration: order.consideration.map((c) => ({
            itemType: (0, utils_1.n)(c.itemType),
            token: (0, utils_1.lc)(c.token),
            identifierOrCriteria: (0, utils_1.s)(c.identifierOrCriteria),
            startAmount: (0, utils_1.s)(c.startAmount),
            endAmount: (0, utils_1.s)(c.endAmount),
            recipient: (0, utils_1.lc)(c.recipient),
        })),
        orderType: (0, utils_1.n)(order.orderType),
        startTime: (0, utils_1.n)(order.startTime),
        endTime: (0, utils_1.n)(order.endTime),
        zoneHash: (0, utils_1.lc)(order.zoneHash),
        salt: (0, utils_1.s)(order.salt),
        conduitKey: (0, utils_1.lc)(order.conduitKey),
        counter: (0, utils_1.s)(order.counter),
        signature: order.signature ? (0, utils_1.lc)(order.signature) : undefined,
    };
};
//# sourceMappingURL=bundle-order.js.map