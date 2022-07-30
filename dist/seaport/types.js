"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Side = exports.BasicOrderType = exports.OrderType = exports.ItemType = void 0;
var ItemType;
(function (ItemType) {
    ItemType[ItemType["NATIVE"] = 0] = "NATIVE";
    ItemType[ItemType["ERC20"] = 1] = "ERC20";
    ItemType[ItemType["ERC721"] = 2] = "ERC721";
    ItemType[ItemType["ERC1155"] = 3] = "ERC1155";
    ItemType[ItemType["ERC721_WITH_CRITERIA"] = 4] = "ERC721_WITH_CRITERIA";
    ItemType[ItemType["ERC1155_WITH_CRITERIA"] = 5] = "ERC1155_WITH_CRITERIA";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
var OrderType;
(function (OrderType) {
    OrderType[OrderType["FULL_OPEN"] = 0] = "FULL_OPEN";
    OrderType[OrderType["PARTIAL_OPEN"] = 1] = "PARTIAL_OPEN";
    OrderType[OrderType["FULL_RESTRICTED"] = 2] = "FULL_RESTRICTED";
    OrderType[OrderType["PARTIAL_RESTRICTED"] = 3] = "PARTIAL_RESTRICTED";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var BasicOrderType;
(function (BasicOrderType) {
    BasicOrderType[BasicOrderType["ETH_TO_ERC721_FULL_OPEN"] = 0] = "ETH_TO_ERC721_FULL_OPEN";
    BasicOrderType[BasicOrderType["ETH_TO_ERC721_PARTIAL_OPEN"] = 1] = "ETH_TO_ERC721_PARTIAL_OPEN";
    BasicOrderType[BasicOrderType["ETH_TO_ERC721_FULL_RESTRICTED"] = 2] = "ETH_TO_ERC721_FULL_RESTRICTED";
    BasicOrderType[BasicOrderType["ETH_TO_ERC721_PARTIAL_RESTRICTED"] = 3] = "ETH_TO_ERC721_PARTIAL_RESTRICTED";
    BasicOrderType[BasicOrderType["ETH_TO_ERC1155_FULL_OPEN"] = 4] = "ETH_TO_ERC1155_FULL_OPEN";
    BasicOrderType[BasicOrderType["ETH_TO_ERC1155_PARTIAL_OPEN"] = 5] = "ETH_TO_ERC1155_PARTIAL_OPEN";
    BasicOrderType[BasicOrderType["ETH_TO_ERC1155_FULL_RESTRICTED"] = 6] = "ETH_TO_ERC1155_FULL_RESTRICTED";
    BasicOrderType[BasicOrderType["ETH_TO_ERC1155_PARTIAL_RESTRICTED"] = 7] = "ETH_TO_ERC1155_PARTIAL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC721_FULL_OPEN"] = 8] = "ERC20_TO_ERC721_FULL_OPEN";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC721_PARTIAL_OPEN"] = 9] = "ERC20_TO_ERC721_PARTIAL_OPEN";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC721_FULL_RESTRICTED"] = 10] = "ERC20_TO_ERC721_FULL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC721_PARTIAL_RESTRICTED"] = 11] = "ERC20_TO_ERC721_PARTIAL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC1155_FULL_OPEN"] = 12] = "ERC20_TO_ERC1155_FULL_OPEN";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC1155_PARTIAL_OPEN"] = 13] = "ERC20_TO_ERC1155_PARTIAL_OPEN";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC1155_FULL_RESTRICTED"] = 14] = "ERC20_TO_ERC1155_FULL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC20_TO_ERC1155_PARTIAL_RESTRICTED"] = 15] = "ERC20_TO_ERC1155_PARTIAL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC721_TO_ERC20_FULL_OPEN"] = 16] = "ERC721_TO_ERC20_FULL_OPEN";
    BasicOrderType[BasicOrderType["ERC721_TO_ERC20_PARTIAL_OPEN"] = 17] = "ERC721_TO_ERC20_PARTIAL_OPEN";
    BasicOrderType[BasicOrderType["ERC721_TO_ERC20_FULL_RESTRICTED"] = 18] = "ERC721_TO_ERC20_FULL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC721_TO_ERC20_PARTIAL_RESTRICTED"] = 19] = "ERC721_TO_ERC20_PARTIAL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC1155_TO_ERC20_FULL_OPEN"] = 20] = "ERC1155_TO_ERC20_FULL_OPEN";
    BasicOrderType[BasicOrderType["ERC1155_TO_ERC20_PARTIAL_OPEN"] = 21] = "ERC1155_TO_ERC20_PARTIAL_OPEN";
    BasicOrderType[BasicOrderType["ERC1155_TO_ERC20_FULL_RESTRICTED"] = 22] = "ERC1155_TO_ERC20_FULL_RESTRICTED";
    BasicOrderType[BasicOrderType["ERC1155_TO_ERC20_PARTIAL_RESTRICTED"] = 23] = "ERC1155_TO_ERC20_PARTIAL_RESTRICTED";
})(BasicOrderType = exports.BasicOrderType || (exports.BasicOrderType = {}));
var Side;
(function (Side) {
    Side[Side["OFFER"] = 0] = "OFFER";
    Side[Side["CONSIDERATION"] = 1] = "CONSIDERATION";
})(Side = exports.Side || (exports.Side = {}));
//# sourceMappingURL=types.js.map