import {
    listenerState, AddressAggregateTransactions, AddressConfirmedTransactions,
    AddressCosignatureSignedTransactions, AddressTransactionStatuses, AddressUnconfirmedTransactions
} from "../listenerState";
import type{
    BlockInfo, Transaction, TransactionStatusError,
    AggregateTransaction, CosignatureSignedTransaction, Address
} from "tsjs-xpx-chain-sdk";
import { AutoAnnounceSignedTransaction, AnnounceType } from "../listenerState";
import { networkState } from "../networkState"
import { computed } from "vue";
import { ChainUtils } from "../../util/chainUtils"
import { ChainAPICall } from "../../models/REST/chainAPICall"

let confirmedCountDownSet: boolean = false;
let unconfirmedCountDownSet: boolean = false;
let aggregateTxCountDownSet: boolean = false;
let cosignatureCountDownSet: boolean = false;
let txStatusCountDownSet: boolean = false;
let unconfirmedToRemoveHash: string[] = [];
let unconfirmedToRemoveSet: boolean = false;
let aggregateBondedHashToRemove: string[] = [];
let aggregateBondedToRemoveSet: boolean = false;
let isCheckingAutoAnnounce: boolean = false;

const currentEndPoint = computed(() => networkState.selectedAPIEndpoint);
const connectionPort = computed(() => networkState.currentNetworkProfile?.httpPort);
const apiURL = computed(() => ChainUtils.buildAPIEndpoint(currentEndPoint.value, connectionPort.value));
const chainAPICall = computed(() => new ChainAPICall(apiURL.value));

export class ListenerStateUtils {

    static addAutoAnnounceSignedTransaction(autoAnnounceSignedTransaction: AutoAnnounceSignedTransaction): void {

        let exist = listenerState.autoAnnounceSignedTransaction.find(
            (autoTx)=>  autoTx.signedTransaction.hash === autoAnnounceSignedTransaction.signedTransaction.hash
        );

        if(exist){
            return;
        }

        listenerState.autoAnnounceSignedTransaction.push(autoAnnounceSignedTransaction);
    }

    static addBlock(blockInfo: BlockInfo): void {
        
        let exist = listenerState.newBlocks.find(block => block.height.compact() === blockInfo.height.compact());

        if(exist){
            return;
        }

        listenerState.newBlocks.push(blockInfo);
        let currentHeight = blockInfo.height.compact();
        listenerState.currentBlock = currentHeight;

        ListenerStateUtils.fireAutoAnnounce();
    }

    static addConfirmedTransactions(transaction: Transaction, address: Address): void {

        let addressConfirmedTransactions = listenerState.confirmedTransactions.find((x) => x.address === address.plain());

        if (addressConfirmedTransactions) {
            const existingTx = addressConfirmedTransactions.confirmedTransactions.find((tx => tx.transactionInfo?.hash === transaction.transactionInfo?.hash))

            if (!existingTx) {
                const index = listenerState.confirmedTransactions.findIndex((x) => x.address === address.plain());
                addressConfirmedTransactions.confirmedTransactions.push(transaction);
                listenerState.confirmedTransactions[index] = addressConfirmedTransactions;
            }
        }
        else {
            addressConfirmedTransactions = new AddressConfirmedTransactions(address.plain());
            addressConfirmedTransactions.confirmedTransactions.push(transaction);
            listenerState.confirmedTransactions.push(addressConfirmedTransactions);
        }

        //ListenerStateUtils.updateAutoAnnounceByConfirmedHash(transaction.transactionInfo.hash, transaction.transactionInfo.height.compact());
        // console.log("Confirm Added");
        // console.log("Hash: "+ transaction.transactionInfo.hash);
        // console.log("Address: "+ address.plain());
        if(transaction.transactionInfo && transaction.transactionInfo.hash){
            listenerState.allConfirmedTransactionsHash.push(transaction.transactionInfo.hash);
        }

        ListenerStateUtils.fireRecountConfirmed();
    }

