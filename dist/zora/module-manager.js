"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleManager = void 0;
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const ModuleManager_json_1 = __importDefault(require("./abis/ModuleManager.json"));
class ModuleManager {
    constructor(chainId) {
        this.chainId = chainId;
        this.contract = new contracts_1.Contract(Addresses.ModuleManager[this.chainId], ModuleManager_json_1.default);
    }
    // --- Set approval for module ---
    async setApprovalForModule(signer, module, approved) {
        const tx = this.setApprovalForModuleTx(await signer.getAddress(), module, approved);
        return signer.sendTransaction(tx);
    }
    setApprovalForModuleTx(signer, module, approved) {
        return {
            from: signer,
            to: this.contract.address,
            data: this.contract.interface.encodeFunctionData("setApprovalForModule", [
                module,
                approved,
            ]),
        };
    }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=module-manager.js.map