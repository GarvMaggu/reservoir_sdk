export declare type OrderKind = "single-token";
export declare type Order = {
    kind?: OrderKind;
    id: number;
    type: string;
    currency: string;
    price: string;
    maker: string;
    taker: string;
    deadline: number;
    itemHash: string;
    nft: {
        token: string;
        tokenId: string;
    };
};
//# sourceMappingURL=types.d.ts.map