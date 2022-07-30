import { ContractWideBuilder } from "./contract-wide";
import { SingleTokenBuilder } from "./single-token";
import { BitVectorTokenListBuilder } from "./token-list/bit-vector";
import { PackedListTokenListBuilder } from "./token-list/packed-list";
import { TokenRangeBuilder } from "./token-range";
export declare const Builders: {
    ContractWide: typeof ContractWideBuilder;
    SingleToken: typeof SingleTokenBuilder;
    TokenList: {
        BitVector: typeof BitVectorTokenListBuilder;
        PackedList: typeof PackedListTokenListBuilder;
    };
    TokenRange: typeof TokenRangeBuilder;
};
//# sourceMappingURL=index.d.ts.map