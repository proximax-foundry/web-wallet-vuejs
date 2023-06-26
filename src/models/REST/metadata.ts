import { 
    MetadataHttp, NetworkHttp,
     MetadataQueryParams,
    MetadataEntry, MetadataSearch
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
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
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.metadataHttp.getMetadata(compositeHash, authHeader));
    }

    getMetadatas(compositeHashes: string[]): Promise<MetadataEntry[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.metadataHttp.getMetadatas(compositeHashes, authHeader));
    }

    searchMetadatas(metadataQueryParams: MetadataQueryParams): Promise<MetadataSearch>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.metadataHttp.searchMetadata(metadataQueryParams, authHeader));
    }
}