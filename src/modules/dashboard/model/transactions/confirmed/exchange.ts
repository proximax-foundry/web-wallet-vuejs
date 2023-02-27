import { ConfirmedTransaction } from "./confirmedTransaction";
import type { TxnExchangeOffer } from "../exchangeOffer";

export class ConfirmedExchangeTransaction extends ConfirmedTransaction {
  exchangeOffers: TxnExchangeOffer[] = [];
  isTakingOffer: boolean = false;

  constructor(txnHash: string) {
    super(txnHash);
  }
}
