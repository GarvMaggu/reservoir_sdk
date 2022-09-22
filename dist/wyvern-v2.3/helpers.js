"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.ProxyRegistry = void 0;
const contracts_1 = require("@ethersproject/contracts");
const Addresses = __importStar(require("./addresses"));
const ProxyRegistry_json_1 = __importDefault(require("./abis/ProxyRegistry.json"));
/**
 * The ProxyRegistry interface provides partial functionality to interact with the Wyvern Proxy Registry contract.
 */
class ProxyRegistry {
    /**
     *
     * @param provider A read-only abstraction to access the blockchain data
     * @param chainId The chain ID for the Ethereum network to be used. For example, 1 for Ethereum Mainnet and 4 for Rinkeby Testnet.
     */
    constructor(provider, chainId) {
        this.contract = new contracts_1.Contract(Addresses.ProxyRegistry[chainId], ProxyRegistry_json_1.default, provider);
    }
    /**
     *
     * @param owner Proxy owner's address
     * @returns The proxy's Ethereum address
     */
    async getProxy(owner) {
        return this.contract.proxies(owner);
    }
    /**
     * Register an Ethereum address to the Wyvern Proxy Registry contract
     * @param registerer Registerer to the Proxy Registry contract
     * @returns The contract transaction
     */
    async registerProxy(registerer) {
        return this.contract.connect(registerer).registerProxy();
    }
    registerProxyTransaction(registerer) {
        const data = this.contract.interface.encodeFunctionData("registerProxy");
        return {
            from: registerer,
            to: this.contract.address,
            data,
        };
    }
}
exports.ProxyRegistry = ProxyRegistry;
//# sourceMappingURL=helpers.js.map