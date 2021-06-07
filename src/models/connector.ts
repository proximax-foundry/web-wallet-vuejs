import { Listener, Address, 
    Transaction, AggregateTransaction, CosignatureSignedTransaction,
    TransactionStatusError,
    BlockInfo
} from "tsjs-xpx-chain-sdk";
import { Subscription } from "rxjs"
import { ListenerType } from "./const/listenerType"
import { ListenerStateUtils } from "../state/utils/listenerStateUtils";
import { watch } from "vue";

export class Connector{
    
    addresses: string[];
    listener: Listener;
    subscriptions: ListenerAddressSubscription[] = [];
    watcher: any;
    isRequestConnect: boolean = false;

    constructor(endpoint: string, addresses: string[]){
        this.listener = new Listener(endpoint, WebSocket);
        this.addresses = addresses;
    }

    startListen(){
        this.isRequestConnect = true;
        this.listener.open().then(()=>{
            this.startWatcher();
            this.listener.newBlock().subscribe(ListenerHandler.handleNewBlock);

            this.addresses.forEach(rawAddress => {
                let address = Address.createFromRawAddress(rawAddress);

                let listenerHandler = new ListenerHandler(address);

                const confirmSubscription = this.listener.confirmed(address).subscribe(listenerHandler.handleConfirmTx.bind(listenerHandler))
                const unconfirmAddedSubscription = this.listener.unconfirmedAdded(address).subscribe(listenerHandler.handleUnconfirmedTxAdded.bind(listenerHandler))
                const unconfirmRemovedSubscription = this.listener.unconfirmedRemoved(address).subscribe(listenerHandler.handleAggregateBondedRemoved.bind(listenerHandler))
                const statusSubscription = this.listener.status(address).subscribe(listenerHandler.handleStatus.bind(listenerHandler));
                const aggregateBondedAddedSubscription = this.listener.aggregateBondedAdded(address).subscribe(listenerHandler.handleAggregateBondedAdded.bind(listenerHandler));
                const aggregateBondedRemovedSubscription = this.listener.aggregateBondedRemoved(address).subscribe(listenerHandler.handleAggregateBondedRemoved.bind(listenerHandler));
                const cosignatureAddedSubscription = this.listener.cosignatureAdded(address).subscribe(listenerHandler.handleCosignatureAdded.bind(listenerHandler));

                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), confirmSubscription, ListenerType.CONFIRMED));
                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), unconfirmAddedSubscription, ListenerType.UNCONFIRMED_ADDED));
                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), unconfirmRemovedSubscription, ListenerType.UNCONFIRMED_REMOVED));
                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), statusSubscription, ListenerType.STATUS));
                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), aggregateBondedAddedSubscription, ListenerType.AGGREGATE_BONDED_ADDED));
                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), aggregateBondedRemovedSubscription, ListenerType.AGGREGATE_BONDED_REMOVED));
                this.subscriptions.push(new ListenerAddressSubscription(address.plain(), cosignatureAddedSubscription, ListenerType.COSIGNATURE_ADDED));
            });

            console.log("connection success");
        }).catch((error)=>{
            console.log("connection failed");
            console.log(error);
            this.listener.terminate();
        });
    }

    terminate(){
        this.isRequestConnect = false;
        this.stopWatcher();
        this.subscriptions.forEach((listenerSubscription)=>{
            listenerSubscription.subscription.unsubscribe();
        });
        this.listener.terminate();
    }

    connectNewEndpoint(endpoint: string){
        this.listener = new Listener(endpoint, WebSocket);
        this.startListen();
    }

    reconnect(){
        this.terminate();
        this.startListen();
    }

    startWatcher(){
        let watcher = watch(
            () => this.listener.isOpen(),
            (newValue) => {
                if(!newValue && this.isRequestConnect){
                    this.reconnect();
                }
            }
          );

        this.watcher = watcher;
    }

    stopWatcher(){
        if(this.watcher)
            this.watcher();

        this.watcher = undefined;
    }
}


class ListenerHandler{

    address: Address;

    constructor(address: Address){
        this.address = address
    }

    static handleNewBlock(newBlock: BlockInfo){

        ListenerStateUtils.addBlock(newBlock);
        //console.log(`New block added: ${ newBlock.height.compact() }` );
    }

    handleConfirmTx(confirmedTransaction: Transaction){

        ListenerStateUtils.addConfirmedTransactions(confirmedTransaction, this.address);
        //console.log(`Transaction confirmed for ${this.address.pretty()}`);
    }

    handleUnconfirmedTxAdded(unconfirmedTransaction: Transaction){
        
        ListenerStateUtils.addUnconfirmedTransactions(unconfirmedTransaction, this.address);
    }

    handleUnconfirmedTxRemoved(transactionHash: string){
        ListenerStateUtils.removeUnconfirmedTransactions(transactionHash, this.address);
    }

    handleAggregateBondedAdded(aggregateTransaction: AggregateTransaction){
        ListenerStateUtils.addAggregateBonded(aggregateTransaction, this.address);
    }

    handleAggregateBondedRemoved(transactionHash: string){
        ListenerStateUtils.removeAggregateBonded(transactionHash, this.address);
    }

    handleCosignatureAdded(cosignatureSignedTransaction: CosignatureSignedTransaction){
        ListenerStateUtils.addCosignatureSignedTransaction(cosignatureSignedTransaction, this.address);
    }

    handleStatus(transactionStatusError: TransactionStatusError){
        ListenerStateUtils.addTransactionStatus(transactionStatusError, this.address);
    }

}


class ListenerAddressSubscription{

    address: string;
    subscription: Subscription;
    type: string;

    constructor(address: string, subscription: Subscription, type: string){
        this.address = address;
        this.subscription = subscription;
        this.type = type;
    }
}
