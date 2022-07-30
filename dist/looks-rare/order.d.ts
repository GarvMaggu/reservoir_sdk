import { Provider } from "@ethersproject/abstract-provider";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import * as Types from "./types";
export declare class Order {
    chainId: number;
    params: Types.MakerOrderParams;
    constructor(chainId: number, params: Types.MakerOrderParams);
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
            MakerOrder: {
                name: string;
                type: string;
            }[];
        };
        value: any;
    };
    checkSignature(): void;
    checkValidity(): void;
    checkFillability(provider: Provider): Promise<void>;
    buildMatching(taker: string, data?: any): Types.TakerOrderParams;
    private getBuilder;
    private detectKind;
}
//# sourceMappingURL=order.d.ts.map