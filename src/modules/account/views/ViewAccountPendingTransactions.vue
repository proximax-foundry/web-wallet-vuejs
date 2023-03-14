<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6" />
            <AccountTabs :address='address' selected='txn' />
            <div class="flex my-2  gap-5 flex-none text-xs md:text-sm">
                <router-link :to="{ name: 'ViewAccountConfirmedTransactions', params: { address: address } }"
                    class="border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-4"
                    style="background: #007CFF">Confirmed</router-link>
                <div class="border rounded-md text-white py-2 px-5" style="background: #f3a91d">Pending</div>
            </div>
            <PendingDataTable :transaction="transactions" class="mt-3" />
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
import { TransactionUtils } from "@/util/transactionUtils";
import type { PartialTransferTransaction, UnconfirmedTransferTransaction } from "@/modules/dashboard/model/transactions/transaction";

const props = defineProps({
    address: {
        type: String,
        required: true
    }
})


let blockDescOrderSortingField = Helper.createTransactionFieldOrder(Helper.getQueryParamOrder_v2().DESC, Helper.getTransactionSortField().BLOCK);
const acc = computed(() => {
    if (!walletState.currentLoggedInWallet) {
        return null
    }
    let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == props.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == props.address);
    if (!acc) {
        return null
    }
    return acc
})

interface inQueueTxn {
  type: string,
  hash: string,
  deadline: string | null,
  groupType: string,
  recipient: string,
  sender: string,
  amount: string,
  message: string,
  sda: string
}

const unconfirmedTxns = ref<UnconfirmedTransferTransaction[]>([])
const partialTxns = ref<PartialTransferTransaction[]>([])
const inQueueTxns = ref<inQueueTxn[]>([])
const transactions  = computed(() => {
    const txns :(PartialTransferTransaction | UnconfirmedTransferTransaction | inQueueTxn) [] = []
    txns.push(...inQueueTxns.value)
    txns.push(...unconfirmedTxns.value)
    txns.push(...partialTxns.value)
    return txns
})
const dashboardService = ref<DashboardService | null>(null)
watch(acc, async (n) => {
    if (n && walletState.currentLoggedInWallet) {
        dashboardService.value = new DashboardService(walletState.currentLoggedInWallet, n);
    }
}, { immediate: true })

let transactionGroupType = Helper.getTransactionGroupType();
let loadUnconfirmedTransactions = async () => {
    if (!acc.value || !dashboardService.value) {
        return
    }
    let txnQueryParams = Helper.createTransactionQueryParams();
    txnQueryParams.pageSize = 1;
    txnQueryParams.address = acc.value.address
    txnQueryParams.embedded = true;
    txnQueryParams.updateFieldOrder(blockDescOrderSortingField);
    let transactionSearchResult = await dashboardService.value.searchTxns(transactionGroupType.UNCONFIRMED, txnQueryParams);
    let formattedTxns = await dashboardService.value.formatUnconfirmedMixedTxns(transactionSearchResult.transactions);
    //groupType = 'unconfirmed'
    unconfirmedTxns.value = formattedTxns
}

let loadPartialTransactions = async () => {
    if (!acc.value || !dashboardService.value ) {
        return
    }
    let txnQueryParams = Helper.createTransactionQueryParams();
    txnQueryParams.pageSize = 100;
    txnQueryParams.address = acc.value.address
    let transactionSearchResult = await dashboardService.value.searchTxns(transactionGroupType.PARTIAL, txnQueryParams);
    let formattedTxns = await dashboardService.value.formatPartialMixedTxns(transactionSearchResult.transactions);
    //groupType = 'partial'
    partialTxns.value = formattedTxns
};



let loadInQueueTransactions = () => {

    let txns :inQueueTxn[] = []
    listenerState.autoAnnounceSignedTransaction.forEach((tx) => {
        if (!acc.value) {
            return
        }
        let txn = TransactionMapping.createFromPayload(tx.signedTransaction.payload)
        let aggregateTxn = TransactionUtils.castToAggregate(txn)
        if (aggregateTxn.innerTransactions.find(tx => tx.signer.address.plain() == props.address) != undefined ||
            tx.signedTransaction.signer == acc.value.publicKey) {
            txns.push({
                type: 'Aggregate Bonded',
                hash: tx.signedTransaction.hash,
                deadline: txn.deadline.value?txn.deadline.value.toString():"",
                groupType: 'In Queue',
                recipient: '',
                sender: '',
                amount: '',
                message: '',
                sda: ''
            })
        }
    })
    inQueueTxns.value = txns
}

const txnStates = [
    listenerState.unconfirmedTransactions,
    listenerState.autoAnnounceSignedTransaction,
    listenerState.confirmedTransactions,

]
watch([...txnStates], () => {
    init()
})

const aggregateBondedTxLength = computed(() => listenerState.aggregateBondedTxLength);
watch(aggregateBondedTxLength, () => {
    init()
})
const init = async () => {
    await loadUnconfirmedTransactions()
    await loadPartialTransactions()
    loadInQueueTransactions()
}
if (AppState.isReady) {
    init();
}
else {
    let readyWatcher = watch(AppState, (value) => {
        if (value.isReady) {
            init();
            readyWatcher();
        }
    });
}

</script>

