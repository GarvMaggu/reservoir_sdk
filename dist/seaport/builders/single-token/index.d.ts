import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder, BaseOrderInfo } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
    tokenId: BigNumberish;
    amount?: BigNumberish;
}
export declare class SingleTokenBuilder extends BaseBuilder {
    getInfo(order: Order): BaseOrderInfo | undefined;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(_order: Order, data?: {
        amount?: BigNumberish;
    }): {
        amount: any;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map