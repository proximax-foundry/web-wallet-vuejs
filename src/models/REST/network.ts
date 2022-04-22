import { 
    NetworkHttp, NetworkType
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class NetworkAPI {

    networkHttp: NetworkHttp;

    constructor(endpoint: string){
        this.networkHttp = new NetworkHttp(endpoint);
    }

    getNetworkType(): Promise<NetworkType>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.networkHttp.getNetworkType(authHeader).toPromise();
    }
}