"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderSide = void 0;
const __1 = require("..");
const getOrderSide = (makeAssetClass, takeAssetClass) => {
    //TODO: Can be rewriten to be more readable
    if ((makeAssetClass === __1.Types.AssetClass.ERC721 ||
        makeAssetClass === __1.Types.AssetClass.COLLECTION ||
        makeAssetClass === __1.Types.AssetClass.ERC721_LAZY ||
        makeAssetClass === __1.Types.AssetClass.ERC1155 ||
        makeAssetClass === __1.Types.AssetClass.ERC1155_LAZY) &&
        (takeAssetClass === __1.Types.AssetClass.ERC20 ||
            takeAssetClass === __1.Types.AssetClass.ETH ||
            takeAssetClass === __1.Types.AssetClass.COLLECTION)) {
        return "sell";
    }
    else if ((makeAssetClass === __1.Types.AssetClass.ERC20 ||
        makeAssetClass === __1.Types.AssetClass.ETH) &&
        (takeAssetClass === __1.Types.AssetClass.ERC721 ||
            takeAssetClass === __1.Types.AssetClass.ERC721_LAZY ||
            takeAssetClass === __1.Types.AssetClass.ERC1155 ||
            takeAssetClass === __1.Types.AssetClass.ERC1155_LAZY ||
            takeAssetClass === __1.Types.AssetClass.COLLECTION)) {
        return "buy";
    }
    else {
        throw new Error("Invalid asset class");
    }
};
exports.getOrderSide = getOrderSide;
//# sourceMappingURL=order-info.js.map