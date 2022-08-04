import { 
    ChainHttp, BlockchainScore, RequestOptions, 
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class ChainAPI {

    chainHttp: ChainHttp;
    requestOptions: RequestOptions | undefined = undefined;

    constructor(endpoint: string){
        this.chainHttp = new ChainHttp(endpoint);
    }

    getBlockchainHeight(): Promise<number>{
        let authHeader = this.requestOptions ? this.requestOptions : RequestAuth.getAuthHeader();
        return this.chainHttp.getBlockchainHeight(authHeader).toPromise().then((blockNum)=> blockNum.compact());
    }

    getBlockchainScore(): Promise<BlockchainScore>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.chainHttp.getBlockchainScore(authHeader).toPromise();
    }
}