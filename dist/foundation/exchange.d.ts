import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    createOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    createOrderTx(order: Order): TxData;
    fillOrder(taker: Signer, order: Order, options?: {
        referrer?: string;
        nativeReferrerAddress?: string;
    }): Promise<ContractTransaction>;
    fillOrderTx(taker: string, order: Order, options?: {
        referrer?: string;
        nativeReferrerAddress?: string;
    }): TxData;
    cancelOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelOrderTx(order: Order): TxData;
}
//# sourceMappingURL=exchange.d.ts.map