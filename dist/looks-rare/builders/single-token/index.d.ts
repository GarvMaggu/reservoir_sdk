import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
    tokenId: BigNumberish;
}
export declare class SingleTokenBuilder extends BaseBuilder {
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Order, taker: string): {
        isOrderAsk: boolean;
        taker: string;
        price: string;
        tokenId: string;
        minPercentageToAsk: number;
        params: string;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map