    static addUnconfirmedTransactions(transaction: Transaction, address: Address): void {

        let addressUnconfirmedTransactions = listenerState.unconfirmedTransactions.find((x) => x.address === address.plain());

        if (addressUnconfirmedTransactions) {
            const existingTx = addressUnconfirmedTransactions.unconfirmedTransactions.find((tx => tx.transactionInfo?.hash === transaction.transactionInfo?.hash))

            if (!existingTx) {
                const index = listenerState.unconfirmedTransactions.findIndex((x) => x.address === address.plain());
                addressUnconfirmedTransactions.unconfirmedTransactions.push(transaction);
                listenerState.unconfirmedTransactions[index] = addressUnconfirmedTransactions;
            }
        }
        else {
            addressUnconfirmedTransactions = new AddressUnconfirmedTransactions(address.plain());
            addressUnconfirmedTransactions.unconfirmedTransactions.push(transaction);
            listenerState.unconfirmedTransactions.push(addressUnconfirmedTransactions);
        }

        // push to allConfirmedTransactions
        // console.log("Unconfirm Added");
        // console.log("Hash: "+ transaction.transactionInfo.hash);
        // console.log("Address: "+ address.plain());
        if(transaction.transactionInfo && transaction.transactionInfo.hash){
            listenerState.allUnconfirmedTransactionsHash.push(transaction.transactionInfo.hash);
        }

        //ListenerStateUtils.updateAutoAnnounceByConfirmedHash(transaction.transactionInfo.hash);

        ListenerStateUtils.fireRecountUnconfirmed();
    }

    static removeUnconfirmedTransactions(transactionHash: string, address: Address): void {

        const addressUnconfirmedTransactions = listenerState.unconfirmedTransactions.find((x) => x.address === address.plain());

        if (addressUnconfirmedTransactions) {
            const existingTxIndex = addressUnconfirmedTransactions.unconfirmedTransactions.findIndex((tx => tx.transactionInfo?.hash === transactionHash))

            if (existingTxIndex >= 0) {
                addressUnconfirmedTransactions.unconfirmedTransactions.splice(existingTxIndex, 1);
                const index = listenerState.unconfirmedTransactions.findIndex((x) => x.address === address.plain());
                listenerState.unconfirmedTransactions[index] = addressUnconfirmedTransactions;
            }
        }

        unconfirmedToRemoveHash.push(transactionHash);
        // console.log("Address: " + address.plain());
        // console.log("Unconfirm removed:" + transactionHash);

        ListenerStateUtils.fireUnconfirmedToRemove();
    }

    static addTransactionStatus(transactionStatusError: TransactionStatusError, address: Address): void {

        let addressTransactionStatuses = listenerState.transactionStatus.find((x) => x.address === address.plain());

        if (addressTransactionStatuses) {
            const existingStatus = addressTransactionStatuses.transactionStatus.find((tx => tx.hash === transactionStatusError.hash))

            if (!existingStatus) {
                const index = listenerState.transactionStatus.findIndex((x) => x.address === address.plain());
                addressTransactionStatuses.transactionStatus.push(transactionStatusError);
                listenerState.transactionStatus[index] = addressTransactionStatuses;
            }
        }
        else {
            addressTransactionStatuses = new AddressTransactionStatuses(address.plain());
            addressTransactionStatuses.transactionStatus.push(transactionStatusError);
            listenerState.transactionStatus.push(addressTransactionStatuses);
        }

        console.log(transactionStatusError);
        listenerState.allTransactionStatus.push(transactionStatusError);

        ListenerStateUtils.fireRecountTxStatus();
    }

    static addAggregateBonded(transaction: AggregateTransaction, address: Address): void {

        let addressAggregateTransaction = listenerState.aggregateBondedTransaction.find((x) => x.address === address.plain());

        if (addressAggregateTransaction) {
            const existingTransaction = addressAggregateTransaction.aggregateBonded.find((tx => tx.transactionInfo?.hash === transaction.transactionInfo?.hash))

            if (!existingTransaction) {
                const index = listenerState.transactionStatus.findIndex((x) => x.address === address.plain());
                addressAggregateTransaction.aggregateBonded.push(transaction);
                listenerState.aggregateBondedTransaction[index] = addressAggregateTransaction;
            }
        }
        else {
            addressAggregateTransaction = new AddressAggregateTransactions(address.plain());
            addressAggregateTransaction.aggregateBonded.push(transaction);
            listenerState.aggregateBondedTransaction.push(addressAggregateTransaction);
        }

        //ListenerStateUtils.updateAutoAnnounceByConfirmedHash(transaction.transactionInfo.hash);
        if(transaction.transactionInfo && transaction.transactionInfo.hash){
            listenerState.allAggregateBondedTransactionHash.push(transaction.transactionInfo.hash);
        }

        ListenerStateUtils.fireRecountAggregateAdded();
    }

