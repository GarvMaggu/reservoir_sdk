export declare type OrderKind = "single-token" | "collection-wide";
export declare enum Intent {
    SELL = 1,
    BUY = 3
}
export declare enum DelegationType {
    ERC721 = 1,
    ERC1155 = 2
}
export declare enum Op {
    INVALID = 0,
    COMPLETE_SELL_OFFER = 1,
    COMPLETE_BUY_OFFER = 2,
    CANCEL_OFFER = 3,
    BID = 4,
    COMPLETE_AUCTION = 5,
    REFUND_AUCTION = 6,
    REFUND_AUCTION_STUCK_ITEM = 7
}
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
        tokenId?: string;
    };
};
export declare type LocalOrder = {
    salt: string;
    user: string;
    network: number;
    intent: number;
    delegateType: number;
    deadline: number;
    currency: string;
    dataMask: string;
    items: {
        price: string;
        data: string;
    }[];
    v?: number;
    r?: string;
    s?: string;
    signVersion: number;
};
//# sourceMappingURL=types.d.ts.map