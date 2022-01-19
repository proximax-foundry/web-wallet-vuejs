import {SDA} from "../sda";
import { InnerTransaction } from "./innerTxn";

export class InnerTransferTransaction extends InnerTransaction{

    in_out: boolean | null = null;
    sender: string | null = null;
    recipient: string | null = null;
    recipientNamespaceId: string | null = null;
    recipientNamespaceName: string | null = null;    
    sda: SDA[] = [];
    amountTransfer: number = 0;
    message: string | null = null;
    messageType: number | null = null;
    messageTypeTitle?: string;
  
    constructor(){
      super();
    }
}