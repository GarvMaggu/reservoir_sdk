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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBuilder = void 0;
const constants_1 = require("@ethersproject/constants");
const Types = __importStar(require("../../types"));
const utils_1 = require("../../../utils");
class BaseBuilder {
    constructor(chainId) {
        this.chainId = chainId;
    }
    defaultInitialize(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Default listing time is 5 minutes in the past to allow for any
        // time discrepancies when checking the order's validity on-chain
        params.startTime = (_a = params.startTime) !== null && _a !== void 0 ? _a : (0, utils_1.getCurrentTimestamp)(-5 * 60);
        params.endTime = (_b = params.endTime) !== null && _b !== void 0 ? _b : 0;
        params.conduitKey = (_c = params.conduitKey) !== null && _c !== void 0 ? _c : constants_1.HashZero;
        params.zone = (_d = params.zone) !== null && _d !== void 0 ? _d : constants_1.AddressZero;
        params.zoneHash = (_e = params.zoneHash) !== null && _e !== void 0 ? _e : constants_1.HashZero;
        params.salt = (_f = params.salt) !== null && _f !== void 0 ? _f : (0, utils_1.getRandomBytes)();
        params.signature = (_g = params.signature) !== null && _g !== void 0 ? _g : constants_1.HashZero;
    }
    getBaseInfo(order) {
        // Offer should always consists of a single item
        if (order.params.offer.length !== 1) {
            throw new Error("Invalid offer");
        }
        // Must have at least one consideration
        if (order.params.consideration.length < 1) {
            throw new Error("Invalid consideration");
        }
        const offerItem = order.params.offer[0];
        let side;
        if (offerItem.itemType === Types.ItemType.ERC721 ||
            offerItem.itemType === Types.ItemType.ERC1155) {
            side = "sell";
        }
        else if (offerItem.itemType === Types.ItemType.ERC20) {
            side = "buy";
        }
        else {
            throw new Error("Invalid item");
        }
        // A dynamic order has at least one item with different start/end amounts
        const isDynamic = order.params.consideration.some((c) => c.startAmount !== c.endAmount) ||
            order.params.offer.some((c) => c.startAmount !== c.endAmount);
        return { side, isDynamic };
    }
    baseIsValid(order) {
        for (let i = 0; i < order.params.offer.length; i++) {
            if (order.params.offer[i].startAmount == "0" ||
                order.params.offer[i].endAmount == "0") {
                return false;
            }
        }
        for (let i = 0; i < order.params.consideration.length; i++) {
            if (order.params.consideration[i].startAmount == "0" ||
                order.params.consideration[i].endAmount == "0") {
                return false;
            }
        }
        return true;
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=index.js.map