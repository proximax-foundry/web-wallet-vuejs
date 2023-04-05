import {
  MosaicHttp,
  NetworkHttp,
  MosaicQueryParams,
  MosaicSearch,
  MosaicId,
  MosaicInfo,
  MosaicNames,
  RichlistEntry,
  PageQueryParams,
  MosaicLevy,
} from "tsjs-xpx-chain-sdk";
import { RequestAuth } from "./auth";

export class AssetAPI {
  mosaicHttp: MosaicHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.mosaicHttp = new MosaicHttp(endpoint, networkHttp);
  }

  getMosaic(mosaicId: MosaicId): Promise<MosaicInfo> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.mosaicHttp.getMosaic(mosaicId, authHeader).toPromise();
  }

  getMosaicRichlist(
    mosaicId: MosaicId,
    queryParams?: PageQueryParams
  ): Promise<RichlistEntry[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.mosaicHttp
      .getMosaicRichlist(mosaicId, queryParams, authHeader)
      .toPromise();
  }

  getMosaics(mosaicIds: MosaicId[]): Promise<MosaicInfo[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.mosaicHttp.getMosaics(mosaicIds, authHeader).toPromise();
  }

  getMosaicsNames(mosaicIds: MosaicId[]): Promise<MosaicNames[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.mosaicHttp.getMosaicsNames(mosaicIds, authHeader).toPromise();
  }

  getMosaicLevy(mosaicId: MosaicId): Promise<MosaicLevy> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.mosaicHttp.getMosaicLevy(mosaicId, authHeader).toPromise();
  }

  searchMosaics(queryParams: MosaicQueryParams): Promise<MosaicSearch> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.mosaicHttp.searchMosaics(queryParams, authHeader).toPromise();
  }
}
