import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedLinkTransaction extends UnconfirmedTransaction {
  remotePublicKey: string = "";
  action: string = "";

  constructor(txnHash: string) {
    super(txnHash);
  }
}
