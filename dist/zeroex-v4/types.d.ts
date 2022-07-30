export declare type OrderKind = "erc721-single-token" | "erc1155-single-token" | "erc721-contract-wide" | "erc1155-contract-wide" | "erc721-token-range" | "erc1155-token-range" | "erc721-token-list-bit-vector" | "erc1155-token-list-bit-vector" | "erc721-token-list-packed-list" | "erc1155-token-list-packed-list";
export declare enum TradeDirection {
    SELL = 0,
    BUY = 1
}
export declare type BaseOrder = {
    kind?: OrderKind;
    direction: TradeDirection;
    maker: string;
    taker: string;
    expiry: number;
    nonce: string;
    erc20Token: string;
    erc20TokenAmount: string;
    fees: {
        recipient: string;
        amount: string;
        feeData: string;
    }[];
    nft: string;
    nftId: string;
    nftProperties: {
        propertyValidator: string;
        propertyData: string;
    }[];
    nftAmount?: string;
    signatureType?: number;
    v?: number;
    r?: string;
    s?: string;
};
export declare type MatchParams = {
    nftId?: string;
    nftAmount?: string;
    unwrapNativeToken?: boolean;
};
//# sourceMappingURL=types.d.ts.map