import { InnerTransaction } from "./innerTxn";

export class InnerAccountTransaction extends InnerTransaction {
  approvalDelta: number = 0;
  removalDelta: number = 0;
  oldApprovalNumber?: number | null = null;
  oldRemovalNumber?: number | null = null;
  addedCosigner: string[] = [];
  removedCosigner: string[] = [];
  modifyingAccountPublicKey: string = "";

  constructor() {
    super();
  }
}
