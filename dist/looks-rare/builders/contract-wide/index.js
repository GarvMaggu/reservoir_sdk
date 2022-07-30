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
exports.ContractWideBuilder = void 0;
const base_1 = require("../base");
const Addresses = __importStar(require("../../addresses"));
const order_1 = require("../../order");
const CommonAddresses = __importStar(require("../../../common/addresses"));
const utils_1 = require("../../../utils");
class ContractWideBuilder extends base_1.BaseBuilder {
    isValid(order) {
        try {
            const copyOrder = this.build({
                ...order.params,
            });
            if (!copyOrder) {
                return false;
            }
            if (copyOrder.hash() !== order.hash()) {
                return false;
            }
        }
        catch {
            return false;
        }
        return true;
    }
    build(params) {
        this.defaultInitialize(params);
        if (params.isOrderAsk) {
            throw new Error("Unsupported order side");
        }
        return new order_1.Order(this.chainId, {
            kind: "contract-wide",
            isOrderAsk: params.isOrderAsk,
            signer: params.signer,
            collection: params.collection,
            price: (0, utils_1.s)(params.price),
            tokenId: "0",
            amount: "1",
            strategy: Addresses.StrategyAnyItemFromCollectionForFixedPrice[this.chainId],
            currency: CommonAddresses.Weth[this.chainId],
            nonce: (0, utils_1.s)(params.nonce),
            startTime: params.startTime,
            endTime: params.endTime,
            minPercentageToAsk: params.minPercentageToAsk,
            params: utils_1.BytesEmpty,
            v: params.v,
            r: params.r,
            s: params.s,
        });
    }
    buildMatching(order, taker, data) {
        return {
            isOrderAsk: !order.params.isOrderAsk,
            taker,
            price: order.params.price,
            tokenId: (0, utils_1.s)(data.tokenId),
            minPercentageToAsk: 8500,
            params: utils_1.BytesEmpty,
        };
    }
}
exports.ContractWideBuilder = ContractWideBuilder;
//# sourceMappingURL=index.js.map