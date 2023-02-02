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
const Addresses = __importStar(require("./addresses"));
const builders_1 = require("./builders");
const utils_1 = require("../utils");
const lib_1 = require("ethers/lib");
const Erc721_json_1 = __importDefault(require("../common/abis/Erc721.json"));
const Erc20_json_1 = __importDefault(require("../common/abis/Erc20.json"));
const Erc1155_json_1 = __importDefault(require("../common/abis/Erc1155.json"));
const utils_2 = require("./utils");
class Order {
    constructor(chainId, params) {
        this.chainId = chainId;
        try {
            this.params = normalize(params);
        }
        catch {
            throw new Error("Invalid params");
        }
        // Validate fees
        if (this.params.data.revenueSplits &&
            this.params.data.revenueSplits.length &&
            this.params.data.revenueSplits.reduce((acc, curr) => (acc += Number(curr.value)), 0) > 10000) {
            throw new Error("Invalid royalties");
        }
        if (this.params.start > this.params.end) {
            throw new Error("Invalid listing and/or expiration time");
        }
    }
    hashOrderKey() {
        const encodedOrder = lib_1.utils.defaultAbiCoder.encode(["address", "bytes32", "bytes32", "uint256"], [
            (0, utils_1.lc)(this.params.maker),
            (0, utils_2.hashAssetType)(this.params.make.assetType),
            (0, utils_2.hashAssetType)(this.params.take.assetType),
            Number(this.params.salt),
        ]);
        return lib_1.utils.keccak256(encodedOrder);
    }
    async sign(signer) {
        const signature = await signer._signTypedData(EIP712_DOMAIN(this.chainId), EIP712_TYPES, (0, utils_2.encode)(this.params));
        this.params = {
            ...this.params,
            signature,
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
        const signer = lib_1.utils.verifyTypedData(EIP712_DOMAIN(this.chainId), EIP712_TYPES, (0, utils_2.encode)(toRawOrder(this)), this.params.signature);
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
        let value = false;
        switch (this.params.make.assetType.assetClass) {
            case "ERC721":
                value = await this.verifyAllowanceERC721(provider);
                break;
            case "ERC20":
                value = await this.verifyAllowanceERC20(provider);
                break;
            case "ERC1155":
                value = await this.verifyAllowanceERC1155(provider);
                break;
            default:
                break;
        }
    }
    /**
     * This method verifies "allowance" of the walletAddress on a ERC1155 contract by calling
     * isApprovedForAll() and balanceOf() methods on the contract contractAddress to see if the
     * Marketplace contract is allowed to make transfers of tokenId on this contract and
     * that the walletAddress actually owns at least the amount of tokenId on this contract.
     * @param walletAddress
     * @param contractAddress
     * @param tokenId
     * @param amount
     * @returns {Promise<boolean>}
     */
    async verifyAllowanceERC1155(provider) {
        let value = false;
        try {
            if (!lib_1.utils.isAddress(this.params.make.assetType.contract)) {
                throw new Error(`invalid-address`);
            }
            if (Number(this.params.make.value) <= 0) {
                throw new Error(`invalid-amount`);
            }
            if (isNaN(Number(this.params.make.assetType.tokenId))) {
                throw new Error("invalid-tokenId");
            }
            const erc1155Contract = new lib_1.ethers.Contract(this.params.make.assetType.contract, Erc1155_json_1.default, provider);
            const isApprovedForAll = await erc1155Contract.isApprovedForAll(this.params.maker, Addresses.Exchange[this.chainId]);
            if (true !== isApprovedForAll) {
                throw new Error("no-approval");
            }
            const balance = await erc1155Contract.balanceOf(this.params.maker, this.params.make.assetType.tokenId);
            if (BigInt(this.params.make.value) > balance) {
                throw new Error("no-balance");
            }
            value = true;
        }
        catch (e) {
            value = false;
        }
        return value;
    }
    /**
     * This method verifies "allowance" of the walletAddress on a ERC20 contract by calling
     * allowance() and balanceOf() methods on the contract contractAddress to see if the
     * Marketplace contract is allowed to make transfers of tokens on this contract and
     * that the walletAddress actually owns at least the amount of tokens on this contract.
     * @param provider
     * @returns {Promise<boolean>}
     */
    async verifyAllowanceERC20(provider) {
        let value = false;
        try {
            if (!lib_1.utils.isAddress(this.params.make.assetType.contract)) {
                throw new Error("invalid-address");
            }
            if (Number(this.params.make.value) <= 0) {
                throw new Error("invalid-amount");
            }
            const erc20Contract = new lib_1.ethers.Contract(this.params.make.assetType.contract, Erc20_json_1.default, provider);
            const allowance = await erc20Contract.allowance(this.params.maker, Addresses.Exchange[this.chainId]);
            if (BigInt(this.params.make.value) > allowance) {
                throw new Error("no-balance");
            }
            const balance = await erc20Contract.balanceOf(this.params.maker);
            if (BigInt(this.params.make.value) > balance) {
                throw new Error(`Wallet  does not have enough balance of ${this.params.make.value}, got ${balance}`);
            }
            value = true;
        }
        catch (e) {
            value = false;
        }
        return value;
    }
    /**
     * This method verifies "allowance" of the walletAddress on the ERC721 contract
     * by calling isApprovedForAll(), getApproved() and ownerOf() on the contract to verify that
     * the Marketplace contract is approved to make transfers and the walletAddress actually owns
     * the token.
     * @returns {Promise<boolean>}
     */
    async verifyAllowanceERC721(provider) {
        let value = false;
        try {
            if (!lib_1.utils.isAddress(this.params.make.assetType.contract)) {
                throw new Error(`Invalid contract address.`);
            }
            if (isNaN(Number(this.params.make.assetType.tokenId))) {
                throw new Error(`invalid-tokenId`);
            }
            const nftContract = new lib_1.ethers.Contract(this.params.make.assetType.contract, Erc721_json_1.default, provider);
            const isApprovedForAll = await nftContract.isApprovedForAll(this.params.maker);
            if (!isApprovedForAll) {
                const approvedAddress = await nftContract.getApproved(this.params.make.assetType.tokenId);
                if ((0, utils_1.lc)(approvedAddress) !== (0, utils_1.lc)(Addresses.Exchange[this.chainId])) {
                    throw new Error("no-approval");
                }
            }
            const owner = await nftContract.ownerOf(this.params.make.assetType.tokenId);
            if ((0, utils_1.lc)(owner) !== (0, utils_1.lc)(this.params.maker)) {
                throw new Error(`not-owner`);
            }
            value = true; //true if successfully reached this line.
        }
        catch (e) {
            value = false;
        }
        return value;
    }
    buildMatching(taker, data) {
        return this.getBuilder().buildMatching(this.params, taker, data);
    }
    getBuilder() {
        switch (this.params.kind) {
            case "single-token": {
                return new builders_1.Builders.SingleToken(this.chainId);
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
        throw new Error("Could not detect order kind (order might have unsupported params/calldata)");
    }
}
exports.Order = Order;
const EIP712_DOMAIN = (chainId) => ({
    name: "Exchange",
    version: "2",
    chainId,
    verifyingContract: Addresses.Exchange[chainId],
});
const EIP712_TYPES = {
    AssetType: [
        { name: "assetClass", type: "bytes4" },
        { name: "data", type: "bytes" },
    ],
    Asset: [
        { name: "assetType", type: "AssetType" },
        { name: "value", type: "uint256" },
    ],
    Order: [
        { name: "maker", type: "address" },
        { name: "makeAsset", type: "Asset" },
        { name: "taker", type: "address" },
        { name: "takeAsset", type: "Asset" },
        { name: "salt", type: "uint256" },
        { name: "start", type: "uint256" },
        { name: "end", type: "uint256" },
        { name: "dataType", type: "bytes4" },
        { name: "data", type: "bytes" },
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
    return {
        kind: order.kind,
        type: order.type,
        maker: (0, utils_1.lc)(order.maker),
        make: {
            assetType: {
                assetClass: (0, utils_1.s)(order.make.assetType.assetClass),
                ...(order.make.assetType.tokenId && {
                    tokenId: order.make.assetType.tokenId,
                }),
                ...(order.make.assetType.contract && {
                    contract: (0, utils_1.lc)(order.make.assetType.contract),
                }),
            },
            value: (0, utils_1.s)(order.make.value),
        },
        taker: (0, utils_1.lc)(order.taker),
        take: {
            assetType: {
                assetClass: (0, utils_1.s)(order.take.assetType.assetClass),
                ...(order.take.assetType.tokenId && {
                    tokenId: order.take.assetType.tokenId,
                }),
                ...(order.take.assetType.contract && {
                    contract: (0, utils_1.lc)(order.take.assetType.contract),
                }),
            },
            value: (0, utils_1.s)(order.take.value),
        },
        salt: (0, utils_1.n)(order.salt),
        start: (0, utils_1.n)(order.start),
        end: (0, utils_1.n)(order.end),
        data: {
            dataType: order.data.dataType,
            revenueSplits: !order.data.revenueSplits || !order.data.revenueSplits.length
                ? []
                : order.data.revenueSplits.map((split) => ({
                    account: (0, utils_1.lc)(split.account),
                    value: (0, utils_1.n)(split.value),
                })),
        },
        signature: order.signature,
    };
};
//# sourceMappingURL=order.js.map