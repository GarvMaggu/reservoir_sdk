import { BigNumberish } from "@ethersproject/bignumber";
export declare type BaseBuildParams = {
    user: string;
    network: number;
    side: "sell" | "buy";
    deadline: number;
    currency: string;
    price: BigNumberish;
    contract: string;
    salt?: BigNumberish;
};
//# sourceMappingURL=base.d.ts.map