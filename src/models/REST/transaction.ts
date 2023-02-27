import {
  TransactionHttp,
  SignedTransaction,
  CosignatureSignedTransaction,
  TransactionAnnounceResponse,
  Transaction,
  TransactionStatus,
  TransactionGroupType,
  TransactionQueryParams,
  TransactionType,
  TransactionSearch,
  TransactionCount,
} from "tsjs-xpx-chain-sdk";
import { RequestAuth } from "./auth";
import { AppState } from "../../state/appState";
import { AppStateUtils } from "@/state/utils/appStateUtils";

export class TransactionAPI {
  transactionHttp: TransactionHttp;

  constructor(endpoint: string) {
    this.transactionHttp = new TransactionHttp(endpoint);
  }

  announce(
    signedTransaction: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    const txnHash = signedTransaction.hash;

    if (!AppState.txnActivityLog.find((x) => x.txnHash === txnHash)) {
      AppState.txnActivityLog.push({
        accPubKey: signedTransaction.signer,
        announced: true,
        relatedAddress: [],
        txnHash: txnHash,
        status: "",
        statusMsg: "",
        checkedNum: 0,
      });

      AppStateUtils.updateActivityLogNum();
    }
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .announce(signedTransaction, authHeader)
      .toPromise();
  }

  announceAggregateBonded(
    signedTransaction: SignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    const txnHash = signedTransaction.hash;

    if (!AppState.txnActivityLog.find((x) => x.txnHash === txnHash)) {
      AppState.txnActivityLog.push({
        accPubKey: signedTransaction.signer,
        announced: true,
        relatedAddress: [],
        txnHash: txnHash,
        status: "",
        statusMsg: "",
        checkedNum: 0,
      });

      AppStateUtils.updateActivityLogNum();
    }
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .announceAggregateBonded(signedTransaction, authHeader)
      .toPromise();
  }

  announceAggregateBondedCosignature(
    cosignatureSignedTransaction: CosignatureSignedTransaction
  ): Promise<TransactionAnnounceResponse> {
    const txnHash = cosignatureSignedTransaction.parentHash;

    const existingTxnCosignLog = AppState.txnCosignLog.find(
      (x) => x.txnHash === txnHash
    );
    if (!existingTxnCosignLog) {
      AppState.txnCosignLog.push({
        accPubKey: [cosignatureSignedTransaction.signer],
        announced: true,
        relatedAddress: [],
        txnHash: txnHash,
        status: "",
        statusMsg: "",
        checkedNum: 0,
      });

      AppStateUtils.addCosignLogNum();
    } else {
      existingTxnCosignLog.accPubKey.push(cosignatureSignedTransaction.signer);
      AppStateUtils.addCosignLogNum();
    }
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .announceAggregateBondedCosignature(
        cosignatureSignedTransaction,
        authHeader
      )
      .toPromise();
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getTransaction(transactionId: string): Promise<Transaction> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getTransaction(transactionId, authHeader)
      .toPromise();
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getUnconfirmedTransaction(transactionId: string): Promise<Transaction> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getUnconfirmedTransaction(transactionId, authHeader)
      .toPromise();
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getPartialTransaction(transactionId: string): Promise<Transaction> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getPartialTransaction(transactionId, authHeader)
      .toPromise();
  }

  /**
   * Gets an array of transactions for different transaction ids
   * @param transactionIds - Array of transactions id and/or hash.
   *
   */
  getTransactions(transactionIds: string[]): Promise<Transaction[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getTransactions(transactionIds, undefined, authHeader)
      .toPromise();
  }

  /**
   * Gets a transaction for a transactionId
   * @param transactionId - Transaction id or hash.
   */
  getTransactionEffectiveFee(transactionId: string): Promise<number> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getTransactionEffectiveFee(transactionId, authHeader)
      .toPromise();
  }

  getTransactionStatus(transactionHash: string): Promise<TransactionStatus> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getTransactionStatus(transactionHash, authHeader)
      .toPromise();
  }

  getTransactionsStatuses(
    transactionHashes: string[]
  ): Promise<TransactionStatus[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getTransactionsStatuses(transactionHashes, authHeader)
      .toPromise();
  }

  searchTransactions(
    transactionGroupType: TransactionGroupType,
    transactionQueryParams?: TransactionQueryParams
  ): Promise<TransactionSearch> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .searchTransactions(
        transactionGroupType,
        transactionQueryParams,
        authHeader
      )
      .toPromise();
  }

  getTransactionsCount(
    transactionTypes: TransactionType[],
    transactionGroupType: TransactionGroupType
  ): Promise<TransactionCount[]> {
    const authHeader = RequestAuth.getAuthHeader();
    return this.transactionHttp
      .getTransactionsCount(transactionTypes, transactionGroupType, authHeader)
      .toPromise();
  }
}
