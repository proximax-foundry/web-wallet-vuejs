import { PartialTransaction } from "./partialTransaction";

export class PartialLinkTransaction extends PartialTransaction {
  remotePublicKey: string = "";
  action: string = "";

  constructor(txnHash: string) {
    super(txnHash);
  }
}
