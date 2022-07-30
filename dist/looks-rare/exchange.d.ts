import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "ethers";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import * as Types from "./types";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    fillOrder(taker: Signer, makerOrder: Order, takerOrderParams: Types.TakerOrderParams, options?: {
        referrer?: string;
    }): Promise<ContractTransaction>;
    fillOrderTx(taker: string, makerOrder: Order, takerOrderParams: Types.TakerOrderParams, options?: {
        referrer?: string;
    }): TxData;
    cancelOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelOrderTx(maker: string, order: Order): TxData;
    getNonce(provider: Provider, user: string): Promise<BigNumberish>;
}
//# sourceMappingURL=exchange.d.ts.map