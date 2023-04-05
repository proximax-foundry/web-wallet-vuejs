import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedLockTransaction extends UnconfirmedTransaction {
  lockHash: string = "";
  duration: number = 0;
  expired: boolean | null = null;
  isRefunded: boolean | null = null;
  amountLocking: number = 0;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
