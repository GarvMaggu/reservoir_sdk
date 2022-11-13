import { BaseBuilder, BaseOrderInfo } from "../base";
import { Order } from "../../order";
import * as Types from "../../types";
interface BuildParams extends Types.BaseBuildParams {
    tokenId: string;
}
export declare class SingleTokenBuilder extends BaseBuilder {
    getInfo(order: Order): BaseOrderInfo;
    isValid(order: Order): boolean;
    build(params: BuildParams): Order;
    buildMatching(order: Types.Order, taker: string, data: {
        amount?: string;
    }): {
        type: import("../../constants").ORDER_TYPES;
        maker: string;
        taker: string;
        make: any;
        take: any;
        salt: number;
        start: number;
        end: number;
        data: any;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map