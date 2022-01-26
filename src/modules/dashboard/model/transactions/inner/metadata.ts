import { InnerTransaction } from "./innerTxn";

export class InnerMetadataTransaction extends InnerTransaction{

    metadataType: number = 0;
    metadataTypeName: string = "";
    scopedMetadataKey: string = "";
    targetPublicKey: string = "";
    targetId?: string = "";
    targetIdName?: string = "";
    sizeChanged: number = 0;
    valueChange: string = "";
    oldValue?: string = "";
    newValue?: string = "";
  
    constructor(){
      super();
    }
}