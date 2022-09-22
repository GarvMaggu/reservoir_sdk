import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBundleBuilder, BaseBundleBuildParams, BaseBundleOrderInfo } from "../base/bundle";
import { BundleOrder } from "../../bundle-order";
export interface BundleAskOrderInfo extends BaseBundleOrderInfo {
    paymentToken: string;
    price: string;
    fees: {
        recipient: string;
        amount: BigNumberish;
    }[];
}
export declare class BundleAskBuilder extends BaseBundleBuilder {
    constructor(chainId: number);
    getInfo(order: BundleOrder): BundleAskOrderInfo;
    isValid(order: BundleOrder): boolean;
    build(params: BaseBundleBuildParams): BundleOrder;
    buildMatching(_order: BundleOrder, _data: any): {};
}
//# sourceMappingURL=bundle-ask.d.ts.map