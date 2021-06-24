import { listenerState, AddressAggregateTransactions, AddressConfirmedTransactions, 
    AddressCosignatureSignedTransactions, AddressTransactionStatuses, AddressUnconfirmedTransactions 
} from "../listenerState";
import { BlockInfo, Transaction, TransactionStatusError, 
    AggregateTransaction, CosignatureSignedTransaction, Address
} from "tsjs-xpx-chain-sdk";

export class ListenerStateUtils{

    static addBlock(blockInfo: BlockInfo): void{
        listenerState.newBlocks.push(blockInfo);
    }

    static addConfirmedTransactions(transaction: Transaction, address: Address): void{
        
        let addressConfirmedTransactions = listenerState.confirmedTransactions.find((x)=> x.address === address.plain());

        if(addressConfirmedTransactions){
            const existingTx = addressConfirmedTransactions.confirmedTransactions.find((tx=> tx.transactionInfo?.hash === transaction.transactionInfo?.hash))

            if(!existingTx){
                const index = listenerState.confirmedTransactions.findIndex((x)=> x.address === address.plain());
                addressConfirmedTransactions.confirmedTransactions.push(transaction);
                listenerState.confirmedTransactions[index] = addressConfirmedTransactions;
            }
        }
        else{
            addressConfirmedTransactions = new AddressConfirmedTransactions(address.plain());
            listenerState.confirmedTransactions.push(addressConfirmedTransactions);
        }
    }

    static addUnconfirmedTransactions(transaction: Transaction, address: Address): void{

        let addressUnconfirmedTransactions = listenerState.unconfirmedTransactions.find((x)=> x.address === address.plain());

        if(addressUnconfirmedTransactions){
            const existingTx = addressUnconfirmedTransactions.unconfirmedTransactions.find((tx=> tx.transactionInfo?.hash === transaction.transactionInfo?.hash))

            if(!existingTx){
                const index = listenerState.unconfirmedTransactions.findIndex((x)=> x.address === address.plain());
                addressUnconfirmedTransactions.unconfirmedTransactions.push(transaction);
                listenerState.unconfirmedTransactions[index] = addressUnconfirmedTransactions;
            }
        }
        else{
            addressUnconfirmedTransactions = new AddressUnconfirmedTransactions(address.plain());
            listenerState.unconfirmedTransactions.push(addressUnconfirmedTransactions);
        }
    }

    static removeUnconfirmedTransactions(transactionHash: string, address: Address): void{

        const addressUnconfirmedTransactions = listenerState.unconfirmedTransactions.find((x)=> x.address === address.plain());

        if(addressUnconfirmedTransactions){
            const existingTxIndex = addressUnconfirmedTransactions.unconfirmedTransactions.findIndex((tx=> tx.transactionInfo?.hash === transactionHash))

            if(existingTxIndex >= 0){
                addressUnconfirmedTransactions.unconfirmedTransactions.splice(existingTxIndex, 1);
                const index = listenerState.unconfirmedTransactions.findIndex((x)=> x.address === address.plain());
                listenerState.unconfirmedTransactions[index] = addressUnconfirmedTransactions;
            }
        }
    }

    static addTransactionStatus(transactionStatusError: TransactionStatusError, address: Address): void{
        
        let addressTransactionStatuses = listenerState.transactionStatus.find((x)=> x.address === address.plain());

        if(addressTransactionStatuses){
            const existingStatus = addressTransactionStatuses.transactionStatus.find((tx=> tx.hash === transactionStatusError.hash))

            if(!existingStatus){
                const index = listenerState.transactionStatus.findIndex((x)=> x.address === address.plain());
                addressTransactionStatuses.transactionStatus.push(transactionStatusError);
                listenerState.transactionStatus[index] = addressTransactionStatuses;
            }
        }
        else{
            addressTransactionStatuses = new AddressTransactionStatuses(address.plain());
            listenerState.transactionStatus.push(addressTransactionStatuses);
        }
    }

    static addAggregateBonded(transaction: AggregateTransaction, address: Address): void{

        let addressAggregateTransaction = listenerState.aggregateBondedTransaction.find((x)=> x.address === address.plain());

        if(addressAggregateTransaction){
            const existingTransaction = addressAggregateTransaction.aggregateBonded.find((tx=> tx.transactionInfo?.hash === transaction.transactionInfo?.hash))

            if(!existingTransaction){
                const index = listenerState.transactionStatus.findIndex((x)=> x.address === address.plain());
                addressAggregateTransaction.aggregateBonded.push(transaction);
                listenerState.aggregateBondedTransaction[index] = addressAggregateTransaction;
            }
        }
        else{
            addressAggregateTransaction = new AddressAggregateTransactions(address.plain());
            listenerState.aggregateBondedTransaction.push(addressAggregateTransaction);
        }
    }

    static removeAggregateBonded(transactionHash: string, address: Address): void{

        const addressAggregateBondedTransaction = listenerState.aggregateBondedTransaction.find((x)=> x.address === address.plain());

        if(addressAggregateBondedTransaction){
            const existingTxIndex = addressAggregateBondedTransaction.aggregateBonded.findIndex((tx=> tx.transactionInfo?.hash === transactionHash))

            if(existingTxIndex >= 0){
                addressAggregateBondedTransaction.aggregateBonded.splice(existingTxIndex, 1);
                const index = listenerState.aggregateBondedTransaction.findIndex((x)=> x.address === address.plain());
                listenerState.aggregateBondedTransaction[index] = addressAggregateBondedTransaction;
            }
        }
    }

    static addCosignatureSignedTransaction(cosignatureSignedTransaction: CosignatureSignedTransaction, address: Address): void{
        
        let addressCosignatureAdded = listenerState.cosignatureAdded.find((x)=> x.address === address.plain());

        if(addressCosignatureAdded){
            const existingTransaction = addressCosignatureAdded.cosignatureAdded.find(
                (tx=> tx.parentHash === cosignatureSignedTransaction.parentHash && tx.signer === cosignatureSignedTransaction.signer)
                );

            if(!existingTransaction){
                const index = listenerState.cosignatureAdded.findIndex((x)=> x.address === address.plain());
                addressCosignatureAdded.cosignatureAdded.push(cosignatureSignedTransaction);
                listenerState.cosignatureAdded[index] = addressCosignatureAdded;
            }
        }
        else{
            addressCosignatureAdded = new AddressCosignatureSignedTransactions(address.plain());
            listenerState.cosignatureAdded.push(addressCosignatureAdded);
        }
    }

    static removeCosignatureSignedTransactionByHash(transactionHash: string): void{

        const finalAddressCosignatures: AddressCosignatureSignedTransactions[] = [];

        listenerState.cosignatureAdded.forEach((addressCosignature)=>{
            const filteredCosignature = addressCosignature.cosignatureAdded.filter((x)=> x.parentHash !== transactionHash );

            addressCosignature.cosignatureAdded = filteredCosignature;

            finalAddressCosignatures.push(addressCosignature);
        })
        
        listenerState.cosignatureAdded = finalAddressCosignatures;
    }

    static reset(): void{
        listenerState.aggregateBondedTransaction = [];
        listenerState.confirmedTransactions = [];
        listenerState.cosignatureAdded = [];
        listenerState.newBlocks = [];
        listenerState.transactionStatus = [];
        listenerState.unconfirmedTransactions = [];
    }
} 

