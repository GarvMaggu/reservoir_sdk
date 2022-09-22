import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    createOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    createOrderTx(maker: string, order: Order): TxData;
    fillOrder(taker: Signer, order: Order, options?: {
        finder?: string;
    }): Promise<ContractTransaction>;
    fillOrderTx(taker: string, order: Order, options?: {
        finder?: string;
    }): TxData;
    cancelOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelOrderTx(maker: string, order: Order): TxData;
}
//# sourceMappingURL=exchange.d.ts.map