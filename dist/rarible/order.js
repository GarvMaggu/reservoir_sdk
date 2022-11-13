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
const Addresses = __importStar(require("./addresses"));
const builders_1 = require("./builders");
const Types = __importStar(require("./types"));
const utils_1 = require("../utils");
const lib_1 = require("ethers/lib");
const Erc721_json_1 = __importDefault(require("../common/abis/Erc721.json"));
const Erc20_json_1 = __importDefault(require("../common/abis/Erc20.json"));
const Erc1155_json_1 = __importDefault(require("../common/abis/Erc1155.json"));
const utils_2 = require("./utils");
const constants_1 = require("./constants");
class Order {
    constructor(chainId, params) {
        this.EIP712_DOMAIN = (chainId) => ({
            name: "Exchange",
            version: "2",
            chainId,
            verifyingContract: Addresses.Exchange[chainId],
        });
        this.chainId = chainId;
        try {
            this.params = normalize(params);
        }
        catch (err) {
            console.log(err);
            throw new Error("Invalid params");
        }
        if (this.params.start > this.params.end) {
            throw new Error("Invalid listing and/or expiration time");
        }
    }
    hashOrderKey() {
        let encodedOrderKey = null;
        switch (this.params.data.dataType) {
            case constants_1.ORDER_DATA_TYPES.V1:
            case constants_1.ORDER_DATA_TYPES.DEFAULT_DATA_TYPE:
                encodedOrderKey = lib_1.utils.defaultAbiCoder.encode(["address", "bytes32", "bytes32", "uint256"], [
                    (0, utils_1.lc)(this.params.maker),
                    (0, utils_2.hashAssetType)(this.params.make.assetType),
                    (0, utils_2.hashAssetType)(this.params.take.assetType),
                    this.params.salt,
                ]);
                break;
            default:
                encodedOrderKey = lib_1.utils.defaultAbiCoder.encode(["address", "bytes32", "bytes32", "uint256", "bytes"], [
                    (0, utils_1.lc)(this.params.maker),
                    (0, utils_2.hashAssetType)(this.params.make.assetType),
                    (0, utils_2.hashAssetType)(this.params.take.assetType),
                    this.params.salt,
                    (0, utils_2.encodeOrderData)(this.params),
                ]);
                break;
        }
        return lib_1.utils.keccak256(encodedOrderKey);
    }
    async sign(signer) {
        const signature = await signer._signTypedData(this.EIP712_DOMAIN(this.chainId), Types.EIP712_TYPES, toRawOrder(this));
        this.params = {
            ...this.params,
            signature,
        };
    }
    getSignatureData() {
        return {
            signatureKind: "eip712",
            domain: this.EIP712_DOMAIN(this.chainId),
            types: Types.EIP712_TYPES,
            value: toRawOrder(this),
        };
    }
    checkSignature() {
        const signer = lib_1.utils.verifyTypedData(this.EIP712_DOMAIN(this.chainId), Types.EIP712_TYPES, toRawOrder(this), this.params.signature);
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
        const singleTokenBuilder = new builders_1.Builders.SingleToken(this.chainId);
        if (singleTokenBuilder.isValid(this)) {
            return "single-token";
        }
        const contractBuilder = new builders_1.Builders.ContractWide(this.chainId);
        if (contractBuilder.isValid(this)) {
            return "contract-wide";
        }
        throw new Error("Could not detect order kind (order might have unsupported params/calldata)");
    }
}
exports.Order = Order;
const toRawOrder = (order) => {
    const encoded = (0, utils_2.encodeForMatchOrders)(order.params);
    return encoded;
};
const normalize = (order) => {
    // Perform some normalization operations on the order:
    // - parse Rarible API order format
    // - convert bignumbers to strings where needed
    // - convert strings to numbers where needed
    // - lowercase all strings
    let dataInfo = null;
    order.data.dataType =
        order.data.dataType || order.data["@type"] || "";
    switch (order.data.dataType) {
        case constants_1.ORDER_DATA_TYPES.LEGACY:
        case constants_1.ORDER_DATA_TYPES.V1:
        case constants_1.ORDER_DATA_TYPES.API_V1:
            order.data.dataType = constants_1.ORDER_DATA_TYPES.V1;
            dataInfo = order.data;
            break;
        case constants_1.ORDER_DATA_TYPES.V2:
        case constants_1.ORDER_DATA_TYPES.API_V2:
            order.data.dataType = constants_1.ORDER_DATA_TYPES.V2;
            dataInfo = order.data;
            if (dataInfo.originFees) {
                dataInfo.originFees = dataInfo.originFees.map((fee) => normalizePartData(fee));
            }
            if (dataInfo.payouts) {
                dataInfo.payouts = dataInfo.payouts.map((fee) => normalizePartData(fee));
            }
            break;
        case constants_1.ORDER_DATA_TYPES.V3_SELL:
        case constants_1.ORDER_DATA_TYPES.API_V3_SELL:
            dataInfo = order.data;
            order.data.dataType = constants_1.ORDER_DATA_TYPES.V3_SELL;
            if (dataInfo.originFeeFirst) {
                dataInfo.originFeeFirst = normalizePartData(dataInfo.originFeeFirst);
            }
            if (dataInfo.originFeeSecond) {
                dataInfo.originFeeSecond = normalizePartData(dataInfo.originFeeSecond);
            }
            if (dataInfo.payouts) {
                dataInfo.payouts = normalizePartData(dataInfo.payouts);
            }
            break;
        case constants_1.ORDER_DATA_TYPES.V3_BUY:
        case constants_1.ORDER_DATA_TYPES.API_V3_BUY:
            dataInfo = order.data;
            order.data.dataType = constants_1.ORDER_DATA_TYPES.V3_BUY;
            if (dataInfo.originFeeFirst) {
                dataInfo.originFeeFirst = normalizePartData(dataInfo.originFeeFirst);
            }
            if (dataInfo.originFeeSecond) {
                dataInfo.originFeeSecond = normalizePartData(dataInfo.originFeeSecond);
            }
            if (dataInfo.payouts) {
                dataInfo.payouts = normalizePartData(dataInfo.payouts);
            }
            break;
        default:
            throw Error("Unknown rarible order data type");
    }
    var { assetClass: makeAssetClass, tokenId: makeTokenId, contract: makeContract, value: makeValue, lazyMintInfo: makeLazyMintInfo, } = parseAssetData(order.make);
    var { assetClass: takeAssetClass, tokenId: takeTokenId, contract: takeContract, value: takeValue, lazyMintInfo: takeLazyMintInfo, } = parseAssetData(order.take);
    const maker = extractAddressFromChain(order.maker);
    const taker = extractAddressFromChain(order.taker || lib_1.constants.AddressZero);
    const hash = extractAddressFromChain(order.hash || order.id || "");
    const tokenKind = takeAssetClass.toLowerCase().includes("collection")
        ? "contract-wide"
        : "single-token";
    const side = tokenKind === "contract-wide" || takeTokenId ? "buy" : "sell";
    const salt = order.salt;
    const start = (0, utils_1.n)(order.start) || 0;
    const end = Math.floor(new Date(order.endedAt || "").getTime() / 1000) ||
        (0, utils_1.n)(order.end) ||
        0;
    return {
        kind: tokenKind,
        side: side,
        signature: order.signature,
        type: order.type || "RARIBLE",
        maker: (0, utils_1.lc)(maker),
        hash: hash,
        make: {
            assetType: {
                assetClass: (0, utils_1.s)(makeAssetClass),
                ...(makeTokenId && {
                    tokenId: makeTokenId,
                }),
                ...(makeContract && {
                    contract: (0, utils_1.lc)(makeContract),
                }),
                ...makeLazyMintInfo,
            },
            value: (0, utils_1.s)(makeValue),
        },
        taker: (0, utils_1.lc)(taker),
        take: {
            assetType: {
                assetClass: (0, utils_1.s)(takeAssetClass),
                ...(takeTokenId && {
                    tokenId: takeTokenId,
                }),
                ...(takeContract && {
                    contract: (0, utils_1.lc)(takeContract),
                }),
                ...takeLazyMintInfo,
            },
            value: (0, utils_1.s)(takeValue),
        },
        salt,
        start,
        end,
        data: dataInfo,
    };
};
function extractAddressFromChain(address) {
    if (!address) {
        return "";
    }
    const addressHasChainInfo = address.indexOf(":") >= 0;
    const parsedAddress = addressHasChainInfo ? address.split(":")[1] : address;
    return parsedAddress;
}
function parseAssetData(assetInfo) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    let assetClass = (((_a = assetInfo.assetType) === null || _a === void 0 ? void 0 : _a.assetClass) ||
        assetInfo.type["@type"] ||
        "").toUpperCase();
    const contract = extractAddressFromChain(((_b = assetInfo.assetType) === null || _b === void 0 ? void 0 : _b.contract) || ((_d = (_c = assetInfo) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.contract) || "");
    const tokenId = ((_e = assetInfo.assetType) === null || _e === void 0 ? void 0 : _e.tokenId) || ((_g = (_f = assetInfo) === null || _f === void 0 ? void 0 : _f.type) === null || _g === void 0 ? void 0 : _g.tokenId) || "";
    const valueIsDecimal = assetInfo.value.includes(".");
    // It's safe to assume for now that 18 will work
    const value = valueIsDecimal
        ? lib_1.utils.parseEther(assetInfo.value)
        : assetInfo.value;
    const lazyMintInfo = {
        ...((((_h = assetInfo.assetType) === null || _h === void 0 ? void 0 : _h.uri) || ((_j = assetInfo.type) === null || _j === void 0 ? void 0 : _j.uri)) && {
            uri: ((_k = assetInfo.assetType) === null || _k === void 0 ? void 0 : _k.uri) || ((_l = assetInfo.type) === null || _l === void 0 ? void 0 : _l.uri),
        }),
        ...((((_m = assetInfo.assetType) === null || _m === void 0 ? void 0 : _m.supply) || ((_o = assetInfo.type) === null || _o === void 0 ? void 0 : _o.supply)) && {
            supply: ((_p = assetInfo.assetType) === null || _p === void 0 ? void 0 : _p.supply) || ((_q = assetInfo.type) === null || _q === void 0 ? void 0 : _q.supply),
        }),
        ...((((_r = assetInfo.assetType) === null || _r === void 0 ? void 0 : _r.creators) || ((_s = assetInfo.type) === null || _s === void 0 ? void 0 : _s.creators)) && {
            creators: (((_t = assetInfo.assetType) === null || _t === void 0 ? void 0 : _t.creators) || ((_u = assetInfo.type) === null || _u === void 0 ? void 0 : _u.creators)).map((l) => normalizePartData(l)),
        }),
        ...((((_v = assetInfo.assetType) === null || _v === void 0 ? void 0 : _v.royalties) || ((_w = assetInfo.type) === null || _w === void 0 ? void 0 : _w.royalties)) && {
            royalties: (((_x = assetInfo.assetType) === null || _x === void 0 ? void 0 : _x.royalties) || ((_y = assetInfo.type) === null || _y === void 0 ? void 0 : _y.royalties)).map((l) => normalizePartData(l)),
        }),
        ...((((_z = assetInfo.assetType) === null || _z === void 0 ? void 0 : _z.signatures) || ((_0 = assetInfo.type) === null || _0 === void 0 ? void 0 : _0.signatures)) && {
            signatures: (((_1 = assetInfo.assetType) === null || _1 === void 0 ? void 0 : _1.signatures) || ((_2 = assetInfo.type) === null || _2 === void 0 ? void 0 : _2.signatures)).map((l) => extractAddressFromChain(l)),
        }),
    };
    return { assetClass, tokenId, contract, value, lazyMintInfo };
}
function normalizePartData(fee) {
    const address = extractAddressFromChain(fee.account);
    return { ...fee, account: (0, utils_1.lc)(address) };
}
//# sourceMappingURL=order.js.map