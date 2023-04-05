import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedAliasTransaction extends UnconfirmedTransaction {
  aliasName: string = "";
  aliasType: number = 0;
  aliasTypeName: string = "";
  address?: string = "";
  assetId?: string = "";

  constructor(txnHash: string) {
    super(txnHash);
  }
}
