import { 
      RequestOptions,NetworkConfigHttp,
      NetworkConfig
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class ChainConfigAPI {

    chainConfigHttp: NetworkConfigHttp;
    requestOptions: RequestOptions | undefined = undefined;

    constructor(endpoint: string){
        this.chainConfigHttp = new NetworkConfigHttp(endpoint);
    }

    getChainConfig(height: number): Promise<NetworkConfig>{
        let authHeader = this.requestOptions ? this.requestOptions : RequestAuth.getAuthHeader();
        return lastValueFrom(this.chainConfigHttp.getNetworkConfig(height, authHeader));
    }

}