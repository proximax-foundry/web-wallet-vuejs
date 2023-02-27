import type { AggregateTransaction } from "tsjs-xpx-chain-sdk";
import type { RowDashboardTip, OtherAsset } from "../model/dashboardClasses";

export interface DashboardTransaction{
  id?: string,
  typeName: string,
  inOutType?: string,
  signerName?: string | null,
  signerAddress: string,
  signerAddressPretty: string,
  signer: string, // publicKey
  signerDisplay: string,
  hash?: string | null,
  timestamp?: number | null,
  block?: number | null,
  fee?: number,
  spend?: number,
  innerTransactions?: DashboardInnerTransaction[],
  formattedDeadline?: string | null,
  relatedAddress: string[],
  relatedAsset: string[],
  relatedNamespace: string[],
  relatedPublicKey: string[],
  size: number,
  searchString: string[],
  transferList?: TransferList[],
  extractedData: any,
  displayList?: Map<string, string>,
  displayTips: RowDashboardTip[] | null,
  cosignatures?: TransactionCosigner | null,
  signedPublicKeys: string[],
  recipient?: string,
  amount?: number,
  maxFee?: number,
  otherAssets?: OtherAsset[],
}

export interface TransactionCosigner{
  cosigners: PublicAccountSimple[];
}

export interface PublicAccountSimple{
  publicKey: string;
  address: string;
}

export interface DashboardInnerTransaction{
  typeName: string,
  signerName?: string | null,
  signerAddress: string,
  signer: string, // publicKey
  transferList?: TransferList[],
  relatedAddress: string[],
  relatedAsset: string[],
  relatedNamespace: string[],
  relatedPublicKey: string[],
  searchString: string[],
  spend? : number,
  extractedData: any,
  displayList?: Map<string, string>,
  displayTips: RowDashboardTip[] | null,
  signerPublicKeys: string[],
  directParent?: string[],
  numToApprove?: number,
  otherAssets?: OtherAsset[],
}

/*
export interface MapValue{
  value: string;
  url?: string; 
  subValue?: string
}
*/

export interface Tip{
  displayValue: string,
  type: string,
  event: string,
  value: string
}

export interface CompleteTip{
  tips: Tip[]
}

export interface DataList{
  key: string;
  value: string;
}

export interface TransferList{
  from: string;
  to: string;
  sendingType: string;
  toType: string;
  value: string;
  valueDisplay: string;
  amount?: number
}

export interface PartialTransaction{
  cosigner: string[],
  signer: string,
  signerName?: string | null,
  formattedDeadline: string,
  data: AggregateTransaction,
  signedPublicKey: string[],
  hash: string,
  innerTransaction: DashboardInnerTransaction[],
  relatedAddress: string[],
  relatedAsset: string[],
  relatedNamespace: string[],
  relatedPublicKey: string[],
}
