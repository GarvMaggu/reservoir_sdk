"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decomposePackedList = exports.generatePackedList = exports.getPackedListCalldataSize = void 0;
const abi_1 = require("@ethersproject/abi");
const utils_1 = require("../../utils");
const getPackedListCalldataSize = (tokenIds) => {
    let maxTokenId = tokenIds[tokenIds.length - 1];
    let numBytes = 0;
    while ((0, utils_1.bn)(maxTokenId).gt(0)) {
        maxTokenId = (0, utils_1.bn)(maxTokenId).shr(8);
        numBytes++;
    }
    numBytes = Math.max(numBytes, 1);
    return 96 + numBytes * tokenIds.length;
};
exports.getPackedListCalldataSize = getPackedListCalldataSize;
const generatePackedList = (tokenIds) => {
    tokenIds.sort((a, b) => ((0, utils_1.bn)(a).lt(b) ? -1 : 1));
    let maxTokenId = tokenIds[tokenIds.length - 1];
    let numBytes = 0;
    while ((0, utils_1.bn)(maxTokenId).gt(0)) {
        maxTokenId = (0, utils_1.bn)(maxTokenId).shr(8);
        numBytes++;
    }
    numBytes = Math.max(numBytes, 1);
    return abi_1.defaultAbiCoder.encode(["uint256", "bytes"], [
        numBytes,
        "0x" +
            tokenIds
                .map((x) => (0, utils_1.bn)(x)
                .toHexString()
                .slice(2)
                .padStart(numBytes * 2, "0"))
                .join(""),
    ]);
};
exports.generatePackedList = generatePackedList;
const decomposePackedList = (packedList) => {
    let [numBytes, list] = abi_1.defaultAbiCoder.decode(["uint256", "bytes"], packedList);
    numBytes = Number(numBytes);
    const result = [];
    for (let i = 2; i < list.length; i += numBytes * 2) {
        result.push((0, utils_1.bn)("0x" + list.slice(i, i + numBytes * 2)));
    }
    return result;
};
exports.decomposePackedList = decomposePackedList;
//# sourceMappingURL=packed-list.js.map