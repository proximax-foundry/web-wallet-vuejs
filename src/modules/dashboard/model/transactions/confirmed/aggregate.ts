import { ConfirmedTransaction } from "./confirmedTransaction";
import { TxnList } from "../txnList";

export class ConfirmedAggregateTransaction extends ConfirmedTransaction{

    aggregateLength?: number = 0;
    txnList: TxnList[] = [];
  
    constructor(txnHash: string){
      super(txnHash);
    }
}