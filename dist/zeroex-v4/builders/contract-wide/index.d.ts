import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams, BaseBuilder } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
}
export declare class ContractWideBuilder extends BaseBuilder {
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
}
export {};
//# sourceMappingURL=index.d.ts.map