import { 
    ChainConfigHttp, ChainConfig
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class ChainConfigAPI {

    chainConfigHttp: ChainConfigHttp;

    constructor(endpoint: string){
        this.chainConfigHttp = new ChainConfigHttp(endpoint);
    }

    getChainConfig(height: number): Promise<ChainConfig>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.chainConfigHttp.getChainConfig(height, authHeader).toPromise();
    }

}