import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
}
export declare class ContractWideBuilder extends BaseBuilder {
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Order, taker: string, data: {
        tokenId: BigNumberish;
    }): {
        isOrderAsk: boolean;
        taker: string;
        price: string;
        tokenId: any;
        minPercentageToAsk: number;
        params: string;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map