import { Provider } from "@ethersproject/abstract-provider";
import { Contract } from "@ethersproject/contracts";
import { BidDetails, ListingDetails } from "./types";
import { TxData } from "../utils";
export declare class Router {
    chainId: number;
    contract: Contract;
    provider: Provider;
    constructor(chainId: number, provider: Provider);
    fillListingsTx(details: ListingDetails[], taker: string, options?: {
        referrer?: string;
        fee?: {
            recipient: string;
            bps: number | string;
        };
        skipPrecheck?: boolean;
        forceRouter?: boolean;
        partial?: boolean;
        directFillingData?: any;
    }): Promise<TxData>;
    fillBidTx(detail: BidDetails, taker: string, options?: {
        referrer?: string;
    }): Promise<{
        from: string;
        to: string;
        data: string;
    }>;
    private generateNativeListingFillTx;
    private generateNativeBidFillTx;
}
//# sourceMappingURL=router.d.ts.map