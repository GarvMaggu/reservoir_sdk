import { BigNumberish } from "@ethersproject/bignumber";
import { Order } from "../../order";
import { TakerOrderParams } from "../../types";
export interface BaseBuildParams {
    isOrderAsk: boolean;
    signer: string;
    collection: string;
    price: BigNumberish;
    nonce?: BigNumberish;
    startTime?: number;
    endTime?: number;
    minPercentageToAsk?: number;
    v?: number;
    r?: string;
    s?: string;
}
export declare abstract class BaseBuilder {
    chainId: number;
    constructor(chainId: number);
    protected defaultInitialize(params: BaseBuildParams): void;
    abstract isValid(order: Order): boolean;
    abstract build(params: BaseBuildParams): Order;
    abstract buildMatching(order: Order, taker: string, data: any): TakerOrderParams;
}
//# sourceMappingURL=index.d.ts.map