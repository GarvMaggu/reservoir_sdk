import { Types } from "..";
import { Asset, IPart, LocalAssetType } from "../types";
export declare const encodeAsset: (token?: string, tokenId?: string) => string;
export declare const encodeBundle: (tokenAddresses: string[], tokenIds: any) => string;
export declare const encodeAssetData: (assetType: LocalAssetType) => string;
export declare const encodeAssetClass: (assetClass: string) => string;
export declare const encodeOrderData: (payments: IPart[]) => string;
export declare const hashAssetType: (assetType: LocalAssetType) => string;
export declare const hashAsset: (asset: Asset) => string;
/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
export declare const encode: (order: Types.TakerOrderParams | Types.Order) => {
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