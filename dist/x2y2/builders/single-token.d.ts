import { BigNumberish } from "@ethersproject/bignumber";
import { BaseBuildParams } from "./base";
import * as Types from "../types";
interface BuildParams extends BaseBuildParams {
    tokenId: BigNumberish;
}
export declare const buildOrder: (params: BuildParams) => Types.LocalOrder;
export {};
//# sourceMappingURL=single-token.d.ts.map