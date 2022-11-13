import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { BigNumberish } from "ethers";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import * as Types from "./types";
import { TxData } from "../utils";
import { BigNumber } from "ethers/lib";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    fillOrder(taker: Signer, makerOrder: Order, options: {
        assetClass?: "ERC721" | "ERC1155";
        tokenId?: string;
        referrer?: string;
        amount?: number;
    }): Promise<ContractTransaction>;
    /**
     * Calculate transaction value in case its a ETH order
     */
    calculateTxValue(takeClass: string, takeAmount: string): BigNumber;
    fillOrderTx(taker: string, makerOrder: Order, options: {
        tokenId?: string;
        assetClass?: string;
        referrer?: string;
        amount?: number;
    }): Promise<TxData>;
    cancelOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    cancelOrderTx(orderParams: Types.Order): Promise<TxData>;
    /**
     * Get the fill amount of a specifc order
     * @returns uint256 order fill
     */
    getOrderFill(provider: Provider, order: Order): Promise<BigNumberish>;
}
//# sourceMappingURL=exchange.d.ts.map