import { 
    MosaicHttp, NetworkHttp,
    MosaicId, MosaicInfo, MosaicNames, RichlistEntry, PageQueryParams, MosaicLevy
} from "tsjs-xpx-chain-sdk";

export class AssetAPI {

    mosaicHttp: MosaicHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.mosaicHttp = new MosaicHttp(endpoint, networkHttp);
    }

    getMosaic(mosaicId: MosaicId): Promise<MosaicInfo>{
        return this.mosaicHttp.getMosaic(mosaicId).toPromise();
    }

    getMosaicRichlist(mosaicId: MosaicId, queryParams?: PageQueryParams): Promise<RichlistEntry[]>{
        return this.mosaicHttp.getMosaicRichlist(mosaicId, queryParams).toPromise();
    }

    getMosaics(mosaicIds: MosaicId[]): Promise<MosaicInfo[]>{
        return this.mosaicHttp.getMosaics(mosaicIds).toPromise();
    }

    getMosaicsNames(mosaicIds: MosaicId[]): Promise<MosaicNames[]>{
        return this.mosaicHttp.getMosaicsNames(mosaicIds).toPromise();
    }

    getMosaicLevy(mosaicId: MosaicId): Promise<MosaicLevy>{
        return this.mosaicHttp.getMosaicLevy(mosaicId).toPromise();
    }
}