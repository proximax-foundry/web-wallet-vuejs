import { BlockInfo, Transaction, TransactionStatusError, 
    AggregateTransaction, CosignatureSignedTransaction, Address, SignedTransaction  
} from "tsjs-xpx-chain-sdk";
import { reactive } from "vue";

interface listenerStateInterface {
    newBlocks: BlockInfo[],
    confirmedTransactions: AddressConfirmedTransactions[],
    unconfirmedTransactions: AddressUnconfirmedTransactions[],
    transactionStatus: AddressTransactionStatuses[],
    aggregateBondedTransaction: AddressAggregateTransactions[],
    cosignatureAdded: AddressCosignatureSignedTransactions[],
    confirmedTxLength: number,
    unconfirmedTxLength: number,
    transactionStatusLength: number,
    aggregateBondedTxLength: number,
    cosignatureAddedTxLength: number
    currentBlock: number,
    allConfirmedTransactionsHash: string[],
    allUnconfirmedTransactionsHash: string[],
    allTransactionStatus: TransactionStatusError[],
    allAggregateBondedTransactionHash: string[],
    allCosignatureAdded: CosignatureSignedTransaction[],
    autoAnnounceSignedTransaction: AutoAnnounceSignedTransaction[]
}

export const listenerState = reactive<listenerStateInterface>({
    newBlocks: [],
    confirmedTransactions: [],
    unconfirmedTransactions: [],
    transactionStatus: [],
    aggregateBondedTransaction: [],
    cosignatureAdded: [],
    confirmedTxLength: 0,
    unconfirmedTxLength: 0,
    transactionStatusLength: 0,
    aggregateBondedTxLength: 0,
    cosignatureAddedTxLength: 0,
    currentBlock: 0,
    allConfirmedTransactionsHash: [],
    allUnconfirmedTransactionsHash: [],
    allTransactionStatus: [],
    allAggregateBondedTransactionHash: [],
    allCosignatureAdded: [],
    autoAnnounceSignedTransaction: []
});

export class AutoAnnounceSignedTransaction{
    signedTransaction: SignedTransaction;
    announceAtBlock: number | null = null;
    hashAnnounceBlock: HashAnnounceBlock | null = null;
    type: AnnounceType = AnnounceType.NORMAL;
    confirmAnnounced: boolean = false;
    announced: boolean = false;
    checkCount: number = 0;

    constructor(signedTx: SignedTransaction){
        this.signedTransaction = signedTx;
    }
}

export enum AnnounceType{
    NORMAL = 0,
    BONDED = 1
}

export class HashAnnounceBlock{
    trackHash : string;
    hashFound: boolean = false;
    hashFoundAtBlock: number | null = null;
    annouceAfterBlockNum: number = 0;

    constructor(trackHash: string){
        this.trackHash = trackHash;
    }
}

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