import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
    contract: string;
    tokenIds: BigNumberish[];
}
interface OrderInfo extends BaseOrderInfo {
    merkleRoot: string;
}
export declare class TokenListErc1155Builder extends BaseBuilder {
    constructor(chainId: number);
    getInfo(order: Order): OrderInfo | undefined;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Order, taker: string, data: {
        tokenId: string;
        tokenIds: string[];
        nonce: string;
    }): Order;
}
export {};
//# sourceMappingURL=erc1155.d.ts.map