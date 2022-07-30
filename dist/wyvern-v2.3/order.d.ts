import { Provider } from "@ethersproject/abstract-provider";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { BigNumberish } from "@ethersproject/bignumber";
import { BaseOrderInfo } from "./builders/base";
import * as Types from "./types";
export declare class Order {
    chainId: number;
    params: Types.OrderParams;
    constructor(chainId: number, params: Types.OrderParams);
    hash(): string;
    prefixHash(): string;
    sign(signer: TypedDataSigner): Promise<void>;
    getSignatureData(): {
        signatureKind: string;
        domain: {
            name: string;
            version: string;
            chainId: number;
            verifyingContract: string;
        };
        types: {
            Order: {
                name: string;
                type: string;
            }[];
        };
        value: any;
    };
    /**
     * Build a matching buy order for a sell order and vice versa
     * @param taker The taker's Ethereum address
     * @param data Any aditional arguments
     * @returns The matching Wyvern v2 order
     */
    buildMatching(taker: string, data?: any): Order;
    /**
     * Check the validity of the order's signature
     */
    checkSignature(): void;
    /**
     * Check the order's validity
     */
    checkValidity(): void;
    getInfo(): BaseOrderInfo | undefined;
    getMatchingPrice(timestampOverride?: number): BigNumberish;
    isDutchAuction(): boolean;
    /**
     * Check the order's fillability
     * @param provider A read-only abstraction to access the blockchain data
     */
    checkFillability(provider: Provider): Promise<void>;
    private getBuilder;
    private detectKind;
}
//# sourceMappingURL=order.d.ts.map