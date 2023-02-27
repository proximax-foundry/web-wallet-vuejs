import { InnerTransaction } from "./innerTxn";
import type { TxnExchangeOffer } from "../exchangeOffer";

export class InnerExchangeTransaction extends InnerTransaction{

  exchangeOffers: TxnExchangeOffer[] = [];
  isTakingOffer: boolean = false;

  constructor(){
    super();
  }
}