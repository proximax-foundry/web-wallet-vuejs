import { 
    AccountHttp, NetworkHttp,
    Address, PublicAccount, QueryParams,
    MultisigAccountGraphInfo, MultisigAccountInfo,
    AccountInfo,
    AggregateTransaction, Transaction, 
    AccountRestrictionsInfo, AccountNames, TransactionQueryParams
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';

export class AccountAPI {

    accountHttp: AccountHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.accountHttp = new AccountHttp(endpoint, networkHttp);
    }

    getAccountInfo(address: Address): Promise<AccountInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getAccountInfo(address, authHeader).toPromise();
    }

    aggregateBondedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<AggregateTransaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.aggregateBondedTransactions(publicAccount, queryParams, authHeader).toPromise();
    }

    getAccountRestrictions(address: Address): Promise<AccountRestrictionsInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getAccountRestrictions(address, authHeader).toPromise();
    }

    getAccountRestrictionsFromAccounts(addresses: Address[]): Promise<AccountRestrictionsInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getAccountRestrictionsFromAccounts(addresses, authHeader).toPromise();
    }

    getAccountsInfo(addresses: Address[]): Promise<AccountInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getAccountsInfo(addresses, authHeader).toPromise();
    }
    
    getAccountsNames(addresses: Address[]): Promise<AccountNames[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getAccountsNames(addresses, authHeader).toPromise();
    }

    getMultisigAccountGraphInfo(address: Address): Promise<MultisigAccountGraphInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getMultisigAccountGraphInfo(address, authHeader).toPromise();
    }

    getMultisigAccountInfo(address: Address): Promise<MultisigAccountInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.getMultisigAccountInfo(address, authHeader).toPromise();
    }

    transactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.transactions(publicAccount, queryParams, authHeader).toPromise();
    }

    incomingTransactions(accountId: Address | PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.incomingTransactions(accountId, queryParams, authHeader).toPromise();
    }

    outgoingTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.outgoingTransactions(publicAccount, queryParams, authHeader).toPromise();
    }

    unconfirmedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return this.accountHttp.unconfirmedTransactions(publicAccount, queryParams, authHeader).toPromise();
    }
}

