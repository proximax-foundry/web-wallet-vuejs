import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedAliasTransaction extends ConfirmedTransaction{

    aliasName: string = "";
    aliasType: number = 0;
    aliasTypeName: string = "";
    address?: string = "";
    assetId?: string = "";
  
    constructor(txnHash: string){
      super(txnHash);
    }
}