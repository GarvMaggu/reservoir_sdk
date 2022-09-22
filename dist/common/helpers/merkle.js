"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMerkleProof = exports.generateMerkleTree = exports.hashFn = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const utils_1 = require("ethers/lib/utils");
const merkletreejs_1 = __importDefault(require("merkletreejs"));
const hashFn = (tokenId) => (0, utils_1.keccak256)(Buffer.from(bignumber_1.BigNumber.from(tokenId).toHexString().slice(2).padStart(64, "0"), "hex"));
exports.hashFn = hashFn;
const generateMerkleTree = (tokenIds) => {
    if (!tokenIds.length) {
        throw new Error("Could not generate merkle tree");
    }
    const leaves = tokenIds.map(exports.hashFn);
    return new merkletreejs_1.default(leaves, utils_1.keccak256, { sort: true });
};
exports.generateMerkleTree = generateMerkleTree;
const generateMerkleProof = (merkleTree, tokenId) => merkleTree.getHexProof((0, exports.hashFn)(tokenId));
exports.generateMerkleProof = generateMerkleProof;
//# sourceMappingURL=merkle.js.map