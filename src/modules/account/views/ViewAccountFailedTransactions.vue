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

            <FailedTxnDT :transactions="txnFailed" class="mt-3" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { computed, ref, watch, watchEffect } from "vue";
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

    let fetchAllFailedTxn = JSON.parse(sessionStorage.getItem("allFailedTransactions")) || []

    let allFailedTxns = fetchAllFailedTxn.filter((x: { accPubKey: string | string[]; }) => x.accPubKey.includes(currentAccountPubKey))

    txnStatus.value = allFailedTxns.flat()
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

watchEffect(() => {
      setInterval(() => {
        init()
      }, 1000)
    })

</script>