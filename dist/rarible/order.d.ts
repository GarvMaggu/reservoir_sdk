import { Provider } from "@ethersproject/abstract-provider";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { BaseOrderInfo } from "./builders/base";
import * as Types from "./types";
export declare class Order {
    chainId: number;
    params: Types.Order;
    constructor(chainId: number, params: Types.Order);
    hashOrderKey(): string;
    private EIP712_DOMAIN;
    sign(signer: TypedDataSigner): Promise<void>;
    getSignatureData(): {
        signatureKind: string;
        domain: {
            name: string;
            version: string;
            chainId: number;
            verifyingContract: string;
        };
        types: {
            AssetType: {
                name: string;
                type: string;
            }[];
            Asset: {
                name: string;
                type: string;
            }[];
            Order: {
                name: string;
                type: string;
            }[];
        };
        value: any;
    };
    checkSignature(): void;
    checkValidity(): void;
    getInfo(): BaseOrderInfo | undefined;
    checkFillability(provider: Provider): Promise<void>;
    /**
     * This method verifies "allowance" of the walletAddress on a ERC1155 contract by calling
     * isApprovedForAll() and balanceOf() methods on the contract contractAddress to see if the
     * Marketplace contract is allowed to make transfers of tokenId on this contract and
     * that the walletAddress actually owns at least the amount of tokenId on this contract.
     * @param walletAddress
     * @param contractAddress
     * @param tokenId
     * @param amount
     * @returns {Promise<boolean>}
     */
    private verifyAllowanceERC1155;
    /**
     * This method verifies "allowance" of the walletAddress on a ERC20 contract by calling
     * allowance() and balanceOf() methods on the contract contractAddress to see if the
     * Marketplace contract is allowed to make transfers of tokens on this contract and
     * that the walletAddress actually owns at least the amount of tokens on this contract.
     * @param provider
     * @returns {Promise<boolean>}
     */
    private verifyAllowanceERC20;
    /**
     * This method verifies "allowance" of the walletAddress on the ERC721 contract
     * by calling isApprovedForAll(), getApproved() and ownerOf() on the contract to verify that
     * the Marketplace contract is approved to make transfers and the walletAddress actually owns
     * the token.
     * @returns {Promise<boolean>}
     */
    private verifyAllowanceERC721;
    buildMatching(taker: string, data?: any): Types.TakerOrderParams;
    private getBuilder;
    private detectKind;
}
//# sourceMappingURL=order.d.ts.map