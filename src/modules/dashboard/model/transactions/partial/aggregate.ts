import { PartialTransaction } from "./partialTransaction";
import type { TxnList } from "../txnList";

export class PartialAggregateTransaction extends PartialTransaction {
  aggregateLength?: number = 0;
  txnList: TxnList[] = [];
  cosigners: string[] = [];

  constructor(txnHash: string) {
    super(txnHash);
  }
}
