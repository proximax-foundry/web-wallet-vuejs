import { 
    TransactionHttp,
    SignedTransaction, CosignatureSignedTransaction
} from "tsjs-xpx-chain-sdk";

export class TransactionAPI {

    transactionHttp: TransactionHttp;

    constructor(endpoint: string){
        this.transactionHttp = new TransactionHttp(endpoint);
    }

    announce(signedTransaction: SignedTransaction){
        return this.transactionHttp.announce(signedTransaction).toPromise();
    }

    announceAggregateBonded(signedTransaction: SignedTransaction){
        return this.transactionHttp.announceAggregateBonded(signedTransaction).toPromise();
    }

    announceAggregateBondedCosignature(cosignatureSignedTransaction: CosignatureSignedTransaction){
        return this.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransaction(transactionId: string){
        return this.transactionHttp.getTransaction(transactionId).toPromise();
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     *
     */
    getTransactions(transactionIds: string[]){
        return this.transactionHttp.getTransactions(transactionIds).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransactionEffectiveFee(transactionId: string){
        return this.transactionHttp.getTransactionEffectiveFee(transactionId).toPromise();
    }

    getTransactionStatus(transactionHash: string){
        return this.transactionHttp.getTransactionStatus(transactionHash).toPromise();
    }

    getTransactionsStatuses(transactionHashes: string[]){
        return this.transactionHttp.getTransactionsStatuses(transactionHashes).toPromise();
    }
}