import { BaseBuilder, BaseOrderInfo } from "../base";
import { Order } from "../../order";
import * as Types from "../../types";
export declare class ContractWideBuilder extends BaseBuilder {
    getInfo(order: Order): BaseOrderInfo;
    isValid(order: Order): boolean;
    build(params: Types.BaseBuildParams): Order;
    buildMatching(order: Types.Order, taker: string, data: {
        tokenId: string;
        assetClass: "ERC721" | "ERC1155";
        amount?: string;
    }): {
        type: import("../../constants").ORDER_TYPES;
        maker: string;
        taker: string;
        make: {
            assetType: {
                assetClass: "ERC721" | "ERC1155";
                contract: string | undefined;
                tokenId: string;
            };
            value: string;
        };
        take: any;
        salt: number;
        start: number;
        end: number;
        data: any;
    };
}
//# sourceMappingURL=index.d.ts.map