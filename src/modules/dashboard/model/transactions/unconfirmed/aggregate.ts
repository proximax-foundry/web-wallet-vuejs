import { UnconfirmedTransaction } from "./unconfirmedTransaction";
import { TxnList } from "../txnList";

export class UnconfirmedAggregateTransaction extends UnconfirmedTransaction{

    aggregateLength?: number = 0;
    txnList: TxnList[] = [];
  
    constructor(txnHash: string){
      super(txnHash);
    }
}