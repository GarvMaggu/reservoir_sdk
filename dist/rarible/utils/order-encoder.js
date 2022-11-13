"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeForMatchOrders = exports.encodeForContract = exports.hashAssetType = exports.encodeOrderData = exports.encodeV3OrderData = exports.encodeV2OrderData = exports.encodeAssetClass = exports.encodeAssetData = void 0;
const ethers_1 = require("ethers");
const __1 = require("..");
const constants_1 = require("../constants");
const types_1 = require("../types");
const order_info_1 = require("./order-info");
const encodeAssetData = (assetType) => {
    switch (assetType.assetClass) {
        case types_1.AssetClass.ETH:
            return "0x";
        case types_1.AssetClass.ERC20:
        case types_1.AssetClass.COLLECTION:
            return ethers_1.utils.defaultAbiCoder.encode(["address"], [assetType.contract]);
        case types_1.AssetClass.ERC721:
        case types_1.AssetClass.ERC1155:
            return ethers_1.utils.defaultAbiCoder.encode(["address", "uint256"], [assetType.contract, assetType.tokenId]);
        case types_1.AssetClass.ERC721_LAZY:
            return ethers_1.utils.defaultAbiCoder.encode([
                "address contract",
                "tuple(uint256 tokenId, string uri, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)",
            ], [
                assetType.contract,
                {
                    tokenId: assetType.tokenId,
                    uri: assetType.uri,
                    creators: (0, exports.encodeV2OrderData)(assetType.creators),
                    royalties: (0, exports.encodeV2OrderData)(assetType.royalties),
                    signatures: assetType.signatures || [],
                },
            ]);
        case types_1.AssetClass.ERC1155_LAZY:
            return ethers_1.utils.defaultAbiCoder.encode([
                "address contract",
                "tuple(uint256 tokenId, string uri, uint256 supply, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)",
            ], [
                assetType.contract,
                {
                    tokenId: assetType.tokenId,
                    uri: assetType.uri,
                    supply: assetType.supply,
                    creators: (0, exports.encodeV2OrderData)(assetType.creators),
                    royalties: (0, exports.encodeV2OrderData)(assetType.royalties),
                    signatures: assetType.signatures || [],
                },
            ]);
        default:
            throw Error("Unknown rarible asset data");
    }
};
exports.encodeAssetData = encodeAssetData;
const encodeAssetClass = (assetClass) => {
    if (!assetClass) {
        return "0xffffffff";
    }
    return ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes(assetClass)).substring(0, 10);
};
exports.encodeAssetClass = encodeAssetClass;
const encodeV2OrderData = (payments) => {
    if (!payments) {
        return [];
    }
    return payments;
};
exports.encodeV2OrderData = encodeV2OrderData;
// V3 Order Data fields are encoded in a special way. From Rarible's docs:
// - `uint payouts`, `uint originFeeFirst`, `uint originFeeSecond`, work the same as in `V1` orders, but there is only 1 value
// and address + amount are encoded into uint (first 12 bytes for amount, last 20 bytes for address), not using `LibPart.Part` struct
const encodeV3OrderData = (part) => {
    if (!part) {
        return ethers_1.utils.defaultAbiCoder.encode(["uint"], ["0"]);
    }
    const { account, value } = part;
    const uint96EncodedValue = ethers_1.utils.solidityPack(["uint96"], [value]);
    const encodedData = `${uint96EncodedValue}${account.slice(2)}`;
    return encodedData;
};
exports.encodeV3OrderData = encodeV3OrderData;
const encodeOrderData = (order) => {
    let encodedOrderData = "";
    switch (order.data.dataType) {
        case constants_1.ORDER_DATA_TYPES.V1:
        case constants_1.ORDER_DATA_TYPES.API_V1:
            const v1Data = order.data;
            encodedOrderData = ethers_1.utils.defaultAbiCoder.encode([
                "tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees)",
            ], [
                {
                    payouts: (0, exports.encodeV2OrderData)(v1Data.payouts),
                    originFees: (0, exports.encodeV2OrderData)(v1Data.originFees),
                },
            ]);
            break;
        case __1.Constants.ORDER_DATA_TYPES.V2:
        case __1.Constants.ORDER_DATA_TYPES.API_V2:
            const v2Data = order.data;
            const side = (0, order_info_1.getOrderSide)(order.make.assetType.assetClass, order.take.assetType.assetClass);
            const isMakeFill = side === "buy" ? 0 : 1;
            encodedOrderData = ethers_1.utils.defaultAbiCoder.encode([
                "tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees, bool isMakeFill)",
            ], [
                {
                    payouts: (0, exports.encodeV2OrderData)(v2Data.payouts),
                    originFees: (0, exports.encodeV2OrderData)(v2Data.originFees),
                    isMakeFill: isMakeFill,
                },
            ]);
            break;
        case __1.Constants.ORDER_DATA_TYPES.V3_SELL:
        case __1.Constants.ORDER_DATA_TYPES.API_V3_SELL:
            const v3SellData = order.data;
            encodedOrderData = ethers_1.utils.defaultAbiCoder.encode([
                "uint payouts",
                "uint originFeeFirst",
                "uint originFeeSecond",
                "uint maxFeesBasePoint",
                "bytes32 marketplaceMarker",
            ], [
                (0, exports.encodeV3OrderData)(v3SellData.payouts),
                (0, exports.encodeV3OrderData)(v3SellData.originFeeFirst),
                (0, exports.encodeV3OrderData)(v3SellData.originFeeSecond),
                // TODO: Think of how to generate when maxFeesBasePoint is not passed in case of buy orders
                v3SellData.maxFeesBasePoint || "1000",
                ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes(v3SellData.marketplaceMarker || "")),
            ]);
            break;
        case __1.Constants.ORDER_DATA_TYPES.V3_BUY:
        case __1.Constants.ORDER_DATA_TYPES.API_V3_BUY:
            const v3BuyData = order.data;
            encodedOrderData = ethers_1.utils.defaultAbiCoder.encode([
                "uint payouts",
                "uint originFeeFirst",
                "uint originFeeSecond",
                "bytes32 marketplaceMarker",
            ], [
                (0, exports.encodeV3OrderData)(v3BuyData.payouts),
                (0, exports.encodeV3OrderData)(v3BuyData.originFeeFirst),
                (0, exports.encodeV3OrderData)(v3BuyData.originFeeSecond),
                ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes(v3BuyData.marketplaceMarker || "")),
            ]);
            break;
        default:
            throw Error("Unknown rarible order type");
    }
    return encodedOrderData;
};
exports.encodeOrderData = encodeOrderData;
const hashAssetType = (assetType) => {
    const encodedAssetType = ethers_1.utils.defaultAbiCoder.encode(["bytes32", "bytes4", "bytes32"], [
        ethers_1.utils.keccak256(ethers_1.utils.toUtf8Bytes("AssetType(bytes4 assetClass,bytes data)")),
        (0, exports.encodeAssetClass)(assetType.assetClass),
        ethers_1.utils.keccak256((0, exports.encodeAssetData)(assetType)),
    ]);
    return ethers_1.utils.keccak256(encodedAssetType);
};
exports.hashAssetType = hashAssetType;
/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
const encodeForContract = (order, matchingOrder) => {
    var _a, _b;
    switch (order.side) {
        case "buy":
            const bid = {
                bidMaker: order.maker,
                bidNftAmount: order.take.value,
                nftAssetClass: (0, exports.encodeAssetClass)(order.take.assetType.assetClass),
                nftData: (0, exports.encodeAssetData)(order.take.assetType),
                bidPaymentAmount: order.make.value,
                paymentToken: order.make.assetType.contract || ethers_1.constants.AddressZero,
                bidSalt: order.salt,
                bidStart: order.start,
                bidEnd: order.end,
                bidDataType: (0, exports.encodeAssetClass)((_a = order.data) === null || _a === void 0 ? void 0 : _a.dataType),
                bidData: (0, exports.encodeOrderData)(order),
                bidSignature: order.signature,
                sellOrderPaymentAmount: matchingOrder.take.value,
                sellOrderNftAmount: Number(matchingOrder.make.value),
                sellOrderData: (0, exports.encodeOrderData)(matchingOrder),
            };
            return bid;
        case "sell":
            const purchase = {
                sellOrderMaker: order.maker,
                sellOrderNftAmount: order.make.value,
                nftAssetClass: (0, exports.encodeAssetClass)(order.make.assetType.assetClass),
                nftData: (0, exports.encodeAssetData)(order.make.assetType),
                sellOrderPaymentAmount: order.take.value,
                paymentToken: order.take.assetType.contract || ethers_1.constants.AddressZero,
                sellOrderSalt: order.salt,
                sellOrderStart: order.start,
                sellOrderEnd: order.end,
                sellOrderDataType: (0, exports.encodeAssetClass)((_b = order.data) === null || _b === void 0 ? void 0 : _b.dataType),
                sellOrderData: (0, exports.encodeOrderData)(order),
                sellOrderSignature: order.signature,
                buyOrderPaymentAmount: matchingOrder.make.value,
                buyOrderNftAmount: Number(matchingOrder.take.value),
                buyOrderData: (0, exports.encodeOrderData)(matchingOrder),
            };
            return purchase;
        default:
            throw Error("Unknown order side");
    }
};
exports.encodeForContract = encodeForContract;
/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
const encodeForMatchOrders = (order) => {
    var _a;
    return {
        maker: order.maker,
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
        data: (0, exports.encodeOrderData)(order),
    };
};
exports.encodeForMatchOrders = encodeForMatchOrders;
//# sourceMappingURL=order-encoder.js.map