"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferManagerErc1155 = exports.TransferManagerErc721 = exports.StrategyAnyItemFromCollectionForFixedPrice = exports.StrategyStandardSaleForFixedPrice = exports.Exchange = void 0;
const utils_1 = require("../utils");
exports.Exchange = {
    [utils_1.Network.Ethereum]: "0x59728544b08ab483533076417fbbb2fd0b17ce3a",
    [utils_1.Network.EthereumRinkeby]: "0x1aa777972073ff66dcfded85749bdd555c0665da",
};
exports.StrategyStandardSaleForFixedPrice = {
    [utils_1.Network.Ethereum]: "0x56244bb70cbd3ea9dc8007399f61dfc065190031",
    [utils_1.Network.EthereumRinkeby]: "0x732319a3590e4fa838c111826f9584a9a2fdea1a",
};
exports.StrategyAnyItemFromCollectionForFixedPrice = {
    [utils_1.Network.Ethereum]: "0x86f909f70813cdb1bc733f4d97dc6b03b8e7e8f3",
    [utils_1.Network.EthereumRinkeby]: "0xa6e7decd4e18b510c6b98aa0c8ee2db3879f529d",
};
exports.TransferManagerErc721 = {
    [utils_1.Network.Ethereum]: "0xf42aa99f011a1fa7cda90e5e98b277e306bca83e",
    [utils_1.Network.EthereumRinkeby]: "0x3f65a762f15d01809cdc6b43d8849ff24949c86a",
};
exports.TransferManagerErc1155 = {
    [utils_1.Network.Ethereum]: "0xfed24ec7e22f573c2e08aef55aa6797ca2b3a051",
    [utils_1.Network.EthereumRinkeby]: "0xaf3115757a96e9439fe8d5898db820afda15958a",
};
//# sourceMappingURL=addresses.js.map