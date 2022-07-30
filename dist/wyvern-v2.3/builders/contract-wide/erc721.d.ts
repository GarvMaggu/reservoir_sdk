import { BaseBuilder, BaseBuildParams, BaseOrderInfo } from "../base";
import { Order } from "../../order";
interface BuildParams extends BaseBuildParams {
    contract: string;
}
interface OrderInfo extends BaseOrderInfo {
}
export declare class ContractWideErc721Builder extends BaseBuilder {
    constructor(chainId: number);
    getInfo(order: Order): OrderInfo;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Order, taker: string, data: {
        tokenId: string;
        nonce: string;
    }): Order;
}
export {};
//# sourceMappingURL=erc721.d.ts.map