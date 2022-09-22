import * as Types from "./types";
export declare class Order {
    chainId: number;
    params: Types.Order;
    constructor(chainId: number, params: Types.Order);
    static fromLocalOrder(chainId: number, localOrder: Types.LocalOrder): Order;
}
//# sourceMappingURL=order.d.ts.map