import { InnerTransaction } from "./innerTxn";

export class InnerAssetTransaction extends InnerTransaction{

    assetId: string = "";
    nonce?: number = null;
    namespaceName? : string = null;
    levyAssetId?: string = null;
    levyAssetAmount?: number = null;
    levyAssetAmountIsRaw?: boolean = null;
    levyType?: number = null;
    levyRecipient?: string = null;
    levyAssetName?: string = null;
    supplyDelta?: number = null;
    supplyDeltaIsRaw?: boolean = null;
    divisibility?: number = null;
    transferable?: boolean = null;
    supplyMutable?: boolean = null;
    duration?: number = null;

    constructor(){
      super();
    }
}