"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackedListValidator = exports.BitVectorValidator = exports.TokenRangeValidator = exports.Eth = exports.Exchange = void 0;
const utils_1 = require("../utils");
exports.Exchange = {
    [utils_1.Network.Ethereum]: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    [utils_1.Network.EthereumGoerli]: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    [utils_1.Network.Optimism]: "0xdef1abe32c034e558cdd535791643c58a13acc10",
};
exports.Eth = {
    [utils_1.Network.Ethereum]: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    [utils_1.Network.EthereumGoerli]: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    [utils_1.Network.Optimism]: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
};
exports.TokenRangeValidator = {
    [utils_1.Network.Ethereum]: "0xf4a4daa2e20f3d249d53e74a15b6a0518c27927d",
};
exports.BitVectorValidator = {
    [utils_1.Network.Ethereum]: "0x345db61cf74cea41c0a58155470020e1392eff2b",
};
exports.PackedListValidator = {
    [utils_1.Network.Ethereum]: "0xda9881fcdf8e73d57727e929380ef20eb50521fe",
};
//# sourceMappingURL=addresses.js.map