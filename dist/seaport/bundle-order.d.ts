import { Provider } from "@ethersproject/abstract-provider";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseBundleOrderInfo } from "./builders/base/bundle";
import * as Types from "./types";
export declare class BundleOrder {
    chainId: number;
    params: Types.OrderComponents;
    constructor(chainId: number, params: Types.OrderComponents);
    hash(): string;
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
            OrderComponents: {
                name: string;
                type: string;
            }[];
            OfferItem: {
                name: string;
                type: string;
            }[];
            ConsiderationItem: {
                name: string;
                type: string;
            }[];
        };
        value: Types.OrderComponents;
    };
    checkSignature(): void;
    checkValidity(): void;
    getMatchingPrice(): BigNumber;
    getInfo(): BaseBundleOrderInfo | undefined;
    getFeeAmount(): BigNumber;
    buildMatching(data?: any): Types.MatchParams;
    checkFillability(provider: Provider): Promise<void>;
    private getBuilder;
    private detectKind;
}
export declare const ORDER_EIP712_TYPES: {
    OrderComponents: {
        name: string;
        type: string;
    }[];
    OfferItem: {
        name: string;
        type: string;
    }[];
    ConsiderationItem: {
        name: string;
        type: string;
    }[];
};
//# sourceMappingURL=bundle-order.d.ts.map