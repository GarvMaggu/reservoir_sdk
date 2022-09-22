import { Signer } from "@ethersproject/abstract-signer";
import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { TxData } from "../utils";
export declare class ModuleManager {
    chainId: number;
    contract: Contract;
    constructor(chainId: number);
    setApprovalForModule(signer: Signer, module: string, approved: boolean): Promise<ContractTransaction>;
    setApprovalForModuleTx(signer: string, module: string, approved: boolean): TxData;
}
//# sourceMappingURL=module-manager.d.ts.map