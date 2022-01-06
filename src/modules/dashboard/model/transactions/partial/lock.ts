import { PartialTransaction } from "./partialTransaction";

export class PartialLockTransaction extends PartialTransaction{

    lockHash: string = "";
    duration: number = 0;
    expired: boolean = null;
    isRefunded: boolean = null;
  
    constructor(txnHash: string){
      super(txnHash);
    }
}