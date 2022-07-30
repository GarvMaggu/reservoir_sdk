import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import { Order } from "./order";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    apiKey: string;
    constructor(chainId: number, apiKey: string);
    fillOrder(taker: Signer, order: Order, options?: {
        referrer?: string;
    }): Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
    fillOrderTx(taker: string, order: Order, options?: {
        referrer?: string;
    }): Promise<TxData>;
    cancelOrder(maker: Signer, order: Order): Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
    cancelOrderTx(maker: Signer, order: Order): Promise<TxData>;
}
//# sourceMappingURL=exchange.d.ts.map