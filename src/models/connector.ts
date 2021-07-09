import { Listener, Address, 
    Transaction, AggregateTransaction, CosignatureSignedTransaction,
    TransactionStatusError,
    BlockInfo
} from "tsjs-xpx-chain-sdk";
import { Subscription } from "rxjs"
import { ListenerType } from "./const/listenerType"
import { ListenerStateUtils } from "../state/utils/listenerStateUtils";
import { watch } from "vue";

const secondsToCheck = 25;
//const secondsInterval = 20;

export class Connector{
    
    addresses: string[];
    listener: Listener;
    subscriptions: ListenerAddressSubscription[] = [];
    watcher: any;
    isRequestConnect: boolean = false;
    isConnected: boolean = false; 
    intervalCheck: any;
    currentTime: number = 0;
    endpoint: string;

    constructor(endpoint: string, addresses: string[]){
        this.endpoint = endpoint;
        this.listener = new Listener(endpoint, WebSocket);
        this.addresses = addresses;
    }

    startListen(): void{
        this.isRequestConnect = true;
        this.refreshTimer();
        this.listener.open().then(()=>{
            //this.startWatcher();
            this.startIntervalCheck();
            this.isConnected = true;
            this.listener.newBlock().subscribe(ListenerHandler.handleNewBlock);

            this.addresses.forEach(rawAddress => {
                const address = Address.createFromRawAddress(rawAddress);

                const listenerHandler = new ListenerHandler(address);

                const confirmSubscription = this.listener.confirmed(address).subscribe(listenerHandler.handleConfirmTx.bind(listenerHandler))
                const unconfirmAddedSubscription = this.listener.unconfirmedAdded(address).subscribe(listenerHandler.handleUnconfirmedTxAdded.bind(listenerHandler))
                const unconfirmRemovedSubscription = this.listener.unconfirmedRemoved(address).subscribe(listenerHandler.handleUnconfirmedTxRemoved.bind(listenerHandler))
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

    terminate(): void{
        this.isConnected = false;
        this.isRequestConnect = false;
        this.stopIntervalCheck();
        //this.stopWatcher();
        for(let i = 0; i < this.subscriptions.length ;++i){
            this.subscriptions[i].subscription.unsubscribe();
            this.subscriptions[i].subscription = null;
        }

        this.subscriptions = [];

        if(this.listener){
            this.listener.terminate();
        }

        this.listener = null;
    }

    connectNewEndpoint(endpoint: string): void{
        this.listener = new Listener(endpoint, WebSocket);
        this.startListen();
    }

    reconnect(): void{
        console.log("Reconnecting at: " + new Date().toISOString());
        this.stopIntervalCheck();
        this.terminate();
        this.isConnected = false;
        this.listener = new Listener(this.endpoint, WebSocket);
        this.startListen();
    }

    /*
    private startWatcher(): void{
        const watcher = watch(
            () => this.listener.isOpen(),
            (newValue) => {
                if(!newValue && this.isRequestConnect){
                    this.reconnect();
                }
            }
          );

        this.watcher = watcher;
    }

    private stopWatcher(): void{
        if(this.watcher)
            this.watcher();

        this.watcher = undefined;
    }
    */

    private startIntervalCheck(){
        this.intervalCheck = setInterval(()=>{

            //console.log("Set time:" + this.currentTime);
            let currentTime = new Date().getTime();
            //console.log("Time to check:" + currentTime);

            if((currentTime - this.currentTime) >= (secondsToCheck * 1000)){
                this.stopIntervalCheck();
                this.reconnect();
            }
 
        }, 5 * 1000);
    }

    private stopIntervalCheck(){
        if(this.intervalCheck){
            console.log("Clear Interval");
            clearInterval(this.intervalCheck);
        }    

        this.intervalCheck = null;
    }

    refreshTimer(){
        this.currentTime = new Date().getTime();
    }
}


class ListenerHandler{

    address: Address;

    constructor(address: Address){
        this.address = address
    }

    static handleNewBlock(newBlock: BlockInfo): void{

        ListenerStateUtils.addBlock(newBlock);
    }

    handleConfirmTx(confirmedTransaction: Transaction): void{

        ListenerStateUtils.addConfirmedTransactions(confirmedTransaction, this.address);
    }

    handleUnconfirmedTxAdded(unconfirmedTransaction: Transaction): void{
        
        ListenerStateUtils.addUnconfirmedTransactions(unconfirmedTransaction, this.address);
    }

    handleUnconfirmedTxRemoved(transactionHash: string): void{
        ListenerStateUtils.removeUnconfirmedTransactions(transactionHash, this.address);
    }

    handleAggregateBondedAdded(aggregateTransaction: AggregateTransaction): void{
        ListenerStateUtils.addAggregateBonded(aggregateTransaction, this.address);
    }

    handleAggregateBondedRemoved(transactionHash: string): void{
        ListenerStateUtils.removeAggregateBonded(transactionHash, this.address);
    }

    handleCosignatureAdded(cosignatureSignedTransaction: CosignatureSignedTransaction): void{
        ListenerStateUtils.addCosignatureSignedTransaction(cosignatureSignedTransaction, this.address);
    }

    handleStatus(transactionStatusError: TransactionStatusError): void{
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
