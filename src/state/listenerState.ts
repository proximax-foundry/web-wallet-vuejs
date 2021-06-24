import { BlockInfo, Transaction, TransactionStatusError, 
    AggregateTransaction, CosignatureSignedTransaction, Address  
} from "tsjs-xpx-chain-sdk";
import { reactive } from "vue";

interface listenerStateInterface {
    newBlocks: BlockInfo[],
    confirmedTransactions: AddressConfirmedTransactions[],
    unconfirmedTransactions: AddressUnconfirmedTransactions[],
    transactionStatus: AddressTransactionStatuses[],
    aggregateBondedTransaction: AddressAggregateTransactions[],
    cosignatureAdded: AddressCosignatureSignedTransactions[]
}

export const listenerState = reactive<listenerStateInterface>({
    newBlocks: [],
    confirmedTransactions: [],
    unconfirmedTransactions: [],
    transactionStatus: [],
    aggregateBondedTransaction: [],
    cosignatureAdded: []
});

export class AddressConfirmedTransactions{

    address: string;
    confirmedTransactions: Transaction[] = [];

    constructor(address: string){
        this.address = address;
    }
}

export class AddressUnconfirmedTransactions{

    address: string;
    unconfirmedTransactions: Transaction[] = [];

    constructor(address: string){
        this.address = address;
    }
}

export class AddressTransactionStatuses{

    address: string;
    transactionStatus: TransactionStatusError[] = [];

    constructor(address: string){
        this.address = address;
    }
}

export class AddressAggregateTransactions{

    address: string;
    aggregateBonded: AggregateTransaction[] = [];

    constructor(address: string){
        this.address = address;
    }
}

export class AddressCosignatureSignedTransactions{
    address: string;
    cosignatureAdded: CosignatureSignedTransaction[] = [];

    constructor(address: string){
        this.address = address;
    }
}