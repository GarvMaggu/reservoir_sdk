import { Types } from "..";
import { IPart, LocalAssetType } from "../types";
export declare const encodeAssetData: (assetType: LocalAssetType) => string;
export declare const encodeAssetClass: (assetClass: string) => string;
export declare const encodeV2OrderData: (payments: IPart[] | undefined) => Types.IPart[];
export declare const encodeV3OrderData: (part: IPart) => string;
export declare const encodeOrderData: (order: Types.Order | Types.TakerOrderParams) => string;
export declare const hashAssetType: (assetType: LocalAssetType) => string;
/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
export declare const encodeForContract: (order: Types.Order, matchingOrder: Types.TakerOrderParams) => Types.Purchase | Types.AcceptBid;
/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
export declare const encodeForMatchOrders: (order: Types.Order | Types.TakerOrderParams) => {
    maker: string;
    makeAsset: {
        assetType: {
            assetClass: string;
            data: string;
        };
        value: string;
    };
    taker: string;
    takeAsset: {
        assetType: {
            assetClass: string;
            data: string;
        };
        value: string;
    };
    salt: string | number;
    start: number;
    end: number;
    dataType: string;
    data: string;
};
//# sourceMappingURL=order-encoder.d.ts.map