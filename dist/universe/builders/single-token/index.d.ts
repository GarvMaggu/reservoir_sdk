import { BaseBuilder, BaseOrderInfo } from "../base";
import { Order } from "../../order";
import * as Types from "../../types";
export declare class SingleTokenBuilder extends BaseBuilder {
    getInfo(order: Order): BaseOrderInfo;
    isValid(order: Order): boolean;
    build(params: Types.BaseBuildParams): Order;
    buildMatching(order: Types.Order, taker: string, data: {
        amount?: string;
    }): {
        type: string;
        maker: string;
        taker: string;
        make: any;
        take: any;
        salt: number;
        start: number;
        end: number;
        data: {
            dataType: string;
            revenueSplits: Types.IPart[];
        };
    };
}
//# sourceMappingURL=index.d.ts.map