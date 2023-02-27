import { CommonTransaction } from "../commonTransaction";

export class PartialTransaction extends CommonTransaction {
  cosignedPublickKey: string[] = [];
  allCosignerPublicKey: string[] = [];
  pendingCosignPublicKey: string[] = [];
  groupType: string = "partial";

  constructor(txnHash: string) {
    super(txnHash);
  }

  static convertToSubClass(
    subclass: typeof PartialTransaction,
    instance: PartialTransaction
  ) {
    const newTxn = new subclass(instance.hash);

    Object.assign(newTxn, instance);
    return newTxn;
  }
}
