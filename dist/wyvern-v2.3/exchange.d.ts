import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "ethers";
import { ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    constructor(chainId: number);
    fillOrder(taker: Signer, buyOrder: Order, sellOrder: Order, options?: {
        referrer?: string;
    }): Promise<ContractTransaction>;
    fillOrderTx(taker: string, buyOrder: Order, sellOrder: Order, options?: {
        referrer?: string;
    }): TxData;
    cancelTransaction(maker: string, order: Order): TxData;
    cancel(maker: Signer, order: Order): Promise<ContractTransaction>;
    incrementNonce(user: Signer): Promise<ContractTransaction>;
    getNonce(provider: Provider, user: string): Promise<BigNumberish>;
}
//# sourceMappingURL=exchange.d.ts.map