import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder, BaseOrderInfo } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
    startTokenId: BigNumberish;
    endTokenId: BigNumberish;
}
interface OrderInfo extends BaseOrderInfo {
    startTokenId: BigNumberish;
    endTokenId: BigNumberish;
}
export declare class TokenRangeBuilder extends BaseBuilder {
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