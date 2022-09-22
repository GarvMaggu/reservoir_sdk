"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolFeeSettings = exports.Erc20TransferHelper = exports.Erc721TransferHelper = exports.ModuleManager = exports.AuctionHouseCoreErc20 = exports.AuctionHouseCoreEth = exports.AuctionHouse = exports.Exchange = void 0;
const utils_1 = require("../utils");
exports.Exchange = {
    [utils_1.Network.Ethereum]: "0x6170b3c3a54c3d8c854934cbc314ed479b2b29a3",
    [utils_1.Network.Polygon]: "0x3634e984ba0373cfa178986fd19f03ba4dd8e469",
    [utils_1.Network.EthereumRinkeby]: "0xa98d3729265c88c5b3f861a0c501622750ff4806",
    [utils_1.Network.PolygonMumbai]: "0xce6cef2a9028e1c3b21647ae3b4251038109f42a",
};
exports.AuctionHouse = {
    [utils_1.Network.Ethereum]: "0xe468ce99444174bd3bbbed09209577d25d1ad673",
};
exports.AuctionHouseCoreEth = {
    [utils_1.Network.Ethereum]: "0x5f7072e1fa7c01dfac7cf54289621afaad2184d0",
    [utils_1.Network.EthereumRinkeby]: "0x3feaf4c06211680e5969a86adb1423fc8ad9e994",
};
exports.AuctionHouseCoreErc20 = {
    [utils_1.Network.Ethereum]: "0x53172d999a299198a935f9e424f9f8544e3d4292",
    [utils_1.Network.EthereumRinkeby]: "0x9eb86b88d13ed0e38348ab951b55a26ca468a262",
};
exports.ModuleManager = {
    [utils_1.Network.Ethereum]: "0x850a7c6fe2cf48eea1393554c8a3ba23f20cc401",
    [utils_1.Network.Polygon]: "0xcca379fdf4beda63c4bb0e2a3179ae62c8716794",
    [utils_1.Network.PolygonMumbai]: "0x850a7c6fe2cf48eea1393554c8a3ba23f20cc401",
};
exports.Erc721TransferHelper = {
    [utils_1.Network.Ethereum]: "0x909e9efe4d87d1a6018c2065ae642b6d0447bc91",
    [utils_1.Network.Polygon]: "0xce6cef2a9028e1c3b21647ae3b4251038109f42a",
    [utils_1.Network.PolygonMumbai]: "0x909e9efe4d87d1a6018c2065ae642b6d0447bc91",
};
exports.Erc20TransferHelper = {
    [utils_1.Network.Ethereum]: "0xcca379fdf4beda63c4bb0e2a3179ae62c8716794",
    [utils_1.Network.Polygon]: "0x909e9efe4d87d1a6018c2065ae642b6d0447bc91",
    [utils_1.Network.PolygonMumbai]: "0xcca379fdf4beda63c4bb0e2a3179ae62c8716794",
};
exports.ProtocolFeeSettings = {
    [utils_1.Network.Ethereum]: "0x9641169a1374b77e052e1001c5a096c29cd67d35",
    [utils_1.Network.Polygon]: "0x9641169a1374b77e052e1001c5a096c29cd67d35",
    [utils_1.Network.PolygonMumbai]: "0x9641169a1374b77e052e1001c5a096c29cd67d35",
};
//# sourceMappingURL=addresses.js.map