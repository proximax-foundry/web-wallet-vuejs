import { CommonTransaction } from "../commonTransaction";

export class UnconfirmedTransaction extends CommonTransaction {
  groupType: string = "unconfirmed";

  constructor(txnHash: string) {
    super(txnHash);
  }

  static convertToSubClass(
    subclass: typeof UnconfirmedTransaction,
    instance: UnconfirmedTransaction
  ) {
    const newTxn = new subclass(instance.hash);

    Object.assign(newTxn, instance);
    return newTxn;
  }
}
