import { UnconfirmedTransaction } from "./unconfirmedTransaction";

export class UnconfirmedSecretTransaction extends UnconfirmedTransaction{

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