import { 
    ExchangeHttp, NetworkHttp,
    Address, PublicAccount, MosaicId,
    ExchangeOfferType, MosaicExchange, AccountExchanges
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class ExchangeAPI {

    exchangeHttp: ExchangeHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.exchangeHttp = new ExchangeHttp(endpoint, networkHttp);
    }

    getAccountExchanges(accountId: Address | PublicAccount): Promise<AccountExchanges | undefined>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.exchangeHttp.getAccountExchanges(accountId, authHeader).toPromise();
    }

    getExchangeOffers(offerType: ExchangeOfferType, mosaicId: MosaicId): Promise<MosaicExchange[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.exchangeHttp.getExchangeOffers(offerType, mosaicId, authHeader).toPromise();
    }

    getExchangeList(): Promise<MosaicId[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.exchangeHttp.getOfferList(authHeader).toPromise();
    }
}