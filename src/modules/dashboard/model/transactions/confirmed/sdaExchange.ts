import { ConfirmedTransaction } from "./confirmedTransaction";

export class ConfirmedSdaExchangeTransaction extends ConfirmedTransaction{

  sdaExchange: TxnSdaExchange[] = [];

  constructor(txnHash: string){
    super(txnHash);
  }
}

export interface TxnSdaExchange {
  sdaIdGet: string;
  sdaIdGive: string;
  sdaGetNamespace?: string;
  sdaGiveNamespace?: string;
  amountGet?: number;
  amountGive?: number;
  duration?: number;
}