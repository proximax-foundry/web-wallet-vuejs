import { 
    ChainHttp, BlockchainScore, RequestOptions, 
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class ChainAPI {

    chainHttp: ChainHttp;
    requestOptions: RequestOptions | undefined = undefined;

    constructor(endpoint: string){
        this.chainHttp = new ChainHttp(endpoint);
    }

    getBlockchainHeight(): Promise<number>{
        let authHeader = this.requestOptions ? this.requestOptions : RequestAuth.getAuthHeader();
        return lastValueFrom(this.chainHttp.getBlockchainHeight(authHeader)).then((blockNum)=> blockNum.compact());
    }

    getBlockchainScore(): Promise<BlockchainScore>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.chainHttp.getBlockchainScore(authHeader));
    }
}