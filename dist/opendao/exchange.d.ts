import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import * as Types from "./types";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    fillOrder(taker: Signer, order: Order, matchParams: Types.MatchParams, options?: {
        noDirectTransfer?: boolean;
        referrer?: string;
    }): Promise<ContractTransaction>;
    fillOrderTx(taker: string, order: Order, matchParams: Types.MatchParams, options?: {
        noDirectTransfer?: boolean;
        referrer?: string;
    }): TxData;
    batchBuy(taker: Signer, orders: Order[], matchParams: Types.MatchParams[], options?: {
        referrer?: string;
    }): Promise<ContractTransaction>;
    batchBuyTx(taker: string, orders: Order[], matchParams: Types.MatchParams[], options?: {
        referrer?: string;
    }): TxData;
    cancelOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelOrderTx(maker: string, order: Order): TxData;
}
//# sourceMappingURL=exchange.d.ts.map