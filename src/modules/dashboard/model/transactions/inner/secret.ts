import { InnerTransaction } from "./innerTxn";

export class InnerSecretTransaction extends InnerTransaction{

    secret: string = "";
    hashType: string = "";
    proof?: string = "";
    recipient: string = "";
    assetId?: string = null;
    namespaceName?: string = "";
    isSendWithNamespace: boolean = false;
    amount: number = 0;
    amountIsRaw: boolean = true;
    duration: number = 0;

    constructor(){
      super();
    }
}