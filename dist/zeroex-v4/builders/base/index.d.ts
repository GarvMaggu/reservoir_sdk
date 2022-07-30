import { BigNumberish } from "@ethersproject/bignumber";
import { Order } from "../../order";
import { MatchParams } from "../../types";
export interface BaseBuildParams {
    direction: "sell" | "buy";
    contract: string;
    maker: string;
    price: BigNumberish;
    fees?: {
        recipient: string;
        amount: BigNumberish;
    }[];
    amount?: BigNumberish;
    expiry?: number;
    nonce?: BigNumberish;
    signatureType?: number;
    v?: number;
    r?: string;
    s?: string;
}
export interface BaseOrderInfo {
}
export declare abstract class BaseBuilder {
    chainId: number;
    constructor(chainId: number);
    protected defaultInitialize(params: BaseBuildParams): void;
    getInfo(_order: Order): BaseOrderInfo;
    abstract isValid(order: Order): boolean;
    abstract build(params: BaseBuildParams): Order;
    abstract buildMatching(order: Order, data: any): MatchParams;
}
//# sourceMappingURL=index.d.ts.map