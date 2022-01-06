import { UnconfirmedTransaction } from "./unconfirmedTransaction";
import { TransactionType, SecretProofTransaction } from "tsjs-xpx-chain-sdk";

export class UnconfirmedAliasTransaction extends UnconfirmedTransaction{

    aliasName: string = "";
    aliasType: number = 0;
    aliasTypeName: string = "";
    address?: string = "";
    assetId?: string = "";
  
    constructor(txnHash: string){
      super(txnHash);
    }
}