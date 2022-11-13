"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20TransferProxy = exports.ERC1155LazyTransferProxy = exports.ERC721LazyTransferProxy = exports.NFTTransferProxy = exports.Exchange = void 0;
const utils_1 = require("../utils");
exports.Exchange = {
    [utils_1.Network.Ethereum]: "0x9757f2d2b135150bbeb65308d4a91804107cd8d6",
    [utils_1.Network.EthereumRinkeby]: "0xd4a57a3bd3657d0d46b4c5bac12b3f156b9b886b",
    [utils_1.Network.EthereumGoerli]: "0x02afbD43cAD367fcB71305a2dfB9A3928218f0c1",
};
exports.NFTTransferProxy = {
    [utils_1.Network.Ethereum]: "0x4fee7b061c97c9c496b01dbce9cdb10c02f0a0be",
    [utils_1.Network.EthereumGoerli]: "0x21B0B84FfAB5A8c48291f5eC9D9FDb9aef574052",
};
exports.ERC721LazyTransferProxy = {
    [utils_1.Network.Ethereum]: "0xbb7829BFdD4b557EB944349b2E2c965446052497",
    [utils_1.Network.EthereumGoerli]: "0x96102D9472C0338005cbf12Fb7eA829F242C2809",
};
exports.ERC1155LazyTransferProxy = {
    [utils_1.Network.Ethereum]: "0x75a8B7c0B22D973E0B46CfBD3e2f6566905AA79f",
    [utils_1.Network.EthereumGoerli]: "0x1e1B6E13F0eB4C570628589e3c088BC92aD4dB45",
};
exports.ERC20TransferProxy = {
    [utils_1.Network.Ethereum]: "0xb8e4526e0da700e9ef1f879af713d691f81507d8",
    [utils_1.Network.EthereumGoerli]: "0x17cEf9a8bf107D58E87c170be1652c06390BD990",
};
//# sourceMappingURL=addresses.js.map