import { 
    MosaicHttp, NetworkHttp, MosaicQueryParams, MosaicSearch,
    MosaicId, MosaicInfo, MosaicNames, RichlistEntry, PageQueryParams, MosaicLevy
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class AssetAPI {

    mosaicHttp: MosaicHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.mosaicHttp = new MosaicHttp(endpoint, networkHttp);
    }

    getMosaic(mosaicId: MosaicId): Promise<MosaicInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.mosaicHttp.getMosaic(mosaicId, authHeader));
    }

    getMosaicRichlist(mosaicId: MosaicId, queryParams?: PageQueryParams): Promise<RichlistEntry[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.mosaicHttp.getMosaicRichlist(mosaicId, queryParams, authHeader));
    }

    getMosaics(mosaicIds: MosaicId[]): Promise<MosaicInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.mosaicHttp.getMosaics(mosaicIds, authHeader));
    }

    getMosaicsNames(mosaicIds: MosaicId[]): Promise<MosaicNames[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.mosaicHttp.getMosaicsNames(mosaicIds, authHeader));
    }

    getMosaicLevy(mosaicId: MosaicId): Promise<MosaicLevy>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.mosaicHttp.getMosaicLevy(mosaicId, authHeader));
    }

    searchMosaics(queryParams: MosaicQueryParams): Promise<MosaicSearch>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.mosaicHttp.searchMosaics(queryParams, authHeader));
    }
}