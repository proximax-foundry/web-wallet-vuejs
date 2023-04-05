import { ConfirmedTransaction } from "./confirmedTransaction";
import type { TxnList } from "../txnList";

export class ConfirmedAggregateTransaction extends ConfirmedTransaction {
  aggregateLength?: number = 0;
  txnList: TxnList[] = [];
  cosigners: string[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}
