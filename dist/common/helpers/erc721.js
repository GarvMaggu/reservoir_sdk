"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erc721 = void 0;
const contracts_1 = require("@ethersproject/contracts");
const Erc721_json_1 = __importDefault(require("../abis/Erc721.json"));
class Erc721 {
    constructor(provider, address) {
        this.contract = new contracts_1.Contract(address, Erc721_json_1.default, provider);
    }
    async isValid() {
        return this.contract.supportsInterface("0x80ac58cd");
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
    async getOwner(tokenId) {
        return this.contract.ownerOf(tokenId);
    }
    async isApproved(owner, operator) {
        return this.contract.isApprovedForAll(owner, operator);
    }
}
exports.Erc721 = Erc721;
//# sourceMappingURL=erc721.js.map