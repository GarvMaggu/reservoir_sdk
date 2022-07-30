import { Provider } from "@ethersproject/abstract-provider";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseOrderInfo } from "./builders/base";
import * as Types from "./types";
export declare class Order {
    chainId: number;
    params: Types.BaseOrder;
    constructor(chainId: number, params: Types.BaseOrder);
    getRaw(): any;
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
        types: any;
        value: any;
    };
    checkSignature(): void;
    checkValidity(): void;
    getInfo(): BaseOrderInfo | undefined;
    checkFillability(provider: Provider): Promise<void>;
    buildMatching(data?: any): Types.MatchParams;
    getFeeAmount(): BigNumber;
    private getEip712TypesAndValue;
    private getBuilder;
    private detectKind;
}
//# sourceMappingURL=order.d.ts.map