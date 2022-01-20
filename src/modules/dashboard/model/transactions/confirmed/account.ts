import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedAccountTransaction extends ConfirmedTransaction{

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