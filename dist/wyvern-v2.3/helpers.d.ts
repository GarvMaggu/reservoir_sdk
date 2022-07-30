import { Provider, TransactionResponse } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import { TxData } from "../utils";
/**
 * The ProxyRegistry interface provides partial functionality to interact with the Wyvern Proxy Registry contract.
 */
export declare class ProxyRegistry {
    /**
     * The proxy registry's Ethereum contract object
     */
    contract: Contract;
    /**
     *
     * @param provider A read-only abstraction to access the blockchain data
     * @param chainId The chain ID for the Ethereum network to be used. For example, 1 for Ethereum Mainnet and 4 for Rinkeby Testnet.
     */
    constructor(provider: Provider, chainId: number);
    /**
     *
     * @param owner Proxy owner's address
     * @returns The proxy's Ethereum address
     */
    getProxy(owner: string): Promise<string>;
    /**
     * Register an Ethereum address to the Wyvern Proxy Registry contract
     * @param registerer Registerer to the Proxy Registry contract
     * @returns The contract transaction
     */
    registerProxy(registerer: Signer): Promise<TransactionResponse>;
    registerProxyTransaction(registerer: string): TxData;
}
//# sourceMappingURL=helpers.d.ts.map