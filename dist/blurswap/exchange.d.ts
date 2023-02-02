import { Contract } from "@ethersproject/contracts";
import { TxData } from "../utils";
export declare class Exchange {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    fillOrderTx(taker: string, inputData: any, price: string, options?: {
        referrer?: string;
    }): TxData;
}
//# sourceMappingURL=exchange.d.ts.map