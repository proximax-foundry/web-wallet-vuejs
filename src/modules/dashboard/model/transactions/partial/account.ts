import { PartialTransaction } from "./partialTransaction";

export class PartialAccountTransaction extends PartialTransaction{

    approvalDelta: number = 0;
    removalDelta: number = 0;
    oldApprovalNumber?: number = null;
    oldRemovalNumber?: number = null;
    addedCosigner: string[] = [];
    removedCosigner: string[] = [];
    modifyingAccountPublicKey: string = "";
  
    constructor(txnHash: string){
      super(txnHash);
    }
}