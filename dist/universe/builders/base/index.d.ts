import { Order } from "../../order";
import * as Types from "../../types";
export interface BaseOrderInfo {
    side: "buy" | "sell";
}
export declare abstract class BaseBuilder {
    chainId: number;
    constructor(chainId: number);
    protected defaultInitialize(params: Types.BaseBuildParams): void;
    abstract getInfo(order: Order): BaseOrderInfo | undefined;
    abstract isValid(order: Order): boolean;
    abstract build(params: Types.BaseBuildParams): Order;
    abstract buildMatching(order: Types.Order, taker: string, data: any): Types.TakerOrderParams;
}
//# sourceMappingURL=index.d.ts.map