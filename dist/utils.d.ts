import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
export declare const BytesEmpty = "0x";
export declare const MaxUint256: BigNumber;
export declare const getRandomBytes: (numBytes?: number) => BigNumber;
export declare const bn: (value: BigNumberish) => BigNumber;
export declare const getCurrentTimestamp: (delay?: number) => number;
export declare const lc: (x: string) => string;
export declare const n: (x: any) => any;
export declare const s: (x: any) => any;
export declare const generateReferrerBytes: (referrer?: string | undefined) => string;
export declare const generateSourceBytes: (source?: string | undefined) => string;
export declare const getReferrer: (calldata: string) => string | undefined;
export declare type TxData = {
    from: string;
    to: string;
    data: string;
    value?: string;
};
export declare enum Network {
    Ethereum = 1,
    EthereumRinkeby = 4,
    EthereumGoerli = 5,
    EthereumKovan = 42,
    Optimism = 10,
    OptimismKovan = 69,
    Gnosis = 100,
    Polygon = 137,
    PolygonMumbai = 80001,
    Arbitrum = 42161,
    Avalanche = 43114,
    AvalancheFuji = 43113
}
export declare type ChainIdToAddress = {
    [chainId: number]: string;
};
export declare type ChainIdToAddressList = {
    [chainId: number]: string[];
};
export declare type ChainIdToAddressMap = {
    [chainId: number]: {
        [address: string]: string;
    };
};
//# sourceMappingURL=utils.d.ts.map