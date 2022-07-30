"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builders = void 0;
const erc721_1 = require("./contract-wide/erc721");
const erc1155_1 = require("./contract-wide/erc1155");
const erc721_2 = require("./single-token/v1/erc721");
const erc721_3 = require("./single-token/v2/erc721");
const erc1155_2 = require("./single-token/v1/erc1155");
const erc1155_3 = require("./single-token/v2/erc1155");
const erc721_4 = require("./token-list/erc721");
const erc1155_4 = require("./token-list/erc1155");
const erc721_5 = require("./token-range/erc721");
const erc1155_5 = require("./token-range/erc1155");
exports.Builders = {
    Erc721: {
        ContractWide: erc721_1.ContractWideErc721Builder,
        SingleToken: {
            V1: erc721_2.SingleTokenErc721BuilderV1,
            V2: erc721_3.SingleTokenErc721BuilderV2,
        },
        TokenList: erc721_4.TokenListErc721Builder,
        TokenRange: erc721_5.TokenRangeErc721Builder,
    },
    Erc1155: {
        ContractWide: erc1155_1.ContractWideErc1155Builder,
        SingleToken: {
            V1: erc1155_2.SingleTokenErc1155BuilderV1,
            V2: erc1155_3.SingleTokenErc1155BuilderV2,
        },
        TokenList: erc1155_4.TokenListErc1155Builder,
        TokenRange: erc1155_5.TokenRangeErc1155Builder,
    },
};
//# sourceMappingURL=index.js.map