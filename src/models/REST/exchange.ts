import { 
    ExchangeHttp, NetworkHttp,
    Address, PublicAccount, MosaicId,
    ExchangeOfferType
} from "tsjs-xpx-chain-sdk";

export class ExchangeAPI {

    exchangeHttp: ExchangeHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.exchangeHttp = new ExchangeHttp(endpoint, networkHttp);
    }

    getAccountExchanges(accountId: Address | PublicAccount){
        return this.exchangeHttp.getAccountExchanges(accountId).toPromise();
    }

    getExchangeOffers(offerType: ExchangeOfferType, mosaicId: MosaicId){
        return this.exchangeHttp.getExchangeOffers(offerType, mosaicId).toPromise();
    }

}