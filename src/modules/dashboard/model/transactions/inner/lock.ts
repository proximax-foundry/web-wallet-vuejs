import { InnerTransaction } from "./innerTxn";

export class InnerLockTransaction extends InnerTransaction {
  lockHash: string = "";
  duration: number = 0;
  expired: boolean | null = null;
  isRefunded: boolean | null = null;
  amountLocking: number = 0;

  constructor() {
    super();
  }
}
