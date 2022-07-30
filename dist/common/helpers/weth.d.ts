import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { Erc20 } from "./erc20";
import { TxData } from "../../utils";
export declare class Weth extends Erc20 {
    constructor(provider: Provider, chainId: number);
    deposit(depositor: Signer, amount: BigNumberish): Promise<TransactionResponse>;
    depositTransaction(depositor: string, amount: BigNumberish): TxData;
}
//# sourceMappingURL=weth.d.ts.map