import { PartialTransaction } from "./partialTransaction";

export class PartialAliasTransaction extends PartialTransaction{

    aliasName: string = "";
    aliasType: number = 0;
    aliasTypeName: string = "";
    address?: string = "";
    assetId?: string = "";
  
    constructor(txnHash: string){
      super(txnHash);
    }
}