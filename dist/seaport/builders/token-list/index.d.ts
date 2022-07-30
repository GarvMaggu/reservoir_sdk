import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../base";
import { Order } from "../../order";
import * as Types from "../../types";
interface BuildParams extends BaseBuildParams {
    tokenIds: BigNumberish[];
    amount?: BigNumberish;
}
interface OrderInfo extends BaseOrderInfo {
    merkleRoot: string;
}
export declare class TokenListBuilder extends BaseBuilder {
    constructor(chainId: number);
    getInfo(order: Order): OrderInfo | undefined;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(_order: Order, data: {
        tokenId: string;
        tokenIds: string[];
        amount?: BigNumberish;
    }): {
        amount: any;
        criteriaResolvers: {
            orderIndex: number;
            side: Types.Side;
            index: number;
            identifier: string;
            criteriaProof: string[];
        }[];
    };
}
export {};
//# sourceMappingURL=index.d.ts.map