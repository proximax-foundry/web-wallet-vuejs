import { 
    ChainConfigHttp, ChainConfig, RequestOptions
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class ChainConfigAPI {

    chainConfigHttp: ChainConfigHttp;
    requestOptions: RequestOptions | undefined = undefined;

    constructor(endpoint: string){
        this.chainConfigHttp = new ChainConfigHttp(endpoint);
    }

    getChainConfig(height: number): Promise<ChainConfig>{
        let authHeader = this.requestOptions ? this.requestOptions : RequestAuth.getAuthHeader();
        return lastValueFrom(this.chainConfigHttp.getChainConfig(height, authHeader));
    }

}