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
exports.buildOrder = void 0;
const abi_1 = require("@ethersproject/abi");
const constants_1 = require("@ethersproject/constants");
const Types = __importStar(require("../types"));
const utils_1 = require("../../utils");
const buildOrder = (params) => {
    var _a, _b;
    if (params.side !== "buy") {
        throw new Error("Unsupported side");
    }
    return {
        salt: (_b = (_a = params.salt) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : (0, utils_1.getRandomBytes)(32).toHexString(),
        user: params.user,
        network: params.network,
        intent: Types.Intent.BUY,
        // At the moment, X2Y2 only supports ERC721 tokens
        delegateType: Types.DelegationType.ERC721,
        deadline: params.deadline,
        currency: params.currency,
        dataMask: abi_1.defaultAbiCoder.encode(["(address token, uint256 tokenId)[]"], [
            [
                {
                    token: constants_1.AddressZero,
                    tokenId: "0x" + "1".repeat(64),
                },
            ],
        ]),
        items: [
            {
                price: params.price.toString(),
                data: abi_1.defaultAbiCoder.encode(["(address token, uint256 tokenId)[]"], [
                    [
                        {
                            token: params.contract,
                            tokenId: 0,
                        },
                    ],
                ]),
            },
        ],
        signVersion: 1,
    };
};
exports.buildOrder = buildOrder;
//# sourceMappingURL=collection-wide.js.map