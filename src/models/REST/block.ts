import { 
    BlockHttp, NetworkHttp,
    LimitType, 
    MerkleProofInfo, BlockInfo, Transaction, Statement
} from "tsjs-xpx-chain-sdk";

export class BlockAPI {

    blockHttp: BlockHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.blockHttp = new BlockHttp(endpoint, networkHttp);
    }

    getBlockByHeight(height: number): Promise<BlockInfo>{
        return this.blockHttp.getBlockByHeight(height).toPromise();
    }
    
    getBlockReceipts(height: number): Promise<Statement>{
        return this.blockHttp.getBlockReceipts(height).toPromise();
    }

    getBlockTransactions(height: number): Promise<Transaction[]>{
        return this.blockHttp.getBlockTransactions(height).toPromise();
    }

    getBlocksByHeightWithLimit(height: number, limitType?:LimitType): Promise<BlockInfo[]>{
        return this.blockHttp.getBlocksByHeightWithLimit(height, limitType).toPromise();
    }

    /**
     * @param height - The height of the block.
     * @param hash - The hash of the receipt statement or resolution.
     */
    getMerkleReceipts(height: number, hash: string): Promise<MerkleProofInfo>{
        return this.blockHttp.getMerkleReceipts(height, hash).toPromise();
    }

    /**
     * @param height - The height of the block.
     * @param hash - The hash of the transaction.
     */
    getMerkleTransaction(height: number, hash: string): Promise<MerkleProofInfo>{
        return this.blockHttp.getMerkleTransaction(height, hash).toPromise();
    }
}