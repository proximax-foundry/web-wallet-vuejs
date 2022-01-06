import { 
    ExchangeHttp, NetworkHttp,
    Address, PublicAccount, MosaicId,
    ExchangeOfferType, MosaicExchange, AccountExchanges
} from "tsjs-xpx-chain-sdk";

export class ExchangeAPI {

    exchangeHttp: ExchangeHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.exchangeHttp = new ExchangeHttp(endpoint, networkHttp);
    }

    getAccountExchanges(accountId: Address | PublicAccount): Promise<AccountExchanges>{
        return this.exchangeHttp.getAccountExchanges(accountId).toPromise();
    }

    getExchangeOffers(offerType: ExchangeOfferType, mosaicId: MosaicId): Promise<MosaicExchange[]>{
        return this.exchangeHttp.getExchangeOffers(offerType, mosaicId).toPromise();
    }

    getExchangeList(): Promise<MosaicId[]>{
        return this.exchangeHttp.getOfferList().toPromise();
    }
}