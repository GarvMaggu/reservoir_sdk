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
exports.Weth = void 0;
const erc20_1 = require("./erc20");
const Addresses = __importStar(require("../addresses"));
const utils_1 = require("../../utils");
class Weth extends erc20_1.Erc20 {
    constructor(provider, chainId) {
        super(provider, Addresses.Weth[chainId]);
    }
    async deposit(depositor, amount) {
        return this.contract.connect(depositor).deposit({ value: amount });
    }
    depositTransaction(depositor, amount) {
        const data = this.contract.interface.encodeFunctionData("deposit");
        return {
            from: depositor,
            to: this.contract.address,
            data,
            value: (0, utils_1.bn)(amount).toHexString(),
        };
    }
}
exports.Weth = Weth;
//# sourceMappingURL=weth.js.map