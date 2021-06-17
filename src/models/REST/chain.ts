import { 
    ChainHttp, BlockchainScore, 
} from "tsjs-xpx-chain-sdk";

export class ChainAPI {

    chainHttp: ChainHttp;

    constructor(endpoint: string){
        this.chainHttp = new ChainHttp(endpoint);
    }

    getBlockchainHeight(): Promise<number>{
        return this.chainHttp.getBlockchainHeight().toPromise().then((blockNum)=> blockNum.compact());
    }

    getBlockchainScore(): Promise<BlockchainScore>{
        return this.chainHttp.getBlockchainScore().toPromise();
    }
}