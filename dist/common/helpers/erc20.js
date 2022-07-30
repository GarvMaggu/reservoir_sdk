"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erc20 = void 0;
const contracts_1 = require("@ethersproject/contracts");
const utils_1 = require("../../utils");
const Erc20_json_1 = __importDefault(require("../abis/Erc20.json"));
class Erc20 {
    constructor(provider, address) {
        this.contract = new contracts_1.Contract(address, Erc20_json_1.default, provider);
    }
    async transfer(from, to, amount) {
        return this.contract.connect(from).transfer(to, amount);
    }
    transferTransaction(from, to, amount) {
        const data = this.contract.interface.encodeFunctionData("transfer", [
            to,
            amount,
        ]);
        return {
            from,
            to: this.contract.address,
            data,
        };
    }
    async approve(approver, spender, amount = utils_1.MaxUint256) {
        return this.contract.connect(approver).approve(spender, amount);
    }
    approveTransaction(approver, spender, amount = utils_1.MaxUint256) {
        const data = this.contract.interface.encodeFunctionData("approve", [
            spender,
            amount,
        ]);
        return {
            from: approver,
            to: this.contract.address,
            data,
        };
    }
    async getBalance(owner) {
        return this.contract.balanceOf(owner);
    }
    async getAllowance(owner, spender) {
        return this.contract.allowance(owner, spender);
    }
}
exports.Erc20 = Erc20;
//# sourceMappingURL=erc20.js.map