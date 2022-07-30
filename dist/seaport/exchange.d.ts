import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { BundleOrder } from "./bundle-order";
import { Order } from "./order";
import * as Types from "./types";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    fillOrder(taker: Signer, order: Order | BundleOrder, matchParams: Types.MatchParams, options?: {
        recipient?: string;
        conduitKey?: string;
        feesOnTop?: {
            amount: string;
            recipient: BigNumberish;
        }[];
        referrer?: string;
    }): Promise<TransactionResponse>;
    fillOrderTx(taker: string, order: Order | BundleOrder, matchParams: Types.MatchParams, options?: {
        recipient?: string;
        conduitKey?: string;
        feesOnTop?: {
            amount: string;
            recipient: BigNumberish;
        }[];
        referrer?: string;
    }): TxData;
    fillOrders(taker: Signer, orders: Order[], matchParams: Types.MatchParams[], options?: {
        recipient?: string;
        conduitKey?: string;
        referrer?: string;
        maxOrdersToFulfill?: number;
    }): Promise<TransactionResponse>;
    fillOrdersTx(taker: string, orders: Order[], matchParams: Types.MatchParams[], options?: {
        recipient?: string;
        conduitKey?: string;
        referrer?: string;
        maxOrdersToFulfill?: number;
    }): TxData;
    cancelOrder(maker: Signer, order: Order): Promise<TransactionResponse>;
    cancelOrderTx(maker: string, order: Order): TxData;
    getCounter(provider: Provider, user: string): Promise<BigNumberish>;
    deriveConduit(conduitKey: string): string;
    deriveBasicSale(spentItems: Types.SpentItem[], receivedItems: Types.ReceivedItem[]): {
        recipientOverride: string | undefined;
        contract: string;
        tokenId: string;
        amount: string;
        paymentToken: string;
        price: string;
    } | undefined;
}
//# sourceMappingURL=exchange.d.ts.map