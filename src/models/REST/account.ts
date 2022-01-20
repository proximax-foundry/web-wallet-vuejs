import { 
    AccountHttp, NetworkHttp,
    Address, PublicAccount, QueryParams,
    MultisigAccountGraphInfo, MultisigAccountInfo,
    AccountInfo,
    AggregateTransaction, Transaction, 
    AccountRestrictionsInfo, AccountNames, TransactionQueryParams
} from "tsjs-xpx-chain-sdk";

export class AccountAPI {

    accountHttp: AccountHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.accountHttp = new AccountHttp(endpoint, networkHttp);
    }

    getAccountInfo(address: Address): Promise<AccountInfo>{
        return this.accountHttp.getAccountInfo(address).toPromise();
    }

    aggregateBondedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<AggregateTransaction[]>{

        return this.accountHttp.aggregateBondedTransactions(publicAccount, queryParams).toPromise();
    }

    getAccountRestrictions(address: Address): Promise<AccountRestrictionsInfo>{

        return this.accountHttp.getAccountRestrictions(address).toPromise();
    }

    getAccountRestrictionsFromAccounts(addresses: Address[]): Promise<AccountRestrictionsInfo[]>{

        return this.accountHttp.getAccountRestrictionsFromAccounts(addresses).toPromise();
    }

    getAccountsInfo(addresses: Address[]): Promise<AccountInfo[]>{

        return this.accountHttp.getAccountsInfo(addresses).toPromise();
    }
    
    getAccountsNames(addresses: Address[]): Promise<AccountNames[]>{

        return this.accountHttp.getAccountsNames(addresses).toPromise();
    }

    getMultisigAccountGraphInfo(address: Address): Promise<MultisigAccountGraphInfo>{

        return this.accountHttp.getMultisigAccountGraphInfo(address).toPromise();
    }

    getMultisigAccountInfo(address: Address): Promise<MultisigAccountInfo>{

        return this.accountHttp.getMultisigAccountInfo(address).toPromise();
    }

    transactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{

        return this.accountHttp.transactions(publicAccount, queryParams).toPromise();
    }

    incomingTransactions(accountId: Address | PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{

        return this.accountHttp.incomingTransactions(accountId, queryParams).toPromise();
    }

    outgoingTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{

        return this.accountHttp.outgoingTransactions(publicAccount, queryParams).toPromise();
    }

    unconfirmedTransactions(publicAccount: PublicAccount, queryParams?: TransactionQueryParams): Promise<Transaction[]>{

        return this.accountHttp.unconfirmedTransactions(publicAccount, queryParams).toPromise();
    }
}

