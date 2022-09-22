"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = exports.AssetClass = void 0;
var AssetClass;
(function (AssetClass) {
    AssetClass["ERC20"] = "ERC20";
    AssetClass["ETH"] = "ETH";
    AssetClass["ERC721"] = "ERC721";
    AssetClass["ERC1155"] = "ERC1155";
})(AssetClass = exports.AssetClass || (exports.AssetClass = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide[OrderSide["BUY"] = 0] = "BUY";
    OrderSide[OrderSide["SELL"] = 1] = "SELL";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
//# sourceMappingURL=types.js.map