import { 
    ChainHttp, 
} from "tsjs-xpx-chain-sdk";

export class ChainAPI {

    chainHttp: ChainHttp;

    constructor(endpoint: string){
        this.chainHttp = new ChainHttp(endpoint);
    }

    getBlockchainHeight(){
        return this.chainHttp.getBlockchainHeight().toPromise().then((blockNum)=> blockNum.compact());
    }

    getBlockchainScore(){
        return this.chainHttp.getBlockchainScore().toPromise();
    }
}