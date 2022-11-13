"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = exports.getReferrer = exports.generateSourceBytes = exports.generateReferrerBytes = exports.s = exports.n = exports.lc = exports.getCurrentTimestamp = exports.bn = exports.getRandomBytes = exports.MaxUint256 = exports.BytesEmpty = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const random_1 = require("@ethersproject/random");
const strings_1 = require("@ethersproject/strings");
// Constants
exports.BytesEmpty = "0x";
exports.MaxUint256 = bignumber_1.BigNumber.from("0x" + "f".repeat(64));
// Random
const getRandomBytes = (numBytes = 32) => (0, exports.bn)((0, random_1.randomBytes)(numBytes));
exports.getRandomBytes = getRandomBytes;
// BigNumber
const bn = (value) => bignumber_1.BigNumber.from(value);
exports.bn = bn;
// Time
const getCurrentTimestamp = (delay = 0) => Math.floor(Date.now() / 1000 + delay);
exports.getCurrentTimestamp = getCurrentTimestamp;
// Ease of use
const lc = (x) => x === null || x === void 0 ? void 0 : x.toLowerCase();
exports.lc = lc;
const n = (x) => (x ? Number(x) : x);
exports.n = n;
const s = (x) => (x ? String(x) : x);
exports.s = s;
// Misc
// Use the ASCII US (unit separator) character (code = 31) as a delimiter
const SEPARATOR = "1f";
// Only allow printable ASCII characters
const isPrintableASCII = (value) => /^[\x20-\x7F]*$/.test(value);
const generateReferrerBytes = (referrer) => {
    if (referrer && !isPrintableASCII(referrer)) {
        throw new Error("Not a printable ASCII string");
    }
    return referrer
        ? `${SEPARATOR}${Buffer.from((0, strings_1.toUtf8Bytes)(referrer)).toString("hex")}${SEPARATOR}`
        : "";
};
exports.generateReferrerBytes = generateReferrerBytes;
const generateSourceBytes = (source) => {
    if (source && !isPrintableASCII(source)) {
        throw new Error("Not a printable ASCII string");
    }
    return source
        ? `${SEPARATOR}${Buffer.from((0, strings_1.toUtf8Bytes)(source)).toString("hex")}${SEPARATOR}`
        : "";
};
exports.generateSourceBytes = generateSourceBytes;
const getReferrer = (calldata) => {
    try {
        if (calldata.endsWith(SEPARATOR)) {
            const index = calldata.slice(0, -2).lastIndexOf(SEPARATOR);
            // If we cannot find the separated referrer string within the last
            // 32 bytes of the calldata, we simply assume it is missing
            if (index === -1 || calldata.length - index - 5 > 64) {
                return undefined;
            }
            else {
                const result = (0, strings_1.toUtf8String)("0x" + calldata.slice(index + 2, -2));
                if (isPrintableASCII(result)) {
                    return result;
                }
                else {
                    return undefined;
                }
            }
        }
    }
    catch {
        return undefined;
    }
};
exports.getReferrer = getReferrer;
var Network;
(function (Network) {
    // Ethereum
    Network[Network["Ethereum"] = 1] = "Ethereum";
    Network[Network["EthereumRinkeby"] = 4] = "EthereumRinkeby";
    Network[Network["EthereumGoerli"] = 5] = "EthereumGoerli";
    Network[Network["EthereumKovan"] = 42] = "EthereumKovan";
    // Optimism
    Network[Network["Optimism"] = 10] = "Optimism";
    Network[Network["OptimismKovan"] = 69] = "OptimismKovan";
    // Gnosis
    Network[Network["Gnosis"] = 100] = "Gnosis";
    // Polygon
    Network[Network["Polygon"] = 137] = "Polygon";
    Network[Network["PolygonMumbai"] = 80001] = "PolygonMumbai";
    // Arbitrum
    Network[Network["Arbitrum"] = 42161] = "Arbitrum";
    // Avalanche
    Network[Network["Avalanche"] = 43114] = "Avalanche";
    Network[Network["AvalancheFuji"] = 43113] = "AvalancheFuji";
})(Network = exports.Network || (exports.Network = {}));
//# sourceMappingURL=utils.js.map