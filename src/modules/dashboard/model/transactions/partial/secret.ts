import { PartialTransaction } from "./partialTransaction";

export class PartialSecretTransaction extends PartialTransaction{

    secret: string = "";
    hashType: string = "";
    proof?: string = "";
    recipient: string = "";
    assetId: string = "";
    namespaceName?: string = "";
    amount: number = 0;
    amountIsRaw: boolean = true;
    duration: number = 0;

    constructor(txnHash: string){
      super(txnHash);
    }
}