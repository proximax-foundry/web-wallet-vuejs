<template>
    <div>
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6" />
            <AccountTabs :address="address" selected='txn' />
            <div class="flex my-2  gap-5 flex-none text-xs md:text-sm">
                <router-link :to="{ name: 'ViewAccountConfirmedTransactions', params: { address: address } }"
                    class="border opacity-60 hover:opacity-100 cursor-pointer rounded-md text-white py-2 px-4"
                    style="background: #007CFF">Confirmed</router-link>
                <router-link :to="{ name: 'ViewAccountPendingTransactions', params: { address: address } }"
                    class="border opacity-60 hover:opacity-100 cursor-pointer  rounded-md text-white py-2 px-5"
                    style="background: #f3a91d">Pending</router-link>
                <div class="border rounded-md text-white py-2 px-5" style="background: #DC143C">Failed</div>
            </div>
            <div class="bg-white px-2 ">
                <div class="mt-3">
                    <FailedTxnDT :transactions="txnFailed" class="mt-3"></FailedTxnDT>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { computed, ref, watch } from "vue";
import FailedTxnDT from '@/modules/dashboard/components/TransactionDataTable/FailedTxnDT.vue';
import { AppState } from "@/state/appState";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { walletState } from "@/state/walletState";

defineProps({
    address: String,
})

const txnStatus = ref([])
const txnFailed = computed(() => {
    let txns = []
    txns = txnStatus.value
    return txns
})

const checkTxnStatus = async () => {
    if (!AppState.chainAPI) {
        return;
    }
    if(!walletState.currentLoggedInWallet){
        return
    }

    const currentAccount = walletState.currentLoggedInWallet.accounts.find((walletAccount) => walletAccount.default === true)

    const currentAccountPubKey = currentAccount? currentAccount.publicKey: ""

    let storeActivityFailedTxn = JSON.parse(sessionStorage.getItem("txnFailedActivityLog")) || []
    let storeCosignFailedTxn = JSON.parse(sessionStorage.getItem("txnFailedCosignLog")) || []
    let storeSwapFailedTxn = JSON.parse(sessionStorage.getItem("txnFailedSwapLog")) || []

    let activityFailedTxn = AppState.txnActivityLog
    if(!storeActivityFailedTxn){
        activityFailedTxn.filter((x) => x.status === "failed" && x.accPubKey === currentAccountPubKey)
        if(AppState.txnActivityLog.length>0){
            sessionStorage.setItem("txnFailedActivityLog", JSON.stringify(AppState.txnActivityLog.filter((x)=> x.status === "failed")))
        }
    }
    else{
        let concatFailedTxns = storeActivityFailedTxn.concat(activityFailedTxn.filter((x) => x.status === "failed"))
        let filterFailedTxns = concatFailedTxns.filter((value: { txnHash: string; }, index: number) => index === concatFailedTxns.findIndex((t: { txnHash: string; }) => (t.txnHash === value.txnHash)))
        sessionStorage.setItem("txnFailedActivityLog", JSON.stringify(filterFailedTxns))
        activityFailedTxn = filterFailedTxns.filter((x: { accPubKey: string; }) => x.accPubKey === currentAccountPubKey)
    }

    let cosignFailedTxn = AppState.txnCosignLog
    if(!storeCosignFailedTxn){
        cosignFailedTxn.filter((x) => x.status === "failed" && x.accPubKey.includes(currentAccountPubKey))
        if(AppState.txnCosignLog.length>0){
            sessionStorage.setItem("txnFailedCosignLog", JSON.stringify(cosignFailedTxn))
        }
    }else{
        let concatFailedTxns = storeCosignFailedTxn.concat(cosignFailedTxn.filter((x) => x.status === "failed"))
        let filterFailedTxns = concatFailedTxns.filter((value: { txnHash: string; }, index: number) => index === concatFailedTxns.findIndex((t: { txnHash: string; }) => (t.txnHash === value.txnHash)))
        sessionStorage.setItem("txnFailedCosignLog", JSON.stringify(filterFailedTxns))
        cosignFailedTxn = filterFailedTxns.filter((x: { accPubKey: string | string[]; }) => x.accPubKey.includes(currentAccountPubKey))
    }

    let swapFailedTxn = AppState.txnSwapLog
    if(!storeSwapFailedTxn){
        swapFailedTxn.filter((x) =>  x.status === "failed" && x.accPubKey === currentAccountPubKey)
        if(AppState.txnCosignLog.length>0){
            sessionStorage.setItem("txnFailedSwapLog", JSON.stringify(swapFailedTxn))
        }
    }
    else{
        let concatFailedTxns = storeSwapFailedTxn.concat(swapFailedTxn.filter((x) => x.status === "failed"))
        let filterFailedTxns = concatFailedTxns.filter((value: { txnHash: string; }, index: number) => index === concatFailedTxns.findIndex((t: { txnHash: string; }) => (t.txnHash === value.txnHash)))
        sessionStorage.setItem("txnFailedSwapLog", JSON.stringify(filterFailedTxns))
        swapFailedTxn = filterFailedTxns.filter((x: { accPubKey: string; }) => x.accPubKey === currentAccountPubKey)
    }

    let allTxnStatus = []

    if(activityFailedTxn.length>0){
        allTxnStatus.push(activityFailedTxn);
    }
    if(cosignFailedTxn.length>0){
        allTxnStatus.push(cosignFailedTxn);
    }
    if(swapFailedTxn.length>0){
        allTxnStatus.push(swapFailedTxn);
    }

    txnStatus.value = allTxnStatus.flat()
};

const init = async () => {
    await checkTxnStatus()
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