import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedAssetTransaction extends ConfirmedTransaction {
  assetId: string = "";
  nonce?: number | null = null;
  namespaceName?: string | null = null;
  levyAssetId?: string | null = null;
  levyAssetAmount?: number | null = null;
  levyAssetAmountIsRaw?: boolean | null = null;
  levyType?: number | null = null;
  levyRecipient?: string | null = null;
  levyAssetName?: string | null = null;
  supplyDelta?: number | null = null;
  supplyDeltaIsRaw?: boolean | null = null;
  divisibility?: number | null = null;
  transferable?: boolean | null = null;
  supplyMutable?: boolean | null = null;
  duration?: number | null = null;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
