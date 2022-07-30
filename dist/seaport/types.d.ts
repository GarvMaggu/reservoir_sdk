export declare type OrderKind = "contract-wide" | "single-token" | "token-list" | "bundle-ask";
export declare enum ItemType {
    NATIVE = 0,
    ERC20 = 1,
    ERC721 = 2,
    ERC1155 = 3,
    ERC721_WITH_CRITERIA = 4,
    ERC1155_WITH_CRITERIA = 5
}
export declare enum OrderType {
    FULL_OPEN = 0,
    PARTIAL_OPEN = 1,
    FULL_RESTRICTED = 2,
    PARTIAL_RESTRICTED = 3
}
export declare enum BasicOrderType {
    ETH_TO_ERC721_FULL_OPEN = 0,
    ETH_TO_ERC721_PARTIAL_OPEN = 1,
    ETH_TO_ERC721_FULL_RESTRICTED = 2,
    ETH_TO_ERC721_PARTIAL_RESTRICTED = 3,
    ETH_TO_ERC1155_FULL_OPEN = 4,
    ETH_TO_ERC1155_PARTIAL_OPEN = 5,
    ETH_TO_ERC1155_FULL_RESTRICTED = 6,
    ETH_TO_ERC1155_PARTIAL_RESTRICTED = 7,
    ERC20_TO_ERC721_FULL_OPEN = 8,
    ERC20_TO_ERC721_PARTIAL_OPEN = 9,
    ERC20_TO_ERC721_FULL_RESTRICTED = 10,
    ERC20_TO_ERC721_PARTIAL_RESTRICTED = 11,
    ERC20_TO_ERC1155_FULL_OPEN = 12,
    ERC20_TO_ERC1155_PARTIAL_OPEN = 13,
    ERC20_TO_ERC1155_FULL_RESTRICTED = 14,
    ERC20_TO_ERC1155_PARTIAL_RESTRICTED = 15,
    ERC721_TO_ERC20_FULL_OPEN = 16,
    ERC721_TO_ERC20_PARTIAL_OPEN = 17,
    ERC721_TO_ERC20_FULL_RESTRICTED = 18,
    ERC721_TO_ERC20_PARTIAL_RESTRICTED = 19,
    ERC1155_TO_ERC20_FULL_OPEN = 20,
    ERC1155_TO_ERC20_PARTIAL_OPEN = 21,
    ERC1155_TO_ERC20_FULL_RESTRICTED = 22,
    ERC1155_TO_ERC20_PARTIAL_RESTRICTED = 23
}
export declare enum Side {
    OFFER = 0,
    CONSIDERATION = 1
}
export declare type OfferItem = {
    itemType: ItemType;
    token: string;
    identifierOrCriteria: string;
    startAmount: string;
    endAmount: string;
};
export declare type ConsiderationItem = {
    itemType: ItemType;
    token: string;
    identifierOrCriteria: string;
    startAmount: string;
    endAmount: string;
    recipient: string;
};
export declare type OrderComponents = {
    kind?: OrderKind;
    offerer: string;
    zone: string;
    offer: OfferItem[];
    consideration: ConsiderationItem[];
    orderType: OrderType;
    startTime: number;
    endTime: number;
    zoneHash: string;
    salt: string;
    conduitKey: string;
    counter: string;
    signature?: string;
};
export declare type MatchParams = {
    amount?: string;
    criteriaResolvers?: CriteriaResolver[];
};
export declare type SpentItem = {
    itemType: ItemType;
    token: string;
    identifier: string;
    amount: string;
};
export declare type ReceivedItem = {
    itemType: ItemType;
    token: string;
    identifier: string;
    amount: string;
    recipient: string;
};
export declare type CriteriaResolver = {
    orderIndex: number;
    side: Side;
    index: number;
    identifier: string;
    criteriaProof: string[];
};
//# sourceMappingURL=types.d.ts.map