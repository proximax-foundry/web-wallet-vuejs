import { AggregateTransaction } from "tsjs-xpx-chain-sdk";

export interface DashboardTransaction{
  id?: string,
  typeName: string,
  inOutType?: string,
  signerName?: string | null,
  signerAddress: string,
  signer: string, // publicKey
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
  transferList?: TransferList[];
  dataList: Map<string, any>;
  displayList?: Map<string, string>;
}

export interface DashboardInnerTransaction{
  typeName: string,
  signerName?: string | null,
  signerAddress: string,
  signer: string, // publicKey
  dataList: Map<string, any>;
  transferList?: TransferList[];
  relatedAddress: string[],
  relatedAsset: string[],
  relatedNamespace: string[],
  relatedPublicKey: string[],
  searchString: string[],
  spend? : number,
  displayList?: Map<string, string>;
}

/*
export interface MapValue{
  value: string;
  url?: string; 
  subValue?: string
}
*/

export interface DataList{
  key: string;
  value: string;
}

export interface TransferList{
  from: string;
  to: string;
  toType: string;
  valueType: string;
  value: string;
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
