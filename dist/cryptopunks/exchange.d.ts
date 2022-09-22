import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    createListing(maker: Signer, order: Order): Promise<ContractTransaction>;
    createListingTx(order: Order): TxData;
    cancelListing(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelListingTx(order: Order): TxData;
    fillListing(taker: Signer, order: Order, options?: {
        referrer?: string;
    }): Promise<ContractTransaction>;
    fillListingTx(taker: string, order: Order, options?: {
        referrer?: string;
    }): TxData;
    createBid(maker: Signer, order: Order): Promise<ContractTransaction>;
    createBidTx(order: Order): TxData;
    cancelBid(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelBidTx(order: Order): TxData;
    fillBid(taker: Signer, order: Order, options?: {
        referrer?: string;
    }): Promise<ContractTransaction>;
    fillBidTx(taker: string, order: Order, options?: {
        referrer?: string;
    }): TxData;
}
//# sourceMappingURL=exchange.d.ts.map