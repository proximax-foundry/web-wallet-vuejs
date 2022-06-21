<template>
<div>
    <div class='flex cursor-pointer'>
        <router-link :to='{name:"ViewAccountConfirmedTransactions",params:{address:address}}' class='text-blue-primary text-xs mt-0.5'><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">{{$t('general.back')}}</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <AccountComponent :address="address" class="mb-10"/>
        <AccountTabs :address='address' selected='txn' />
         <div class="flex my-2  gap-5 flex-none text-xs md:text-sm">
            <router-link :to="{name:'ViewAccountConfirmedTransactions', params: { address: address}}" class="border opacity-60 hover:opacity-100 cursor-pointer border-black rounded-md text-white py-2 px-4" style="background: #007CFF">Confirmed</router-link>
            <div  class="border border-black rounded-md text-white py-2 px-5" style="background: #f3a91d">Pending</div>
        </div>
        <PendingDataTable :transaction="transactions" />
    </div>
   
</div>
</template>

<script setup lang='ts'>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import PendingDataTable from "@/modules/account/components/PendingDataTable.vue"
import { DashboardService } from "@/modules/dashboard/service/dashboardService";
import { AppState } from "@/state/appState";
import { listenerState } from "@/state/listenerState";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { TransactionMapping } from "tsjs-xpx-chain-sdk";
import { computed, ref, watch } from "vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
    const props = defineProps({
        address: String
    })
    

    let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
    const acc = computed(()=>{
        if(!walletState.currentLoggedInWallet){
            return null
        }
        let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == props.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == props.address);
        if(!acc){
            return null
        }
        return acc
    }) 
    const unconfirmedTxns = ref([])
    const partialTxns = ref([])
    const inQueueTxns = ref([])
    const transactions = computed(()=>{
        return unconfirmedTxns.value.concat(inQueueTxns.value).concat(partialTxns.value)
    }) 
    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, acc.value);
    let transactionGroupType = Helper.getTransactionGroupType();
    let loadUnconfirmedTransactions = async()=>{
        let txnQueryParams = Helper.createTransactionQueryParams(); 
        txnQueryParams.pageSize = 1;
        txnQueryParams.address = acc.value?acc.value.address:'';
        txnQueryParams.embedded = true;
        txnQueryParams.updateFieldOrder(blockDescOrderSortingField); 
        let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.UNCONFIRMED, txnQueryParams);
        let formattedTxns = await dashboardService.formatUnconfirmedMixedTxns(transactionSearchResult.transactions);
        //groupType = 'unconfirmed'
        unconfirmedTxns.value = formattedTxns
    }

    let loadPartialTransactions = async() => {
        let dashboardService = new DashboardService(walletState.currentLoggedInWallet, acc.value);
        let txnQueryParams = Helper.createTransactionQueryParams();
        txnQueryParams.pageSize = 100;
        txnQueryParams.address = acc.value?acc.value.address:'';
        let transactionSearchResult = await dashboardService.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
        let formattedTxns = await dashboardService.formatPartialMixedTxns(transactionSearchResult.transactions);
        //groupType = 'partial'
        partialTxns.value  = formattedTxns
    };

    let loadInQueueTransactions = ()=>{
        let txns = []
        listenerState.autoAnnounceSignedTransaction.forEach((tx)=>{
            let txn = TransactionMapping.createFromPayload(tx.signedTransaction.payload)
            txns.push({
                type: 'Aggregate Bonded',
                hash: tx.signedTransaction.hash,
                deadline: txn.deadline.value,
                groupType: 'In Queue',
                recipient: '',
                sender: '',
                amount: '',
                message: '',
                sda: ''
            })
        })
        inQueueTxns.value =txns
    }
    
    const txnStates = [
        listenerState.unconfirmedTransactions,
        listenerState.autoAnnounceSignedTransaction,
        listenerState.confirmedTransactions
    ]
    watch([...txnStates],()=>{
        init()
    })
    const init = async()=>{
        await loadUnconfirmedTransactions()
        await loadPartialTransactions()
        loadInQueueTransactions()
    }
    if(AppState.isReady){  
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

</script>

