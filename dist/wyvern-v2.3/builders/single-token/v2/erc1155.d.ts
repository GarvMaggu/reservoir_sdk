import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../../base";
import { Order } from "../../../order";
interface BuildParams extends BaseBuildParams {
    contract: string;
    tokenId: BigNumberish;
}
interface OrderInfo extends BaseOrderInfo {
    tokenId: BigNumberish;
}
export declare class SingleTokenErc1155BuilderV2 extends BaseBuilder {
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
//# sourceMappingURL=erc1155.d.ts.map