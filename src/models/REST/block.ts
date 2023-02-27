import {
  BlockHttp,
  NetworkHttp,
  LimitType,
  MerkleProofInfo,
  BlockInfo,
  Transaction,
  Statement,
} from "tsjs-xpx-chain-sdk";
import { RequestAuth } from "./auth";

export class BlockAPI {
  blockHttp: BlockHttp;

  constructor(endpoint: string, networkHttp?: NetworkHttp) {
    this.blockHttp = new BlockHttp(endpoint, networkHttp);
  }

  getBlockByHeight(height: number): Promise<BlockInfo> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.blockHttp.getBlockByHeight(height, authHeader).toPromise();
  }

  getBlockReceipts(height: number): Promise<Statement> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.blockHttp.getBlockReceipts(height, authHeader).toPromise();
  }

  getBlockTransactions(height: number): Promise<Transaction[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.blockHttp
      .getBlockTransactions(height, undefined, authHeader)
      .toPromise();
  }

  getBlocksByHeightWithLimit(
    height: number,
    limitType?: LimitType
  ): Promise<BlockInfo[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.blockHttp
      .getBlocksByHeightWithLimit(height, limitType, authHeader)
      .toPromise();
  }

  /**
   * @param height - The height of the block.
   * @param hash - The hash of the receipt statement or resolution.
   */
  getMerkleReceipts(height: number, hash: string): Promise<MerkleProofInfo> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.blockHttp
      .getMerkleReceipts(height, hash, authHeader)
      .toPromise();
  }

  /**
   * @param height - The height of the block.
   * @param hash - The hash of the transaction.
   */
  getMerkleTransaction(height: number, hash: string): Promise<MerkleProofInfo> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.blockHttp
      .getMerkleTransaction(height, hash, authHeader)
      .toPromise();
  }
}
