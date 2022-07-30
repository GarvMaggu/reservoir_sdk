import { ContractWideErc721Builder } from "./contract-wide/erc721";
import { ContractWideErc1155Builder } from "./contract-wide/erc1155";
import { SingleTokenErc721BuilderV1 } from "./single-token/v1/erc721";
import { SingleTokenErc721BuilderV2 } from "./single-token/v2/erc721";
import { SingleTokenErc1155BuilderV1 } from "./single-token/v1/erc1155";
import { SingleTokenErc1155BuilderV2 } from "./single-token/v2/erc1155";
import { TokenListErc721Builder } from "./token-list/erc721";
import { TokenListErc1155Builder } from "./token-list/erc1155";
import { TokenRangeErc721Builder } from "./token-range/erc721";
import { TokenRangeErc1155Builder } from "./token-range/erc1155";
export declare const Builders: {
    Erc721: {
        ContractWide: typeof ContractWideErc721Builder;
        SingleToken: {
            V1: typeof SingleTokenErc721BuilderV1;
            V2: typeof SingleTokenErc721BuilderV2;
        };
        TokenList: typeof TokenListErc721Builder;
        TokenRange: typeof TokenRangeErc721Builder;
    };
    Erc1155: {
        ContractWide: typeof ContractWideErc1155Builder;
        SingleToken: {
            V1: typeof SingleTokenErc1155BuilderV1;
            V2: typeof SingleTokenErc1155BuilderV2;
        };
        TokenList: typeof TokenListErc1155Builder;
        TokenRange: typeof TokenRangeErc1155Builder;
    };
};
//# sourceMappingURL=index.d.ts.map