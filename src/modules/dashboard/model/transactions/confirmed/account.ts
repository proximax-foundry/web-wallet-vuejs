import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedAccountTransaction extends ConfirmedTransaction {
  approvalDelta: number = 0;
  removalDelta: number = 0;
  oldApprovalNumber?: number | null = null;
  oldRemovalNumber?: number | null = null;
  addedCosigner: string[] = [];
  removedCosigner: string[] = [];
  modifyingAccountPublicKey: string = "";

  constructor(txnHash: string) {
    super(txnHash);
  }
}
