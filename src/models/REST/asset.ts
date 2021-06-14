import { 
    MosaicHttp, NetworkHttp,
    MosaicId
} from "tsjs-xpx-chain-sdk";

export class AssetAPI {

    mosaicHttp: MosaicHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.mosaicHttp = new MosaicHttp(endpoint, networkHttp);
    }

    getMosaic(mosaicId: MosaicId){
        return this.mosaicHttp.getMosaic(mosaicId).toPromise();
    }

    getMosaicRichlist(mosaicId: MosaicId){
        return this.mosaicHttp.getMosaicRichlist(mosaicId);
    }

    getMosaics(mosaicIds: MosaicId[]){
        return this.mosaicHttp.getMosaics(mosaicIds).toPromise();
    }

    getMosaicsNames(mosaicIds: MosaicId[]){
        return this.mosaicHttp.getMosaicsNames(mosaicIds).toPromise();
    }
}