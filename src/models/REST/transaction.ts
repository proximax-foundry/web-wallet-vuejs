import { 
    TransactionHttp,
    SignedTransaction, CosignatureSignedTransaction,
    TransactionAnnounceResponse, Transaction, TransactionStatus, TransferTransaction
} from "tsjs-xpx-chain-sdk";

export class TransactionAPI {

    transactionHttp: TransactionHttp;

    constructor(endpoint: string){
        this.transactionHttp = new TransactionHttp(endpoint);
    }

    announce(signedTransaction: SignedTransaction): Promise<TransactionAnnounceResponse>{
        return this.transactionHttp.announce(signedTransaction).toPromise();
    }

    announceAggregateBonded(signedTransaction: SignedTransaction): Promise<TransactionAnnounceResponse>{
        return this.transactionHttp.announceAggregateBonded(signedTransaction).toPromise();
    }

    announceAggregateBondedCosignature(cosignatureSignedTransaction: CosignatureSignedTransaction): Promise<TransactionAnnounceResponse>{
        return this.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransaction(transactionId: string): Promise<Transaction>{
        return this.transactionHttp.getTransaction(transactionId).toPromise();
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     *
     */
    getTransactions(transactionIds: string[]): Promise<Transaction[]>{
        return this.transactionHttp.getTransactions(transactionIds).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransactionEffectiveFee(transactionId: string): Promise<number>{
        return this.transactionHttp.getTransactionEffectiveFee(transactionId).toPromise();
    }

    getTransactionStatus(transactionHash: string): Promise<TransactionStatus>{
        return this.transactionHttp.getTransactionStatus(transactionHash).toPromise();
    }

    getTransactionsStatuses(transactionHashes: string[]): Promise<TransactionStatus[]>{
        return this.transactionHttp.getTransactionsStatuses(transactionHashes).toPromise();
    }
}