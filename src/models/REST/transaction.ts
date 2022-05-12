import { 
    TransactionHttp,
    SignedTransaction, CosignatureSignedTransaction,
    TransactionAnnounceResponse, Transaction, TransactionStatus, TransactionGroupType,
    TransactionQueryParams, TransactionType, TransactionSearch, TransactionCount
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import {AppState} from '../../state/appState';

export class TransactionAPI {

    transactionHttp: TransactionHttp;

    constructor(endpoint: string){
        this.transactionHttp = new TransactionHttp(endpoint);
    }

    announce(signedTransaction: SignedTransaction): Promise<TransactionAnnounceResponse>{
        let txnHash = signedTransaction.hash;
        if(!AppState.trackingTxnHash.includes(txnHash)){
            AppState.trackingTxnHash.push(txnHash);
        }
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.announce(signedTransaction, authHeader).toPromise();
    }

    announceAggregateBonded(signedTransaction: SignedTransaction): Promise<TransactionAnnounceResponse>{
        let txnHash = signedTransaction.hash;
        if(!AppState.trackingTxnHash.includes(txnHash)){
            AppState.trackingTxnHash.push(txnHash);
        }
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.announceAggregateBonded(signedTransaction, authHeader).toPromise();
    }

    announceAggregateBondedCosignature(cosignatureSignedTransaction: CosignatureSignedTransaction): Promise<TransactionAnnounceResponse>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction, authHeader).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransaction(transactionId: string): Promise<Transaction>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getTransaction(transactionId, authHeader).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
     getUnconfirmedTransaction(transactionId: string): Promise<Transaction>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getUnconfirmedTransaction(transactionId, authHeader).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
     getPartialTransaction(transactionId: string): Promise<Transaction>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getPartialTransaction(transactionId, authHeader).toPromise();
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     *
     */
    getTransactions(transactionIds: string[]): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getTransactions(transactionIds, undefined, authHeader).toPromise();
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransactionEffectiveFee(transactionId: string): Promise<number>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getTransactionEffectiveFee(transactionId, authHeader).toPromise();
    }

    getTransactionStatus(transactionHash: string): Promise<TransactionStatus>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getTransactionStatus(transactionHash, authHeader).toPromise();
    }

    getTransactionsStatuses(transactionHashes: string[]): Promise<TransactionStatus[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getTransactionsStatuses(transactionHashes, authHeader).toPromise();
    }

    searchTransactions(transactionGroupType: TransactionGroupType, transactionQueryParams ?:TransactionQueryParams): Promise<TransactionSearch>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.searchTransactions(transactionGroupType, transactionQueryParams, authHeader).toPromise();
    }

    getTransactionsCount(transactionTypes: TransactionType[], transactionGroupType: TransactionGroupType): Promise<TransactionCount[]> {
        let authHeader = RequestAuth.getAuthHeader();
        return this.transactionHttp.getTransactionsCount(transactionTypes, transactionGroupType, authHeader).toPromise();
    }
}