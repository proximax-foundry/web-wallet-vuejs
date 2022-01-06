import {SDA} from "../sda";
import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedTransferTransaction extends ConfirmedTransaction{

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
  
    constructor(txnHash: string){
      super(txnHash);
    }
  }