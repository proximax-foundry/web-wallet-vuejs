<template>
    <div>
        <div class='w-10/12 ml-auto mr-auto mt-5'>
            <div class="border filter shadow-lg mt-8">
                <div v-if="hashLockTxnPayload">
                    <div class="text-lg font-semibold m-7">Hash Lock Transaction</div>
                    <div class="flex justify-center px-12">
                        <div class="mb-3 border rounded-lg border-gray-900 w-full p-2 flex items-center justify-center break-all">{{ hashLockTxnPayload }}</div>
                    </div>
                    <div class="flex justify-center text-blue-primary font-semibold uppercase ml-3.5 mt-3 text-sm xl:text-md xl:ml-0 cursor-pointer" @click="goPayloadExplorer(hashLockTxnPayload)">Click to view Hash Lock Transaction Details in Explorer</div>
                    </div>
                <div class="text-lg font-semibold m-7">Confirm Transaction</div>
                <div class="flex justify-center px-12">
                    <div class="mb-3 border rounded-lg border-gray-900 w-full p-2 flex items-center justify-center break-all">{{ txnPayload }}</div>
                </div>
                <div class="flex justify-center text-blue-primary font-semibold uppercase ml-3.5 mt-3 text-sm xl:text-md xl:ml-0 cursor-pointer" @click="goPayloadExplorer(txnPayload)">Click to view Transaction Details in Explorer</div>
                <div class="flex justify-center my-3">
                    <router-link :to="{ name: 'ViewDashboard' }" class="text-black font-bold text-xs pt-3 mr-4 sm:mr-5 mt-2 focus:outline-none disabled:opacity-50">
                    {{ $t('general.cancel') }}
                    </router-link>
                    <button type="submit" class="default-btn focus:outline-none disabled:opacity-50 mt-2" @click="makeTransaction()">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { networkState } from '@/state/networkState';
import { TransactionState } from '@/state/transactionState';
import { TransactionUtils } from '@/util/transactionUtils';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
const payloadExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.payloadInfoRoute);

const goPayloadExplorer = (payload:string)=>{
  window.open(explorerBaseURL.value + payloadExplorerURL.value + "/" + payload, "_blank");
}

const hashLockTxnPayload = computed(() =>{
    if(TransactionState.lockHashPayload){
        return TransactionState.lockHashPayload
    }
    else{
        return null
    }
})

const txnPayload = computed(() =>{
    return TransactionState.transactionPayload
})

const selectedAddress = computed(() =>{
    return TransactionState.selectedAddress
})

const clearTransactionState = () => {
    TransactionState.lockHashPayload = ''
    TransactionState.transactionPayload = ''
    TransactionState.selectedAddress = ''
}

const makeTransaction = async () => {
    await TransactionUtils.confirmAnnounceTransaction(txnPayload.value,hashLockTxnPayload.value)
    const selectedAccAddress = selectedAddress.value
    clearTransactionState()
    router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAccAddress } })
}
</script>