import { UnconfirmedTransaction } from "./unconfirmedTransaction";
import { TxnList } from "../txnList";

export class UnconfirmedAggregateTransaction extends UnconfirmedTransaction{

    aggregateLength?: number = 0;
    txnList: TxnList[] = [];
    cosigners: string[] = [];
  
    constructor(txnHash: string){
      super(txnHash);
    }
}