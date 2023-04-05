import {
  MetadataHttp,
  NetworkHttp,
  MetadataQueryParams,
  MetadataEntry,
  MetadataSearch,
} from "tsjs-xpx-chain-sdk";
import { RequestAuth } from "./auth";

export class MetadataAPI {
  metadataHttp: MetadataHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.metadataHttp = new MetadataHttp(endpoint, networkHttp);
  }

  /**
   * Get the Metadata for a given compositeHash
   * @param compositeHash - compositeHash for Account/mosaic/namespace
   *
   */
  getMetadata(compositeHash: string): Promise<MetadataEntry> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.metadataHttp.getMetadata(compositeHash, authHeader).toPromise();
  }

  getMetadatas(compositeHashes: string[]): Promise<MetadataEntry[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.metadataHttp
      .getMetadatas(compositeHashes, authHeader)
      .toPromise();
  }

  searchMetadatas(
    metadataQueryParams: MetadataQueryParams
  ): Promise<MetadataSearch> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.metadataHttp
      .searchMetadata(metadataQueryParams, authHeader)
      .toPromise();
  }
}
