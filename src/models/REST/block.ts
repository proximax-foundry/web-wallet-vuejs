import { 
    BlockHttp, NetworkHttp,
    LimitType
} from "tsjs-xpx-chain-sdk";

export class BlockAPI {

    blockHttp: BlockHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.blockHttp = new BlockHttp(endpoint, networkHttp);
    }

    getBlockByHeight(height: number){
        return this.blockHttp.getBlockByHeight(height).toPromise();
    }
    
    getBlockReceipts(height: number){
        return this.blockHttp.getBlockReceipts(height).toPromise();
    }

    getBlockTransactions(height: number){
        return this.blockHttp.getBlockTransactions(height).toPromise();
    }

    getBlocksByHeightWithLimit(height: number, limitType?:LimitType){
        return this.blockHttp.getBlocksByHeightWithLimit(height, limitType).toPromise();
    }

    /**
     * @param height - The height of the block.
     * @param hash - The hash of the receipt statement or resolution.
     */
    getMerkleReceipts(height: number, hash: string){
        return this.blockHttp.getMerkleReceipts(height, hash).toPromise();
    }

    /**
     * @param height - The height of the block.
     * @param hash - The hash of the transaction.
     */
    getMerkleTransaction(height: number, hash: string){
        return this.blockHttp.getMerkleTransaction(height, hash).toPromise();
    }
}