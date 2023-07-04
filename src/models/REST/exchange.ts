import { 
    ExchangeHttp, NetworkHttp,
    Address, PublicAccount, MosaicId,
    ExchangeOfferType, MosaicExchange, AccountExchanges
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class ExchangeAPI {

    exchangeHttp: ExchangeHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.exchangeHttp = new ExchangeHttp(endpoint, networkHttp);
    }

    getAccountExchanges(accountId: Address | PublicAccount): Promise<AccountExchanges>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.exchangeHttp.getAccountExchanges(accountId, authHeader))
    }

    getExchangeOffers(offerType: ExchangeOfferType, mosaicId: MosaicId): Promise<MosaicExchange[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.exchangeHttp.getExchangeOffers(offerType, mosaicId, authHeader))
    }

    getExchangeList(): Promise<MosaicId[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.exchangeHttp.getOfferList(authHeader))
    }
}