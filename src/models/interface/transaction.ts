import { Transaction } from "tsjs-xpx-chain-sdk";

export interface ConfirmedTransaction extends Transaction{
  typeName: string,
  transferType: string,
  senderName: string,
  senderAddress: string,
  recipientName: string,
  recipientAddress: string,
  block: number,
  data: Transaction,
  hash: string,
}

export interface UnconfirmedTransaction extends Transaction{
  typeName: string,
  transferType: string,
  senderName: string,
  senderAddress: string,
  recipientNameL: string,
  recipientAddress: string,
  block: number,
  data: Transaction,
  hash: string,
}

export interface AggregateBondedTransaction extends Transaction{
  linkedAccountName: string,
  linkedAccount: string,
  account: string,
  formattedDeadline: Date,
  totalSigned: number, 
  isSigned: boolean,
  hash: string,
}

export interface contactInterface {
  address: string,
  name: string,
  id: number
}