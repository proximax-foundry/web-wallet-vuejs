import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedLinkTransaction extends ConfirmedTransaction {
  remotePublicKey: string = "";
  action: string = "";

  constructor(txnHash: string) {
    super(txnHash);
  }
}
