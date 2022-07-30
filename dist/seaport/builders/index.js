"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builders = void 0;
const bundle_ask_1 = require("./bundles/bundle-ask");
const contract_wide_1 = require("./contract-wide");
const single_token_1 = require("./single-token");
const token_list_1 = require("./token-list");
exports.Builders = {
    Bundle: {
        BundleAsk: bundle_ask_1.BundleAskBuilder,
    },
    ContractWide: contract_wide_1.ContractWideBuilder,
    SingleToken: single_token_1.SingleTokenBuilder,
    TokenList: token_list_1.TokenListBuilder,
};
//# sourceMappingURL=index.js.map