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
    fillOrder(taker: Signer, makerOrder: Order, takerOrderParams: Types.TakerOrderParams, options?: {
        referrer?: string;
    }): Promise<ContractTransaction>;
    /**
     * Calculate transaction value in case its a ETH order
     */
    calculateTxValue(takeClass: string, takeAmount: string): BigNumber;
    fillOrderTx(taker: string, makerOrder: Order, takerOrderParams: Types.TakerOrderParams, options?: {
        referrer?: string;
    }): Promise<TxData>;
    cancelOrder(maker: Signer, order: Order): Promise<ContractTransaction>;
    /**
     * Get the DAO fee from the marketplace contract
     * @returns uint DAO fee
     */
    getDaoFee(provider: Provider): Promise<BigNumberish>;
    /**
     * Get the fee receiver the marketplace contract (will always be the DAO unless voted otherwise)
     * @returns string DAO address
     */
    getFeeReceiver(provider: Provider): Promise<string>;
    /**
     * Get the fill amount of a specifc order
     * @returns uint256 order fill
     */
    getOrderFill(provider: Provider, order: Order): Promise<BigNumberish>;
}
//# sourceMappingURL=exchange.d.ts.map