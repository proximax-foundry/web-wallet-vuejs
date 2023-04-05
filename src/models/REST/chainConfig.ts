import {
  ChainConfigHttp,
  ChainConfig,
  RequestOptions,
} from "tsjs-xpx-chain-sdk";
import { RequestAuth } from "./auth";

export class ChainConfigAPI {
  chainConfigHttp: ChainConfigHttp;
  requestOptions: RequestOptions | undefined = undefined;

  constructor(endpoint: string) {
    this.chainConfigHttp = new ChainConfigHttp(endpoint);
  }

  getChainConfig(height: number): Promise<ChainConfig> {
    const authHeader = this.requestOptions
      ? this.requestOptions
      : RequestAuth.getAuthHeader();
    return this.chainConfigHttp.getChainConfig(height, authHeader).toPromise();
  }
}
