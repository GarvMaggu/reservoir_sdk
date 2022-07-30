import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { TxData } from "../../utils";
export declare class Erc20 {
    contract: Contract;
    constructor(provider: Provider, address: string);
    transfer(from: Signer, to: string, amount: BigNumberish): Promise<TransactionResponse>;
    transferTransaction(from: string, to: string, amount: BigNumberish): TxData;
    approve(approver: Signer, spender: string, amount?: BigNumberish): Promise<TransactionResponse>;
    approveTransaction(approver: string, spender: string, amount?: BigNumberish): TxData;
    getBalance(owner: string): Promise<BigNumber>;
    getAllowance(owner: string, spender: string): Promise<BigNumber>;
}
//# sourceMappingURL=erc20.d.ts.map