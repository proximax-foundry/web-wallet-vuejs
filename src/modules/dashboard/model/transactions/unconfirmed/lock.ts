import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedLockTransaction extends UnconfirmedTransaction{

    lockHash: string = "";
    duration: number = 0;
    expired: boolean = null;
    isRefunded: boolean = null;
  
    constructor(txnHash: string){
      super(txnHash);
    }
}