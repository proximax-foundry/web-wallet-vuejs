import { firstValueFrom } from "rxjs";
import {
  PaginationQueryParams,
  HarvesterHttp,
  Address,
  PublicAccount,
  HarvesterInfo,
  HarvesterSearch
} from "tsjs-xpx-chain-sdk";

export class HarvesterAPI {
  harvesterHttp: HarvesterHttp;

  constructor(endpoint: string) {
    this.harvesterHttp = new HarvesterHttp(endpoint);
  }

  /**
   * Get account harvesters info
   * @param accountId - account Id.
   */
  getAccountHarvestingHarvesterInfo(accountId: Address | PublicAccount): Promise<HarvesterInfo[]> {
    return firstValueFrom(this.harvesterHttp.getAccountHarvestingHarvesterInfo(accountId));
  }

  /**
   * Search harvesters
   * @param qp - Pagination query params.
   */
  searchHarvesters(qp: PaginationQueryParams): Promise<HarvesterSearch> {
    return firstValueFrom(this.harvesterHttp
      .searchHarvesters(qp));
  }

}