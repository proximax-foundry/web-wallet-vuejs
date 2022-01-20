import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedAccountTransaction extends UnconfirmedTransaction{

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