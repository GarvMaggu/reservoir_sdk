import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
    tokenId: BigNumberish;
}
export declare class SingleTokenBuilder extends BaseBuilder {
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Order, data?: {
        amount?: BigNumberish;
        unwrapNativeToken?: boolean;
    }): {
        nftId: string;
        nftAmount: any;
        unwrapNativeToken: boolean | undefined;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map