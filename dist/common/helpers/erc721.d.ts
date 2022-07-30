import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { TxData } from "../../utils";
export declare class Erc721 {
    contract: Contract;
    constructor(provider: Provider, address: string);
    isValid(): Promise<boolean>;
    approve(approver: Signer, operator: string): Promise<TransactionResponse>;
    approveTransaction(approver: string, operator: string): TxData;
    getOwner(tokenId: BigNumberish): Promise<string>;
    isApproved(owner: string, operator: string): Promise<boolean>;
}
//# sourceMappingURL=erc721.d.ts.map