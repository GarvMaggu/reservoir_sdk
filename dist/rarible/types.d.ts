import { BigNumberish } from "ethers";
import { ORDER_DATA_TYPES, ORDER_TYPES } from "./constants";
export declare const EIP712_TYPES: {
    AssetType: {
        name: string;
        type: string;
    }[];
    Asset: {
        name: string;
        type: string;
    }[];
    Order: {
        name: string;
        type: string;
    }[];
};
export declare enum AssetClass {
    ERC20 = "ERC20",
    ETH = "ETH",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155",
    COLLECTION = "COLLECTION",
    ERC721_LAZY = "ERC721_LAZY",
    ERC1155_LAZY = "ERC1155_LAZY"
}
export declare enum OrderSide {
    BUY = 0,
    SELL = 1
}
export declare type AssetType = {
    assetClass: string;
    data: string;
};
export declare type Asset = {
    assetType: AssetType;
    value: string;
};
export declare type LocalAssetType = {
    assetClass: string;
    contract?: string;
    tokenId?: string;
    uri?: string;
    supply?: string;
    creators?: IPart[];
    royalties?: IPart[];
    signatures?: string[];
};
export declare type LocalAsset = {
    type?: any;
    assetType: LocalAssetType;
    value: string;
};
export declare type OrderKind = "single-token" | "contract-wide";
export declare type Order = {
    kind?: OrderKind;
    hash?: string;
    id?: string;
    type: ORDER_TYPES;
    maker: string;
    make: LocalAsset;
    taker: string;
    take: LocalAsset;
    salt: string;
    start: number;
    end: number;
    data: ILegacyOrderData | IV1OrderData | IV2OrderData | IV3OrderSellData | IV3OrderBuyData;
    signature?: string;
    side?: string;
    createdAt?: string;
    endedAt?: string;
};
export declare type Purchase = {
    sellOrderMaker: string;
    sellOrderNftAmount: string;
    nftAssetClass: string;
    nftData: string;
    sellOrderPaymentAmount: string;
    paymentToken: string;
    sellOrderSalt: string;
    sellOrderStart: number;
    sellOrderEnd: number;
    sellOrderDataType: string;
    sellOrderData: string;
    sellOrderSignature: string;
    buyOrderPaymentAmount: string;
    buyOrderNftAmount: number;
    buyOrderData: string;
};
export declare type AcceptBid = {
    bidMaker: string;
    bidNftAmount: string;
    nftAssetClass: string;
    nftData: string;
    bidPaymentAmount: string;
    paymentToken: string;
    bidSalt: string;
    bidStart: number;
    bidEnd: number;
    bidDataType: string;
    bidData: string;
    bidSignature: string;
    sellOrderPaymentAmount: string;
    sellOrderNftAmount: number;
    sellOrderData: string;
};
export interface IPart {
    account: string;
    value: string;
}
export interface ILegacyOrderData {
    "@type"?: string;
    dataType: ORDER_DATA_TYPES;
    fee: number;
}
export interface IV1OrderData {
    "@type"?: string;
    dataType: ORDER_DATA_TYPES;
    payouts: IPart[];
    originFees: IPart[];
}
export interface IV2OrderData {
    "@type"?: string;
    dataType: ORDER_DATA_TYPES;
    payouts: IPart[];
    originFees: IPart[];
}
export interface IV3OrderSellData {
    "@type"?: string;
    dataType: ORDER_DATA_TYPES;
    payouts: IPart;
    originFeeFirst: IPart;
    originFeeSecond: IPart;
    maxFeesBasePoint: number;
    marketplaceMarker: string;
}
export interface IV3OrderBuyData {
    "@type"?: string;
    dataType: ORDER_DATA_TYPES;
    payouts: IPart;
    originFeeFirst: IPart;
    originFeeSecond: IPart;
    marketplaceMarker: string;
}
export declare type TakerOrderParams = {
    type: string;
    maker: string;
    taker: string;
    make: LocalAsset;
    take: LocalAsset;
    salt: number;
    start: number;
    end: number;
    data: ILegacyOrderData | IV1OrderData | IV2OrderData | IV3OrderSellData | IV3OrderBuyData;
};
export interface BaseBuildParams {
    orderType: ORDER_TYPES;
    maker: string;
    side: "buy" | "sell";
    tokenKind: "erc721" | "erc1155" | "erc721_lazy" | "erc1155_lazy";
    contract: string;
    tokenAmount?: number;
    price: string;
    paymentToken: string;
    salt?: BigNumberish;
    startTime: number;
    endTime: number;
    dataType: ORDER_DATA_TYPES;
    uri?: string;
    supply?: string;
    creators?: IPart[];
    royalties?: IPart[];
    signatures?: string[];
    originFees?: IPart[];
    payouts?: IPart[];
    originFeeFirst?: IPart;
    originFeeSecond?: IPart;
    marketplaceMarker?: string;
    fee?: number;
    maxFeesBasePoint?: number;
}
//# sourceMappingURL=types.d.ts.map