    static removeAggregateBonded(transactionHash: string, address: Address): void {

        const addressAggregateBondedTransaction = listenerState.aggregateBondedTransaction.find((x) => x.address === address.plain());

        if (addressAggregateBondedTransaction) {
            const existingTxIndex = addressAggregateBondedTransaction.aggregateBonded.findIndex((tx => tx.transactionInfo?.hash === transactionHash))

            if (existingTxIndex >= 0) {
                addressAggregateBondedTransaction.aggregateBonded.splice(existingTxIndex, 1);
                const index = listenerState.aggregateBondedTransaction.findIndex((x) => x.address === address.plain());
                listenerState.aggregateBondedTransaction[index] = addressAggregateBondedTransaction;
            }
        }

        aggregateBondedHashToRemove.push(transactionHash);

        ListenerStateUtils.fireRemoveAggregateBonded();
    }

    static addCosignatureSignedTransaction(cosignatureSignedTransaction: CosignatureSignedTransaction, address: Address): void {

        let addressCosignatureAdded = listenerState.cosignatureAdded.find((x) => x.address === address.plain());

        if (addressCosignatureAdded) {
            const existingTransaction = addressCosignatureAdded.cosignatureAdded.find(
                (tx => tx.parentHash === cosignatureSignedTransaction.parentHash && tx.signer === cosignatureSignedTransaction.signer)
            );

            if (!existingTransaction) {
                const index = listenerState.cosignatureAdded.findIndex((x) => x.address === address.plain());
                addressCosignatureAdded.cosignatureAdded.push(cosignatureSignedTransaction);
                listenerState.cosignatureAdded[index] = addressCosignatureAdded;
            }
        }
        else {
            addressCosignatureAdded = new AddressCosignatureSignedTransactions(address.plain());
            addressCosignatureAdded.cosignatureAdded.push(cosignatureSignedTransaction);
            listenerState.cosignatureAdded.push(addressCosignatureAdded);
        }

        listenerState.allCosignatureAdded.push(cosignatureSignedTransaction);

        ListenerStateUtils.fireRecountCosignatureAdded();
    }

    // not a listener handle, so no need a timer
    static removeCosignatureSignedTransactionByHash(transactionHash: string): void {

        const finalAddressCosignatures: AddressCosignatureSignedTransactions[] = [];
        let totalLength = 0;
        let allCosignatureAddedTx: CosignatureSignedTransaction[] = [];

        listenerState.cosignatureAdded.forEach((addressCosignature) => {
            const filteredCosignature = addressCosignature.cosignatureAdded.filter((x) => x.parentHash !== transactionHash);

            addressCosignature.cosignatureAdded = filteredCosignature;

            finalAddressCosignatures.push(addressCosignature);

            allCosignatureAddedTx = allCosignatureAddedTx.concat(filteredCosignature);
        })

        listenerState.cosignatureAdded = finalAddressCosignatures;

        allCosignatureAddedTx = allCosignatureAddedTx.filter(
            (tx, index, array) => index === array.findIndex(foundTx => foundTx.signer === tx.signer && foundTx.parentHash === tx.parentHash)
        );

        listenerState.allCosignatureAdded = allCosignatureAddedTx;

        listenerState.cosignatureAddedTxLength = allCosignatureAddedTx.length;
    }

