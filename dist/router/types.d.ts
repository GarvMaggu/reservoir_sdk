import * as Sdk from "../index";
export declare enum ExchangeKind {
    WYVERN_V23 = 0,
    LOOKS_RARE = 1,
    ZEROEX_V4 = 2,
    FOUNDATION = 3,
    X2Y2 = 4,
    SEAPORT = 5
}
export declare type GenericOrder = {
    kind: "foundation";
    order: Sdk.Foundation.Order;
} | {
    kind: "looks-rare";
    order: Sdk.LooksRare.Order;
} | {
    kind: "opendao";
    order: Sdk.OpenDao.Order;
} | {
    kind: "wyvern-v2.3";
    order: Sdk.WyvernV23.Order;
} | {
    kind: "x2y2";
    order: Sdk.X2Y2.Order;
} | {
    kind: "zeroex-v4";
    order: Sdk.ZeroExV4.Order;
} | {
    kind: "seaport";
    order: Sdk.Seaport.Order;
};
export declare type ListingFillDetails = {
    contractKind: "erc721" | "erc1155";
    contract: string;
    tokenId: string;
    amount?: number | string;
};
export declare type BidFillDetails = {
    contractKind: "erc721" | "erc1155";
    contract: string;
    tokenId: string;
    extraArgs?: any;
};
export declare type ListingDetails = GenericOrder & ListingFillDetails;
export declare type BidDetails = GenericOrder & BidFillDetails;
//# sourceMappingURL=types.d.ts.map