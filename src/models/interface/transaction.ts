import { Transaction, AggregateTransaction } from "tsjs-xpx-chain-sdk";

export interface DashboardTransaction{
  typeName: string,
  inOutType: string,
  signerName?: string | null,
  signerAddress: string,
  recipientName?: string,
  recipientAddress?: string,
  signer: string, // publicKey
  data: Transaction,
  hash: string,
  timestamp?: number | null,
  block?: number | null,
  fee?: number,
  spend?: number,
  transferList: TransactionDetailList[],
  formattedDeadline?: string,
  relatedAddress: string[]
}

export interface TransactionDetailList{
  typeName?: string;
  from: string;
  to?: string;
  what?: string[];
}

export interface PartialTransaction{
  cosigner: string[],
  signer: string,
  formattedDeadline: string,
  data: AggregateTransaction,
  signedPublicKey: string[],
  hash: string,
  transferList: TransactionDetailList[],
  relatedAddress: string[]
}
