<template>
    <div>
        <div class='w-10/12 ml-auto mr-auto mt-5'>
            <div class="border filter shadow-lg mt-8">
                <div v-if="unsignedTxnPayload">
                    <div class="text-lg font-semibold m-7">Unsigned Transaction</div>
                    <div v-if="(typeof unsignedTxnPayload === `string`)">
                        <div class="flex justify-center px-12">
                            <div class="mb-3 border rounded-lg border-gray-900 w-full p-2 flex items-center justify-center break-all">{{ unsignedTxnPayload }}</div>
                        </div>
                        <div class="flex justify-center text-blue-primary font-semibold uppercase ml-3.5 mt-3 text-sm xl:text-md xl:ml-0 cursor-pointer" @click="goPayloadExplorer(unsignedTxnPayload)">Click to view Unsigned Transaction Details in Explorer</div>
                    </div>
                    <div v-else v-for="unsignedTx in unsignedTxnPayload">
                        <div class="flex justify-center px-12">
                            <div class="mb-3 border rounded-lg border-gray-900 w-full p-2 flex items-center justify-center break-all">{{ unsignedTx }}</div>
                        </div>
                        <div class="flex justify-center text-blue-primary font-semibold uppercase ml-3.5 my-3 text-sm xl:text-md xl:ml-0 cursor-pointer" @click="goPayloadExplorer(unsignedTx)">Click to view Unsigned Transaction Details in Explorer</div>
                    </div>
                </div>
                <div class="flex justify-center my-3">
                    <router-link :to="{ name: 'ViewDashboard' }" class="text-black font-bold text-xs pt-3 mr-4 sm:mr-5 mt-2 focus:outline-none disabled:opacity-50" @click="clearTransactionState()">
                    {{ $t('general.cancel') }}
                    </router-link>
                    <button type="submit" class="default-btn focus:outline-none disabled:opacity-50 mt-2" @click="toggleModal = !toggleModal">
                        Sign
                    </button>
                </div>
            </div>
            <transition
            enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutUp"
            >
            <div v-if="toggleModal" class="popup-outer-lang lg:translate-x-2/4 fixed flex z-50">
                <div class="modal-popup-box text-center">
                <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
                <div class="text-center mt-2 text-xs font-semibold">{{$t('general.enterPassword')}}</div>
                <PasswordInput class="mt-3" v-model="walletPasswd" :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')"/>
                <button @click="signTxn()"  class="blue-btn py-2 font-semibold cursor-pointer text-center w-7/12 mt-5 inline-block">{{$t('general.confirm')}}</button>
                <div class= "text-center cursor-pointer text-xs font-semibold text-blue-link mt-2" @click="toggleModal = !toggleModal;walletPasswd=''">{{$t('general.cancel')}}</div>
                </div>
            </div>
            </transition>
            <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PasswordInput from '@/components/PasswordInput.vue';
import { networkState } from '@/state/networkState';
import { TransactionState } from '@/state/transactionState';
import { walletState } from '@/state/walletState';
import { TransactionUtils } from '@/util/transactionUtils';
import { WalletUtils } from '@/util/walletUtils';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const toggleModal = ref(false)
const walletPasswd = ref('');
const err = ref('');

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

const unsignedTxnPayload = computed(() =>{
    if(TransactionState.unsignedTransactionPayload){
        return TransactionState.unsignedTransactionPayload
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

const selectedMultisigAddress = computed(() =>{
    return TransactionState.selectedMultisigAddress
})

const clearTransactionState = () => {
    TransactionState.lockHashPayload = ''
    TransactionState.transactionPayload = ''
    TransactionState.unsignedTransactionPayload = ''
    TransactionState.selectedAddress = ''
    TransactionState.selectedMultisigAddress = ''
}

const signTxn = () => {
    if (walletPasswd.value == "") {
      err.value = "Please insert wallet password to sign transaction";
    } else{
      if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)) {
        toggleModal.value = !toggleModal.value
        err.value = '';
        let txn = TransactionUtils.signTxnWithPassword(selectedAddress.value,selectedMultisigAddress.value,walletPasswd.value,unsignedTxnPayload.value)
        TransactionState.transactionPayload = txn.txnPayload
        TransactionState.lockHashPayload = txn.hashLockTxnPayload
        walletPasswd.value = '';
        TransactionState.unsignedTransactionPayload = ''
        confirmTransaction()
      } else {
        err.value = "Wallet password is incorrect";
      }
    }
}

const confirmTransaction = async () => {
    await TransactionUtils.confirmAnnounceTransaction(txnPayload.value,hashLockTxnPayload.value)
    const selectedAccAddress = selectedAddress.value
    clearTransactionState()
    router.push({ name: "ViewAccountPendingTransactions", params: { address: selectedAccAddress } })
}
</script>