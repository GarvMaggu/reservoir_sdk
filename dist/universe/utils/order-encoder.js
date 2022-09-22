"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.hashAsset = exports.hashAssetType = exports.encodeOrderData = exports.encodeAssetClass = exports.encodeAssetData = exports.encodeBundle = exports.encodeAsset = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../../utils");
const encodeAsset = (token, tokenId) => {
    if (tokenId) {
        return ethers_1.utils.defaultAbiCoder.encode(["address", "uint256"], [token, tokenId]);
    }
    else if (token) {
        return ethers_1.utils.defaultAbiCoder.encode(["address"], [token]);
    }
    else {
        return "0x";
    }
};
exports.encodeAsset = encodeAsset;
const encodeBundle = (tokenAddresses, tokenIds) => {
    const toEncode = tokenAddresses.map((token, index) => {
        return [token, tokenIds[index]];
    });
    return ethers_1.utils.defaultAbiCoder.encode(["tuple(address,uint256[])[]"], [toEncode]);
};
exports.encodeBundle = encodeBundle;
const encodeAssetData = (assetType) => {
    return (0, exports.encodeAsset)(assetType.contract, assetType.tokenId);
};
exports.encodeAssetData = encodeAssetData;
const encodeAssetClass = (assetClass) => {
    if (!assetClass) {
        return "0xffffffff";
    }
    return ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes(assetClass)).substring(0, 10);
};
exports.encodeAssetClass = encodeAssetClass;
const encodeOrderData = (payments) => {
    if (!payments) {
        return "0x";
    }
    return ethers_1.utils.defaultAbiCoder.encode(["tuple(tuple(address account,uint96 value)[] revenueSplits)"], [
        {
            revenueSplits: payments,
        },
    ]);
};
exports.encodeOrderData = encodeOrderData;
const hashAssetType = (assetType) => {
    const assetTypeData = (0, exports.encodeAssetData)(assetType);
    const encodedAssetType = ethers_1.utils.defaultAbiCoder.encode(["bytes32", "bytes4", "bytes32"], [
        ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes("AssetType(bytes4 assetClass,bytes data)")),
        (0, exports.encodeAssetClass)(assetType.assetClass),
        ethers_1.utils.keccak256(assetTypeData),
    ]);
    return ethers_1.utils.keccak256(encodedAssetType);
};
exports.hashAssetType = hashAssetType;
const hashAsset = (asset) => {
    const encodedAsset = ethers_1.utils.defaultAbiCoder.encode(["bytes32", "bytes32", "uint256"], [
        ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes("Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)")),
        (0, exports.hashAssetType)(asset.assetType),
        asset.value,
    ]);
    return ethers_1.utils.keccak256(encodedAsset);
};
exports.hashAsset = hashAsset;
/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
const encode = (order) => {
    var _a, _b;
    return {
        maker: (0, utils_1.lc)(order.maker),
        makeAsset: {
            assetType: {
                assetClass: (0, exports.encodeAssetClass)(order.make.assetType.assetClass),
                data: (0, exports.encodeAssetData)(order.make.assetType),
            },
            value: order.make.value,
        },
        taker: order.taker,
        takeAsset: {
            assetType: {
                assetClass: (0, exports.encodeAssetClass)(order.take.assetType.assetClass),
                data: (0, exports.encodeAssetData)(order.take.assetType),
            },
            value: order.take.value,
        },
        salt: order.salt,
        start: order.start,
        end: order.end,
        dataType: (0, exports.encodeAssetClass)((_a = order.data) === null || _a === void 0 ? void 0 : _a.dataType),
        data: (0, exports.encodeOrderData)(((_b = order.data) === null || _b === void 0 ? void 0 : _b.revenueSplits) || []),
    };
};
exports.encode = encode;
//# sourceMappingURL=order-encoder.js.map