"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erc1155 = void 0;
const contracts_1 = require("@ethersproject/contracts");
const Erc1155_json_1 = __importDefault(require("../abis/Erc1155.json"));
class Erc1155 {
    constructor(provider, address) {
        this.contract = new contracts_1.Contract(address, Erc1155_json_1.default, provider);
    }
    async isValid() {
        return this.contract.supportsInterface("0xd9b67a26");
    }
    async approve(approver, operator) {
        return this.contract.connect(approver).setApprovalForAll(operator, true);
    }
    approveTransaction(approver, operator) {
        const data = this.contract.interface.encodeFunctionData("setApprovalForAll", [operator, true]);
        return {
            from: approver,
            to: this.contract.address,
            data,
        };
    }
    async getBalance(owner, tokenId) {
        return this.contract.balanceOf(owner, tokenId);
    }
    async isApproved(owner, operator) {
        return this.contract.isApprovedForAll(owner, operator);
    }
}
exports.Erc1155 = Erc1155;
//# sourceMappingURL=erc1155.js.map