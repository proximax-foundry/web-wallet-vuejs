import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedSecretTransaction extends ConfirmedTransaction {
  secret: string = "";
  hashType: string = "";
  proof?: string = "";
  recipient: string = "";
  assetId?: string | null = null;
  namespaceName?: string = "";
  isSendWithNamespace: boolean = false;
  amount: number = 0;
  amountIsRaw: boolean = true;
  duration: number = 0;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
