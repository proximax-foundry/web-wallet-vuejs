import { 
    NetworkHttp, NetworkType
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class NetworkAPI {

    networkHttp: NetworkHttp;

    constructor(endpoint: string){
        this.networkHttp = new NetworkHttp(endpoint);
    }

    getNetworkType(): Promise<NetworkType>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.networkHttp.getNetworkType(authHeader));
    }
}