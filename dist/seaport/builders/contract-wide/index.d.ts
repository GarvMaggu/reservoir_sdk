import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../base";
import { Order } from "../../order";
import * as Types from "../../types";
interface BuildParams extends BaseBuildParams {
    amount?: BigNumberish;
}
export declare class ContractWideBuilder extends BaseBuilder {
    constructor(chainId: number);
    getInfo(order: Order): BaseOrderInfo | undefined;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(_order: Order, data: {
        tokenId: string;
        amount?: BigNumberish;
    }): {
        amount: any;
        criteriaResolvers: {
            orderIndex: number;
            side: Types.Side;
            index: number;
            identifier: string;
            criteriaProof: never[];
        }[];
    };
}
export {};
//# sourceMappingURL=index.d.ts.map