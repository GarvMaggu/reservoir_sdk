"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builders = void 0;
const contract_wide_1 = require("./contract-wide");
const single_token_1 = require("./single-token");
const bit_vector_1 = require("./token-list/bit-vector");
const packed_list_1 = require("./token-list/packed-list");
const token_range_1 = require("./token-range");
exports.Builders = {
    ContractWide: contract_wide_1.ContractWideBuilder,
    SingleToken: single_token_1.SingleTokenBuilder,
    TokenList: {
        BitVector: bit_vector_1.BitVectorTokenListBuilder,
        PackedList: packed_list_1.PackedListTokenListBuilder,
    },
    TokenRange: token_range_1.TokenRangeBuilder,
};
//# sourceMappingURL=index.js.map