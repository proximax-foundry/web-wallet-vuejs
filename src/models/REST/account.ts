import { 
    AccountHttp, NetworkHttp,
    Address, PublicAccount, 
    MultisigAccountGraphInfo, MultisigAccountInfo,
    AccountInfo,
    AggregateTransaction, Transaction, 
    AccountRestrictionsInfo, AccountNames, TransactionQueryParams
} from "tsjs-xpx-chain-sdk";
import {RequestAuth} from './auth';
import { lastValueFrom } from 'rxjs';
 
export class AccountAPI {

    accountHttp: AccountHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.accountHttp = new AccountHttp(endpoint, networkHttp);
    }

    getAccountInfo(address: Address): Promise<AccountInfo>{
        
        let authHeader = RequestAuth.getAuthHeader();
        return  lastValueFrom(this.accountHttp.getAccountInfo(address, authHeader)) ;
    }

    aggregateBondedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<AggregateTransaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.aggregateBondedTransactions(publicAccount, queryParams, authHeader));
    }

    getAccountRestrictions(address: Address): Promise<AccountRestrictionsInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.getAccountRestrictions(address, authHeader));
    }

    getAccountRestrictionsFromAccounts(addresses: Address[]): Promise<AccountRestrictionsInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.getAccountRestrictionsFromAccounts(addresses, authHeader));
    }

    getAccountsInfo(addresses: Address[]): Promise<AccountInfo[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.getAccountsInfo(addresses, authHeader));
    }
    
    getAccountsNames(addresses: Address[]): Promise<AccountNames[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.getAccountsNames(addresses, authHeader));
    }

    getMultisigAccountGraphInfo(address: Address): Promise<MultisigAccountGraphInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.getMultisigAccountGraphInfo(address, authHeader));
    }

    getMultisigAccountInfo(address: Address): Promise<MultisigAccountInfo>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.getMultisigAccountInfo(address, authHeader));
    }

    transactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.transactions(publicAccount, queryParams, authHeader));
    }

    incomingTransactions(accountId: Address | PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.incomingTransactions(accountId, queryParams, authHeader));
    }

    outgoingTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.outgoingTransactions(publicAccount, queryParams, authHeader));
    }

    unconfirmedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{
        let authHeader = RequestAuth.getAuthHeader();
        return lastValueFrom(this.accountHttp.unconfirmedTransactions(publicAccount, queryParams, authHeader));
    }
}

