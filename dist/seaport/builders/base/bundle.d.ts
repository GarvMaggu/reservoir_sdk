import { BigNumberish } from "@ethersproject/bignumber";
import { BundleOrder } from "../../bundle-order";
import * as Types from "../../types";
export interface BaseBundleBuildParams {
    offerer: string;
    offerItems: {
        tokenKind: "erc20" | "erc721" | "erc1155";
        contract: string;
        tokenId?: string;
        amount?: string;
    }[];
    considerationItems: {
        tokenKind: "erc20" | "erc721" | "erc1155";
        contract: string;
        tokenId?: string;
        amount?: string;
    }[];
    counter: BigNumberish;
    fees?: {
        recipient: string;
        amount: BigNumberish;
    }[];
    taker?: string;
    orderType?: number;
    zone?: string;
    zoneHash?: string;
    conduitKey?: string;
    salt?: BigNumberish;
    startTime?: number;
    endTime?: number;
    signature?: string;
}
export interface BaseBundleOrderInfo {
    taker: string;
    offerItems: {
        tokenKind: "erc20" | "erc721" | "erc1155";
        contract: string;
        tokenId?: string;
        amount?: string;
    }[];
    considerationItems: {
        tokenKind: "erc20" | "erc721" | "erc1155";
        contract: string;
        tokenId?: string;
        amount?: string;
    }[];
    fees?: {
        recipient: string;
        amount: BigNumberish;
    }[];
}
export declare abstract class BaseBundleBuilder {
    chainId: number;
    constructor(chainId: number);
    protected defaultInitialize(params: BaseBundleBuildParams): void;
    protected baseIsValid(order: BundleOrder): boolean;
    abstract getInfo(order: BundleOrder): BaseBundleOrderInfo | undefined;
    abstract isValid(order: BundleOrder): boolean;
    abstract build(params: BaseBundleBuildParams): BundleOrder;
    abstract buildMatching(order: BundleOrder, data: any): Types.MatchParams;
}
//# sourceMappingURL=bundle.d.ts.map