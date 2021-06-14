import { 
    NetworkHttp
} from "tsjs-xpx-chain-sdk";

export class NetworkAPI {

    networkHttp: NetworkHttp;

    constructor(endpoint: string){
        this.networkHttp = new NetworkHttp(endpoint);
    }

    getNetworkType(){
        return this.networkHttp.getNetworkType().toPromise();
    }
}