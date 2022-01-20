import { PartialTransaction } from "./partialTransaction";
import { TxnExchangeOffer } from "../exchangeOffer";

export class PartialExchangeTransaction extends PartialTransaction{

  exchangeOffers: TxnExchangeOffer[] = [];
  isTakingOffer: boolean = false;

  constructor(txnHash: string){
    super(txnHash);
  }
}