    static reset(): void {
        listenerState.newBlocks = [];

        listenerState.aggregateBondedTransaction = [];
        listenerState.confirmedTransactions = [];
        listenerState.cosignatureAdded = [];
        listenerState.transactionStatus = [];
        listenerState.unconfirmedTransactions = [];

        listenerState.allAggregateBondedTransactionHash = [];
        listenerState.allConfirmedTransactionsHash = [];
        listenerState.allCosignatureAdded = [];
        listenerState.allTransactionStatus = [];
        listenerState.allUnconfirmedTransactionsHash = [];

        listenerState.confirmedTxLength = 0;
        listenerState.aggregateBondedTxLength = 0;
        listenerState.cosignatureAddedTxLength = 0;
        listenerState.unconfirmedTxLength = 0;
        listenerState.transactionStatusLength = 0;
    }

    static lightReset(): void {
        listenerState.newBlocks = [];

        listenerState.aggregateBondedTransaction = [];
        listenerState.confirmedTransactions = [];
        listenerState.cosignatureAdded = [];
        listenerState.transactionStatus = [];
        listenerState.unconfirmedTransactions = [];
        listenerState.allCosignatureAdded = [];

        listenerState.allAggregateBondedTransactionHash = [];
        listenerState.allCosignatureAdded = [];
        listenerState.allUnconfirmedTransactionsHash = [];
        listenerState.allTransactionStatus = [];

        listenerState.aggregateBondedTxLength = 0;
        listenerState.cosignatureAddedTxLength = 0;
        listenerState.unconfirmedTxLength = 0;
        listenerState.transactionStatusLength = 0;
    }

