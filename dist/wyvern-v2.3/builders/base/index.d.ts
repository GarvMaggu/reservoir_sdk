import { BigNumberish } from "@ethersproject/bignumber";
import { Order } from "../../order";
import { OrderSaleKind } from "../../types";
export interface BaseBuildParams {
    maker: string;
    side: "buy" | "sell";
    price: BigNumberish;
    paymentToken: string;
    fee: number;
    feeRecipient: string;
    nonce: BigNumberish;
    recipient?: string;
    listingTime?: number;
    expirationTime?: number;
    salt?: BigNumberish;
    extra?: BigNumberish;
    v?: number;
    r?: string;
    s?: string;
}
export interface BaseOrderInfo {
    contract: string;
}
export declare abstract class BaseBuilder {
    chainId: number;
    constructor(chainId: number);
    protected defaultInitialize(params: BaseBuildParams): OrderSaleKind;
    protected isDutchAuction(params: BaseBuildParams): boolean;
    protected validateDutchAuction(params: BaseBuildParams): void;
    abstract getInfo(order: Order): BaseOrderInfo | undefined;
    abstract isValid(order: Order): boolean;
    abstract build(params: BaseBuildParams): Order;
    abstract buildMatching(order: Order, taker: string, data: any): Order;
}
//# sourceMappingURL=index.d.ts.map