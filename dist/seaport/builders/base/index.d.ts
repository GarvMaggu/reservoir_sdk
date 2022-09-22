import { BigNumberish } from "@ethersproject/bignumber";
import { Order } from "../../order";
import * as Types from "../../types";
export interface BaseBuildParams {
    offerer: string;
    side: "buy" | "sell";
    tokenKind: "erc721" | "erc1155";
    contract: string;
    price: BigNumberish;
    endPrice?: BigNumberish;
    paymentToken: string;
    fees?: {
        recipient: string;
        amount: BigNumberish;
        endAmount?: BigNumberish;
    }[];
    counter: BigNumberish;
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
export interface BaseOrderInfo {
    tokenKind: "erc721" | "erc1155";
    side: "sell" | "buy";
    contract: string;
    tokenId?: string;
    merkleRoot?: string;
    taker: string;
    amount: string;
    paymentToken: string;
    price: string;
    endPrice?: string;
    fees: {
        recipient: string;
        amount: BigNumberish;
        endAmount?: BigNumberish;
    }[];
    isDynamic?: boolean;
}
export declare abstract class BaseBuilder {
    chainId: number;
    constructor(chainId: number);
    protected defaultInitialize(params: BaseBuildParams): void;
    protected getBaseInfo(order: Order): {
        side: "sell" | "buy";
        isDynamic: boolean;
    };
    protected baseIsValid(order: Order): boolean;
    abstract getInfo(order: Order): BaseOrderInfo | undefined;
    abstract isValid(order: Order): boolean;
    abstract build(params: BaseBuildParams): Order;
    abstract buildMatching(order: Order, data: any): Types.MatchParams;
}
//# sourceMappingURL=index.d.ts.map