"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSeaMekleValidator = exports.TokenRangeVerifier = exports.TokenListVerifier = exports.TokenTransferProxy = exports.ProxyRegistry = exports.Exchange = void 0;
const utils_1 = require("../utils");
exports.Exchange = {
    [utils_1.Network.Ethereum]: "0x7f268357a8c2552623316e2562d90e642bb538e5",
    [utils_1.Network.EthereumRinkeby]: "0xdd54d660178b28f6033a953b0e55073cfa7e3744",
};
exports.ProxyRegistry = {
    [utils_1.Network.Ethereum]: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
    [utils_1.Network.EthereumRinkeby]: "0x1e525eeaf261ca41b809884cbde9dd9e1619573a",
};
exports.TokenTransferProxy = {
    [utils_1.Network.Ethereum]: "0xe5c783ee536cf5e63e792988335c4255169be4e1",
    [utils_1.Network.EthereumRinkeby]: "0xcdc9188485316bf6fa416d02b4f680227c50b89e",
};
exports.TokenListVerifier = {
    [utils_1.Network.Ethereum]: "0x13ca300c11b70e555c7bc93f898f67503c8619c9",
    [utils_1.Network.EthereumRinkeby]: "0xab429e7cb5c441b8275f90a419e213bd4a795e67",
};
exports.TokenRangeVerifier = {
    [utils_1.Network.Ethereum]: "0x12f313f763eab71481efb70fb0254a77ed6ab829",
    [utils_1.Network.EthereumRinkeby]: "0x253c0d8f6aa4d89b57d5a0caea6131090fd13cc5",
};
exports.OpenSeaMekleValidator = {
    [utils_1.Network.Ethereum]: "0xbaf2127b49fc93cbca6269fade0f7f31df4c88a7",
    [utils_1.Network.EthereumRinkeby]: "0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1",
};
//# sourceMappingURL=addresses.js.map