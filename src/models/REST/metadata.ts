import { 
    MetadataHttp, NetworkHttp,
    MosaicId, NamespaceId
} from "tsjs-xpx-chain-sdk";

export class MetadataAPI {

    metadataHttp: MetadataHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.metadataHttp = new MetadataHttp(endpoint, networkHttp);
    }

    /**
     * Gets the Metadata for a given accountId
     * @param accountId - Account address/public key
     *
     */
    getAccountMetadata(accountId: string){
        return this.metadataHttp.getAccountMetadata(accountId).toPromise();
    }

    getMosaicMetadata(mosaicId: MosaicId){
        return this.metadataHttp.getMosaicMetadata(mosaicId).toPromise();
    }

    getNamespaceMetadata(namespaceId: NamespaceId){
        return this.metadataHttp.getNamespaceMetadata(namespaceId).toPromise();
    }
}