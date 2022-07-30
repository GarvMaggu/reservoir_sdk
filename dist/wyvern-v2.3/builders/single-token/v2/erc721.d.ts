import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../../base";
import { Order } from "../../../order";
interface BuildParams extends BaseBuildParams {
    contract: string;
    tokenId: BigNumberish;
    useSafeTransfer?: boolean;
}
interface OrderInfo extends BaseOrderInfo {
    tokenId: BigNumberish;
    useSafeTransfer: boolean;
}
export declare class SingleTokenErc721BuilderV2 extends BaseBuilder {
    constructor(chainId: number);
    getInfo(order: Order): OrderInfo | undefined;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Order, taker: string, data: {
        nonce: string;
        recipient?: string;
    }): Order;
}
export {};
//# sourceMappingURL=erc721.d.ts.map