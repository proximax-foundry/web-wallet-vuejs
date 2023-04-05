import { PartialTransaction } from "./partialTransaction";

export class PartialMetadataTransaction extends PartialTransaction {
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

  constructor(txnHash: string) {
    super(txnHash);
  }
}
