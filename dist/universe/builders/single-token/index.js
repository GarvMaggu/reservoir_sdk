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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTokenBuilder = void 0;
const base_1 = require("../base");
const order_1 = require("../../order");
const Types = __importStar(require("../../types"));
const utils_1 = require("../../../utils");
const ethers_1 = require("ethers/lib/ethers");
const types_1 = require("../../types");
const __1 = require("../..");
class SingleTokenBuilder extends base_1.BaseBuilder {
    getInfo(order) {
        let side;
        const makeAssetClass = order.params.make.assetType.assetClass;
        const takeAssetClass = order.params.make.assetType.assetClass;
        if ((makeAssetClass === Types.AssetClass.ERC721 ||
            makeAssetClass === Types.AssetClass.ERC1155) &&
            (takeAssetClass === Types.AssetClass.ERC20 ||
                takeAssetClass === Types.AssetClass.ETH)) {
            side = "sell";
        }
        else if (makeAssetClass === Types.AssetClass.ERC20 &&
            (takeAssetClass === Types.AssetClass.ERC721 ||
                takeAssetClass === Types.AssetClass.ERC1155)) {
            side = "buy";
        }
        else {
            throw new Error("Invalid asset class");
        }
        return {
            side,
        };
    }
    isValid(order) {
        //TODO: Add more validations (used by indexer)
        const { side } = this.getInfo(order);
        try {
            const nftInfo = side === "buy" ? order.params.take : order.params.make;
            const paymentInfo = side === "buy" ? order.params.make : order.params.take;
            const copyOrder = this.build({
                maker: order.params.maker,
                side,
                tokenKind: nftInfo.assetType.assetClass === types_1.AssetClass.ERC721
                    ? "erc721"
                    : "erc1155",
                contract: (0, utils_1.lc)(nftInfo.assetType.contract),
                tokenId: nftInfo.assetType.tokenId,
                price: paymentInfo.value,
                paymentToken: paymentInfo.assetType.assetClass === types_1.AssetClass.ETH
                    ? ethers_1.constants.AddressZero
                    : (0, utils_1.lc)(paymentInfo.assetType.contract),
                salt: (0, utils_1.n)(order.params.salt),
                startTime: order.params.start,
                endTime: order.params.end,
                signature: order.params.signature,
                tokenAmount: (0, utils_1.n)(nftInfo.value),
                fees: order.params.data.revenueSplits || [],
            });
            if (!copyOrder) {
                return false;
            }
            if (copyOrder.hashOrderKey() !== order.hashOrderKey()) {
                return false;
            }
        }
        catch {
            return false;
        }
        return true;
    }
    build(params) {
        var _a;
        this.defaultInitialize(params);
        const nftInfo = {
            assetType: {
                assetClass: params.tokenKind.toUpperCase(),
                contract: (0, utils_1.lc)(params.contract),
                tokenId: params.tokenId,
            },
            value: (0, utils_1.s)(params.tokenAmount || 1),
        };
        const paymentInfo = {
            assetType: {
                ...(params.paymentToken && params.paymentToken !== ethers_1.constants.AddressZero
                    ? {
                        assetClass: types_1.AssetClass.ERC20,
                        contract: (0, utils_1.lc)(params.paymentToken),
                    }
                    : {
                        assetClass: types_1.AssetClass.ETH,
                    }),
            },
            value: params.price,
        };
        return new order_1.Order(this.chainId, {
            kind: "single-token",
            type: __1.Constants.UNIVERSE_TYPE,
            maker: params.maker,
            make: params.side === "buy" ? paymentInfo : nftInfo,
            taker: ethers_1.constants.AddressZero,
            take: params.side === "buy" ? nftInfo : paymentInfo,
            salt: (0, utils_1.s)(params.salt),
            start: params.startTime,
            end: params.endTime,
            data: {
                dataType: ((_a = params.fees) === null || _a === void 0 ? void 0 : _a.length)
                    ? __1.Constants.ORDER_DATA
                    : __1.Constants.DATA_TYPE_0X,
                revenueSplits: params.fees || [],
            },
            signature: params === null || params === void 0 ? void 0 : params.signature,
        });
    }
    buildMatching(order, taker, data) {
        var _a;
        const rightOrder = {
            type: order.type,
            maker: taker,
            taker: ethers_1.constants.AddressZero,
            make: JSON.parse(JSON.stringify(order.take)),
            take: JSON.parse(JSON.stringify(order.make)),
            salt: 0,
            start: order.start,
            end: order.end,
            data: {
                dataType: ((_a = order.data.revenueSplits) === null || _a === void 0 ? void 0 : _a.length)
                    ? __1.Constants.ORDER_DATA
                    : __1.Constants.DATA_TYPE_0X,
                revenueSplits: order.data.revenueSplits || [],
            },
        };
        // for erc1155 we need to take the value from request (the amount parameter)
        if (types_1.AssetClass.ERC1155 == order.make.assetType.assetClass) {
            rightOrder.take.value = Math.floor(Number(data.amount)).toString();
        }
        if (types_1.AssetClass.ERC1155 == order.take.assetType.assetClass) {
            const oldValue = rightOrder.make.value;
            rightOrder.make.value = Math.floor(Number(data.amount)).toString();
            rightOrder.take.value = ethers_1.BigNumber.from(rightOrder.take.value).div(oldValue - rightOrder.make.value || "1");
        }
        return rightOrder;
    }
}
exports.SingleTokenBuilder = SingleTokenBuilder;
//# sourceMappingURL=index.js.map