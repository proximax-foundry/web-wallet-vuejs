export interface TxnExchangeOffer{
    assetId: string;
    assetNamespace?: string;
    amount?: number;
    amountIsRaw?: boolean; 
    cost?: number;
    type: string; // SELL_OFFER = 0, BUY_OFFER = 1
    owner?: string;
    duration?: number; 
}