    static fireRecountConfirmed() {

        if (!confirmedCountDownSet) {
            confirmedCountDownSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleConfirmedRecount();
            }, 1000)
        }
    }

    static fireRecountUnconfirmed() {
        if (!unconfirmedCountDownSet) {
            unconfirmedCountDownSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleUnconfirmedRecount();
            }, 1000)
        }
    }

    static fireRecountAggregateAdded() {
        if (!aggregateTxCountDownSet) {
            unconfirmedCountDownSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleAggregateTxRecount();
            }, 1000)
        }
    }

    static fireRecountCosignatureAdded() {
        if (!cosignatureCountDownSet) {
            cosignatureCountDownSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleCosignatureRecount();
            }, 1000)
        }
    }

    static fireUnconfirmedToRemove() {
        if (!unconfirmedToRemoveSet) {
            unconfirmedToRemoveSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleRemoveUnconfirmedRecount();
            }, 1000)
        }
    }

    static fireRecountTxStatus() {

        if (!txStatusCountDownSet) {
            txStatusCountDownSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleTxStatusRecount();
            }, 1000)
        }
    }

    static fireRemoveAggregateBonded() {
        if (!aggregateBondedToRemoveSet) {
            aggregateBondedToRemoveSet = true;
            setTimeout(() => {
                ListenerStateUtils.handleRemoveAggregateBondedRecount();
            }, 1000)
        }
    }

    static handleConfirmedRecount() {
        confirmedCountDownSet = false;

        listenerState.allConfirmedTransactionsHash = Array.from(new Set(listenerState.allConfirmedTransactionsHash));

        listenerState.confirmedTxLength = listenerState.allConfirmedTransactionsHash.length;
    }

    static handleUnconfirmedRecount() {
        confirmedCountDownSet = false;

        listenerState.allUnconfirmedTransactionsHash = Array.from(new Set(listenerState.allUnconfirmedTransactionsHash));

        listenerState.unconfirmedTxLength = listenerState.allUnconfirmedTransactionsHash.length;
    }

    static handleAggregateTxRecount() {
        confirmedCountDownSet = false;

        listenerState.allAggregateBondedTransactionHash = Array.from(new Set(listenerState.allAggregateBondedTransactionHash));

        listenerState.aggregateBondedTxLength = listenerState.allAggregateBondedTransactionHash.length;
    }

    static handleCosignatureRecount() {
        confirmedCountDownSet = false;

        listenerState.allCosignatureAdded = listenerState.allCosignatureAdded.filter(
            (tx, index, array) => index === array.findIndex(foundTx => foundTx.signer === tx.signer && foundTx.parentHash === tx.parentHash)
        );

        listenerState.cosignatureAddedTxLength = listenerState.allCosignatureAdded.length;
    }

    static handleRemoveUnconfirmedRecount() {
        unconfirmedToRemoveSet = false;

        listenerState.allUnconfirmedTransactionsHash = listenerState.allUnconfirmedTransactionsHash.filter(txHash => !unconfirmedToRemoveHash.includes(txHash));

        unconfirmedToRemoveHash = [];

        listenerState.unconfirmedTxLength = listenerState.allUnconfirmedTransactionsHash.length;
    }

    static handleTxStatusRecount() {
        txStatusCountDownSet = false;

        listenerState.allTransactionStatus = listenerState.allTransactionStatus.filter(
            (tx, index, array) => index === array.findIndex(foundTx => foundTx.hash === tx.hash)
        );

        console.log(listenerState.allTransactionStatus);

        listenerState.transactionStatusLength = listenerState.allTransactionStatus.length;
    }

    static handleRemoveAggregateBondedRecount() {
        aggregateBondedToRemoveSet = false;

        listenerState.allAggregateBondedTransactionHash = listenerState.allAggregateBondedTransactionHash.filter(txHash => !aggregateBondedHashToRemove.includes(txHash));

        aggregateBondedHashToRemove = [];

        listenerState.aggregateBondedTxLength = listenerState.allAggregateBondedTransactionHash.length;
    }

    static fireAutoAnnounce() {
        if (!isCheckingAutoAnnounce) {
            isCheckingAutoAnnounce = true;
            setTimeout(() => {
                ListenerStateUtils.checkingAutoAnnounce();
            }, 1000)
        }
    }

    static checkingAutoAnnounce() {
        isCheckingAutoAnnounce = false;

        let currentBlockHeight = listenerState.currentBlock;

        for (let i = 0; i < listenerState.autoAnnounceSignedTransaction.length; ++i) {

            let letAnnouce = false;
            
            let currentAutoAnnounceTx = listenerState.autoAnnounceSignedTransaction[i];

            if(currentAutoAnnounceTx.announced){
                continue;
            }

            if(currentAutoAnnounceTx.announceAtBlock && currentBlockHeight >= currentAutoAnnounceTx.announceAtBlock){
                letAnnouce = true;
            }
            else if(currentAutoAnnounceTx.hashAnnounceBlock && currentAutoAnnounceTx.hashAnnounceBlock.hashFound && currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock ){
                if(currentBlockHeight > currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock + currentAutoAnnounceTx.hashAnnounceBlock.annouceAfterBlockNum){
                    letAnnouce = true;
                }
            }

            if(letAnnouce){
                if (currentAutoAnnounceTx.type === AnnounceType.NORMAL) {
                    chainAPICall.value.transactionAPI.announce(currentAutoAnnounceTx.signedTransaction);
                }
                else {
                    chainAPICall.value.transactionAPI.announceAggregateBonded(currentAutoAnnounceTx.signedTransaction);
                }

                currentAutoAnnounceTx.announced = true;

            }
        }

        let remainingTransactionsToAnnounce = listenerState.autoAnnounceSignedTransaction.filter(
            (autoTx) => !autoTx.confirmAnnounced
        );

        listenerState.autoAnnounceSignedTransaction = remainingTransactionsToAnnounce;
    }

    static updateAutoAnnounceByConfirmedHash(hash: string, blockHeight?: number) {

        for (let i = 0; i < listenerState.autoAnnounceSignedTransaction.length; ++i) {

            let current = listenerState.autoAnnounceSignedTransaction[i];

            if(current.hashAnnounceBlock){
                if(current.hashAnnounceBlock.trackHash === hash){
                    current.hashAnnounceBlock.hashFound = true;
                    if(blockHeight){
                        current.hashAnnounceBlock.hashFoundAtBlock = blockHeight;
                    }
                    else{
                        current.hashAnnounceBlock.hashFoundAtBlock = listenerState.currentBlock;
                    }
                }
            }

            if(current.signedTransaction.hash === hash){
                current.confirmAnnounced = true;
            }
        }
    }
}

