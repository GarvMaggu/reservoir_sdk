import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { TxData } from "../../utils";
export declare class Erc1155 {
    contract: Contract;
    constructor(provider: Provider, address: string);
    isValid(): Promise<boolean>;
    approve(approver: Signer, operator: string): Promise<TransactionResponse>;
    approveTransaction(approver: string, operator: string): TxData;
    getBalance(owner: string, tokenId: BigNumberish): Promise<BigNumber>;
    isApproved(owner: string, operator: string): Promise<boolean>;
}
//# sourceMappingURL=erc1155.d.ts.map