import { 
    BlockHttp, NetworkHttp,
    LimitType, 
    MerkleProofInfo, BlockInfo, Transaction, Statement
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
export class BlockAPI {

    blockHttp: BlockHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.blockHttp = new BlockHttp(endpoint, networkHttp);
    }

    getBlockByHeight(height: number): Promise<BlockInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.blockHttp.getBlockByHeight(height, authHeader));
    }
    
    getBlockReceipts(height: number): Promise<Statement>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.blockHttp.getBlockReceipts(height, authHeader));
    }

    getBlockTransactions(height: number): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.blockHttp.getBlockTransactions(height, undefined, authHeader));
    }

    getBlocksByHeightWithLimit(height: number, limitType?:LimitType): Promise<BlockInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.blockHttp.getBlocksByHeightWithLimit(height, limitType, authHeader));
    }

    /**
     * @param height - The height of the block.
     * @param hash - The hash of the receipt statement or resolution.
     */
    getMerkleReceipts(height: number, hash: string): Promise<MerkleProofInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.blockHttp.getMerkleReceipts(height, hash, authHeader));
    }

    /**
     * @param height - The height of the block.
     * @param hash - The hash of the transaction.
     */
    getMerkleTransaction(height: number, hash: string): Promise<MerkleProofInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.blockHttp.getMerkleTransaction(height, hash, authHeader));
    }
}