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

    let endStatuses = ["failed", currentAccountPubKey];

    let txnsHash1 = AppState.txnActivityLog
        .filter((x) => endStatuses.includes(x.status) && endStatuses.includes(x.accPubKey))
        .map((x) => x.txnHash);
    let txnsHash2 = AppState.txnCosignLog
        .filter((x) => endStatuses.includes(x.status) && x.accPubKey.includes(currentAccountPubKey))
        .map((x) => x.txnHash);
    let txnsHash3 = AppState.txnSwapLog
        .filter((x) => endStatuses.includes(x.status) && endStatuses.includes(x.accPubKey))
        .map((x) => x.txnHash);
    let allTransasctionHash = txnsHash1.concat(txnsHash2, txnsHash3);
    if (allTransasctionHash.length === 0) {
        txnStatus.value = []
        return;
    }
    let dataPerRequest = 50;
    let numOfRequest = Math.ceil(allTransasctionHash.length / dataPerRequest);
    let requests = [];
    for (let i = 0; i < numOfRequest; ++i) {
        let startIndex = i * dataPerRequest;
        let endIndex = (i + 1) * dataPerRequest;
        let requestData = allTransasctionHash.slice(startIndex, endIndex);
        try {
            requests.push(
                AppState.chainAPI.transactionAPI.getTransactionsStatuses(requestData)
            );
        } catch (error) {
            continue;
        }
    }
    let tempTransactionStatuses = await Promise.all(requests);
    let transactionStatuses = tempTransactionStatuses.flat();
    let txnsHashFound: string[] = [];
    for (let i = 0; i < transactionStatuses.length; ++i) {
        const transactionStatus = transactionStatuses[i];
        if (!transactionStatus.hash) {
            continue;
        }
        txnsHashFound.push(transactionStatus.hash);
        if (txnsHash1.includes(transactionStatus.hash)) {
            let txnActivity = AppState.txnActivityLog.find(
                (x) => x.txnHash === transactionStatus.hash
            );
            if (!txnActivity) {
                continue;
            }
            if (
                txnActivity.status === transactionStatus.group
            ) {
                txnActivity.status = transactionStatus.group;
                if (txnActivity.status === "failed") {
                    txnActivity.statusMsg = transactionStatus.status;
                    txnStatus.value.push(transactionStatus)
                }
            }
        } else if (txnsHash2.includes(transactionStatus.hash)) {
            let txnCosign = AppState.txnCosignLog.find(
                (x) => x.txnHash === transactionStatus.hash
            );
            if (!txnCosign) {
                continue;
            }
            if (
                txnCosign.status === transactionStatus.group
            ) {
                txnCosign.status = transactionStatus.group;
                if (txnCosign.status === "failed") {
                    txnCosign.statusMsg = transactionStatus.status;
                    txnStatus.value.push(transactionStatus)
                }
            }
        } else {
            let txnSwap = AppState.txnSwapLog.find(
                (x) => x.txnHash === transactionStatus.hash
            );
            if (!txnSwap) {
                continue;
            }
            if (
                txnSwap.status === transactionStatus.group
            ) {
                txnSwap.status = transactionStatus.group;
                if (txnSwap.status === "failed") {
                    txnSwap.statusMsg = transactionStatus.status;
                    txnStatus.value.push(transactionStatus)
                }
            }
        }
    }
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