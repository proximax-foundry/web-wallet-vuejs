import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedLockTransaction extends ConfirmedTransaction{

    lockHash: string = "";
    duration: number = 0;
    expired: boolean = null;
    isRefunded: boolean = null;
  
    constructor(txnHash: string){
      super(txnHash);
    }
}