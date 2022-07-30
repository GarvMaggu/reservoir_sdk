import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder, BaseOrderInfo } from "../../base";
import { Order } from "../../../order";
interface BuildParams extends BaseBuildParams {
    tokenIds: BigNumberish[];
}
interface OrderInfo extends BaseOrderInfo {
    tokenIds: BigNumberish[];
}
export declare class BitVectorTokenListBuilder extends BaseBuilder {
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(_order: Order, data: {
        tokenId: BigNumberish;
        amount?: BigNumberish;
        unwrapNativeToken?: boolean;
    }): {
        nftId: any;
        nftAmount: any;
        unwrapNativeToken: boolean | undefined;
    };
    getInfo(order: Order): OrderInfo;
}
export {};
//# sourceMappingURL=index.d.ts.map