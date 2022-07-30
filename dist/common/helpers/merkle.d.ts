import { BigNumberish } from "@ethersproject/bignumber";
import MerkleTree from "merkletreejs";
export declare const hashFn: (tokenId: BigNumberish) => string;
export declare const generateMerkleTree: (tokenIds: BigNumberish[]) => MerkleTree;
export declare const generateMerkleProof: (merkleTree: MerkleTree, tokenId: BigNumberish) => string[];
//# sourceMappingURL=merkle.d.ts.map