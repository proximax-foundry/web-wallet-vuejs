import { firstValueFrom } from "rxjs";
import {
  StorageHttp,
  DriveQueryParams,
  ReplicatorQueryParams,
  DownloadChannelQueryParams,
  DriveInfo,
  DownloadChannel,
  Replicator,
  DriveInfoSearch,
  DownloadChannelSearch,
  ReplicatorSearch,
} from "tsjs-xpx-chain-sdk";

export class StorageAPI {
  storageHttp: StorageHttp;

  constructor(endpoint: string) {
    this.storageHttp = new StorageHttp(endpoint);
  }

  /**
   * Get drive info
   * @param accountId - account id.
   */
  getBcDrive(accountId: string): Promise<DriveInfo | undefined> {
    return firstValueFrom(this.storageHttp.getBcDrive(accountId));
  }

  /**
   * Get download channel
   * @param channelId - Channel id.
   */
  getDownloadChannel(channelId: string): Promise<DownloadChannel | undefined> {
    return firstValueFrom(this.storageHttp
      .getDownloadChannel(channelId));
  }

  /**
   * Get replicator from account
   * @param accountId - Transaction id or hash.
   */
  getReplicator(accountId: string): Promise<Replicator | undefined> {
    return firstValueFrom(this.storageHttp
      .getReplicator(accountId));
  }

  /**
   * Search drives info 
   * @param qp - Drive query params.
   */
  searchBcDrives(qp: DriveQueryParams): Promise<DriveInfoSearch> {
    return firstValueFrom(this.storageHttp
      .searchBcDrives(qp));
  }

  /**
   * Search download channels info 
   * @param qp - download channels query params.
   */
  searchDownloadChannels(qp: DownloadChannelQueryParams): Promise<DownloadChannelSearch> {
    return firstValueFrom(this.storageHttp
      .searchDownloadChannels(qp));
  }

  /**
   * Search replicators
   * @param qp - Replicators query params.
   */
  searchReplicators(qp: ReplicatorQueryParams): Promise<ReplicatorSearch> {
    return firstValueFrom(this.storageHttp
      .searchReplicators(qp));
  }

}