import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Order } from "./order";
import { TxData } from "../utils";
export declare class Router {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    fillBuyOrder(taker: Signer, order: Order, tokenId: string, options?: {
        recipient?: string;
        referrer?: string;
    }): Promise<ContractTransaction>;
    fillBuyOrderTx(taker: string, order: Order, tokenId: string, options?: {
        recipient?: string;
        referrer?: string;
    }): TxData;
}
//# sourceMappingURL=router.d.ts.map