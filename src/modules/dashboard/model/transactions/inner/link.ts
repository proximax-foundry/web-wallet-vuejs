import { InnerTransaction } from "./innerTxn";

export class InnerLinkTransaction extends InnerTransaction{

    remotePublicKey: string = "";
    action: string = "";
  
    constructor(){
      super();
    }
}