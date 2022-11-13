"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = exports.AssetClass = exports.EIP712_TYPES = void 0;
exports.EIP712_TYPES = {
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
var AssetClass;
(function (AssetClass) {
    AssetClass["ERC20"] = "ERC20";
    AssetClass["ETH"] = "ETH";
    AssetClass["ERC721"] = "ERC721";
    AssetClass["ERC1155"] = "ERC1155";
    AssetClass["COLLECTION"] = "COLLECTION";
    AssetClass["ERC721_LAZY"] = "ERC721_LAZY";
    AssetClass["ERC1155_LAZY"] = "ERC1155_LAZY";
})(AssetClass = exports.AssetClass || (exports.AssetClass = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["BUY"] = 0] = "BUY";
    OrderSide[OrderSide["SELL"] = 1] = "SELL";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
//# sourceMappingURL=types.js.map