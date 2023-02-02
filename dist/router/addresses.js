"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllRouters = exports.Router = void 0;
const utils_1 = require("../utils");
exports.Router = {
    [utils_1.Network.Ethereum]: "0x114e54a100a0415abf9727234c92c83dbcc59abf",
    [utils_1.Network.EthereumGoerli]: "0x4e650642393ac992553b8fdd98be7750e99660cc",
    [utils_1.Network.EthereumRinkeby]: "0x0857cc569a239c4e2f7abb5168408d92fb8d63ae", // V5_0_0
};
// Keep track of all used or previously used router contracts
exports.AllRouters = {
    [utils_1.Network.Ethereum]: [
        "0xc52b521b284792498c1036d4c2ed4b73387b3859",
        "0x5aa9ca240174a54af6d9bfc69214b2ed948de86d",
        "0x7c9733b19e14f37aca367fbd78922c098c55c874",
        "0x8005488ff4f8982d2d8c1d602e6d747b1428dd41",
        "0x114e54a100a0415abf9727234c92c83dbcc59abf", // V5_0_0
    ],
    [utils_1.Network.EthereumGoerli]: [
        "0x4e650642393ac992553b8fdd98be7750e99660cc", // V5_0_0
    ],
    [utils_1.Network.EthereumRinkeby]: [
        "0xa5c0c6c024460b039b917a77eb564da5817c55e2",
        "0x060ef49d2f5d7038cc7397936641feb7c5ae3679",
        "0xf2418e0c7118df2468fa786606c3e5b68088adbc",
        "0xc226bb0a5ebb944df0b18e85e9800d463c5afe3f",
        "0x0857cc569a239c4e2f7abb5168408d92fb8d63ae", // V5_0_0
    ],
};
//# sourceMappingURL=addresses.js.map