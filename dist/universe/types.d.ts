export declare enum AssetClass {
    ERC20 = "ERC20",
    ETH = "ETH",
    ERC721 = "ERC721",
    ERC1155 = "ERC1155"
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
};
export declare type LocalAsset = {
    assetType: LocalAssetType;
    value: string;
};
export declare type OrderKind = "single-token";
export declare type Order = {
    kind?: OrderKind;
    type: string;
    maker: string;
    make: LocalAsset;
    taker: string;
    take: LocalAsset;
    salt: string;
    start: number;
    end: number;
    data: IOrderData;
    signature?: string;
};
export interface IPart {
    account: string;
    value: string;
}
export interface IOrderData {
    dataType?: string;
    revenueSplits?: IPart[];
}
export declare type TakerOrderParams = {
    type: string;
    maker: string;
    taker: string;
    make: Asset;
    take: Asset;
    salt: number;
    start: number;
    end: number;
    data: IOrderData;
};
export interface BaseBuildParams {
    maker: string;
    side: "buy" | "sell";
    tokenKind: "erc721" | "erc1155";
    contract: string;
    tokenId: string;
    tokenAmount?: number;
    price: string;
    paymentToken: string;
    fees?: {
        account: string;
        value: string;
    }[];
    salt: number;
    startTime: number;
    endTime: number;
    signature?: string;
}
//# sourceMappingURL=types.d.ts.map