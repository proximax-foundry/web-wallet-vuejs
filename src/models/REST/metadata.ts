import { 
    MetadataHttp, NetworkHttp,
    MosaicId, NamespaceId, MetadataQueryParams,
    MetadataEntry, MetadataSearch
} from "tsjs-xpx-chain-sdk";

export class MetadataAPI {

    metadataHttp: MetadataHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.metadataHttp = new MetadataHttp(endpoint, networkHttp);
    }

    /**
     * Get the Metadata for a given compositeHash
     * @param compositeHash - compositeHash for Account/mosaic/namespace
     *
     */
    getMetadata(compositeHash: string): Promise<MetadataEntry>{
        return this.metadataHttp.getMetadata(compositeHash).toPromise();
    }

    getMetadatas(compositeHashes: string[]): Promise<MetadataEntry[]>{
        return this.metadataHttp.getMetadatas(compositeHashes).toPromise();
    }

    searchMetadatas(metadataQueryParams: MetadataQueryParams): Promise<MetadataSearch>{
        return this.metadataHttp.searchMetadata(metadataQueryParams).toPromise();
    }
}