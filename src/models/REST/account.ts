import { 
    AccountHttp, NetworkHttp,
    Address, PublicAccount, QueryParams
} from "tsjs-xpx-chain-sdk";

export class AccountAPI {

    accountHttp: AccountHttp;

    constructor(endpoint: string, networkHttp?: NetworkHttp){
        this.accountHttp = new AccountHttp(endpoint, networkHttp);
    }

    getAccountInfo(address: Address){
        return this.accountHttp.getAccountInfo(address).toPromise();
    }

    aggregateBondedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams){

        return this.accountHttp.aggregateBondedTransactions(publicAccount, queryParams).toPromise();
    }

    getAccountRestrictions(address: Address){

        return this.accountHttp.getAccountRestrictions(address).toPromise();
    }

    getAccountRestrictionsFromAccounts(addresses: Address[]){

        return this.accountHttp.getAccountRestrictionsFromAccounts(addresses).toPromise();
    }

    getAccountsInfo(addresses: Address[]){

        return this.accountHttp.getAccountsInfo(addresses).toPromise();
    }
    
    getAccountsNames(addresses: Address[]){

        return this.accountHttp.getAccountsNames(addresses).toPromise();
    }

    getMultisigAccountGraphInfo(address: Address){

        return this.accountHttp.getMultisigAccountGraphInfo(address).toPromise();
    }

    getMultisigAccountInfo(address: Address){

        return this.accountHttp.getMultisigAccountInfo(address).toPromise();
    }

    transactions(publicAccount: PublicAccount, queryParams?: QueryParams){

        return this.accountHttp.transactions(publicAccount, queryParams).toPromise();
    }

    incomingTransactions(accountId: Address | PublicAccount, queryParams?: QueryParams){

        return this.accountHttp.incomingTransactions(accountId, queryParams).toPromise();
    }

    outgoingTransactions(publicAccount: PublicAccount, queryParams?: QueryParams){

        return this.accountHttp.outgoingTransactions(publicAccount, queryParams).toPromise();
    }

    unconfirmedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams){

        return this.accountHttp.unconfirmedTransactions(publicAccount, queryParams).toPromise();
    }
}

