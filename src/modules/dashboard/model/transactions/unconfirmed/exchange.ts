import { UnconfirmedTransaction } from "./unconfirmedTransaction";
import { TxnExchangeOffer } from "../exchangeOffer";

export class UnconfirmedExchangeTransaction extends UnconfirmedTransaction{

  exchangeOffers: TxnExchangeOffer[] = [];
  isTakingOffer: boolean = false;

  constructor(txnHash: string){
    super(txnHash);
  }
}