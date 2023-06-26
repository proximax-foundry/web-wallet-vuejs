import { 
    TransactionHttp,
    SignedTransaction, CosignatureSignedTransaction,
    TransactionAnnounceResponse, Transaction, TransactionStatus, TransactionGroupType,
    TransactionQueryParams, TransactionType, TransactionSearch, TransactionCount
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import {AppState} from '../../state/appState';
import { AppStateUtils } from "@/state/utils/appStateUtils";
import { lastValueFrom } from 'rxjs';
export class TransactionAPI {

    transactionHttp: TransactionHttp;

    constructor(endpoint: string){
        this.transactionHttp = new TransactionHttp(endpoint);
    }

    announce(signedTransaction: SignedTransaction): Promise<TransactionAnnounceResponse>{
        let txnHash = signedTransaction.hash;

        if(!AppState.txnActivityLog.find(x => x.txnHash === txnHash)){
            AppState.txnActivityLog.push({
                accPubKey: signedTransaction.signer,
                announced: true,
                relatedAddress: [],
                txnHash: txnHash,
                status: "",
                statusMsg: "",
                checkedNum: 0
            });

            AppStateUtils.updateActivityLogNum();
        }
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.announce(signedTransaction, authHeader));
    }

    announceAggregateBonded(signedTransaction: SignedTransaction): Promise<TransactionAnnounceResponse>{
        let txnHash = signedTransaction.hash;

        if(!AppState.txnActivityLog.find(x => x.txnHash === txnHash)){
            AppState.txnActivityLog.push({
                accPubKey: signedTransaction.signer,
                announced: true,
                relatedAddress: [],
                txnHash: txnHash,
                status: "",
                statusMsg: "",
                checkedNum: 0
            });

            AppStateUtils.updateActivityLogNum();
        }
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.announceAggregateBonded(signedTransaction, authHeader));
    }

    announceAggregateBondedCosignature(cosignatureSignedTransaction: CosignatureSignedTransaction): Promise<TransactionAnnounceResponse>{
        let txnHash = cosignatureSignedTransaction.parentHash;

        let existingTxnCosignLog = AppState.txnCosignLog.find(x => x.txnHash === txnHash);
        if(!existingTxnCosignLog){
            AppState.txnCosignLog.push({
                accPubKey: [cosignatureSignedTransaction.signer],
                announced: true,
                relatedAddress: [],
                txnHash: txnHash,
                status: "",
                statusMsg: "",
                checkedNum: 0
            });

            AppStateUtils.addCosignLogNum();
        }
        else{
            existingTxnCosignLog.accPubKey.push(cosignatureSignedTransaction.signer);
            AppStateUtils.addCosignLogNum();
        }
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction, authHeader));
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransaction(transactionId: string): Promise<Transaction>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getTransaction(transactionId, authHeader));
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
     getUnconfirmedTransaction(transactionId: string): Promise<Transaction>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getUnconfirmedTransaction(transactionId, authHeader));
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
     getPartialTransaction(transactionId: string): Promise<Transaction>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getPartialTransaction(transactionId, authHeader));
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     *
     */
    getTransactions(transactionIds: string[]): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getTransactions(transactionIds, undefined, authHeader));
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     */
    getTransactionEffectiveFee(transactionId: string): Promise<number>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getTransactionEffectiveFee(transactionId, authHeader));
    }

    getTransactionStatus(transactionHash: string): Promise<TransactionStatus>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getTransactionStatus(transactionHash, authHeader));
    }

    getTransactionsStatuses(transactionHashes: string[]): Promise<TransactionStatus[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getTransactionsStatuses(transactionHashes, authHeader));
    }

    searchTransactions(transactionGroupType: TransactionGroupType, transactionQueryParams ?:TransactionQueryParams): Promise<TransactionSearch>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.searchTransactions(transactionGroupType, transactionQueryParams, authHeader));
    }

    getTransactionsCount(transactionTypes: TransactionType[], transactionGroupType: TransactionGroupType): Promise<TransactionCount[]> {
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.transactionHttp.getTransactionsCount(transactionTypes, transactionGroupType, authHeader));
    }
}