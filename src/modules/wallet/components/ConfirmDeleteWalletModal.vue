<template>
     <transition
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__fadeOutUp"
        >
          <div v-if='toggleModal' class="popup-outer fixed flex z-50">
            <div class="modal-popup-box">
              <div class="error error_box mb-3 text-center" v-if="err!=''">{{ err }}</div>
              <div class ='text-center mt-2 text-normal font-semibold'>Wallet Deletion</div>
              <img src='@/modules/wallet/img/icon-delete-wallet.svg' class='ml-auto mr-auto'>
              <div class ='text-gray-500 text-center text-xs mt-2'>This action will delete the wallet.</div>
              <div class ='font-bold text-center text-xs mt-2'>Are you sure you want to delete this wallet?</div>
              <div class="w-92">
                <div class= 'text-center'>
                  <div class="mt-3">
                    <PasswordInput class ='w-8/12 ml-auto mr-auto' placeholder="Password"  v-model="walletPassword" icon="lock"/>
                    <button @click="deleteWallet(walletName)" class='red-btn px-4 py-3 font-semibold cursor-pointer text-center ml-auto mt-3 mr-auto w-8/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableDelete">Confirm Wallet Deletion</button>
                    <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-3' @click="closeModal()">Cancel</div>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </transition>
        <div @click="toggleModal!=toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>

<script lang="ts">
import { computed, getCurrentInstance, ref } from 'vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { useI18n } from 'vue-i18n'
import PasswordInput from '@/components/PasswordInput.vue';
import { WalletUtils } from '@/util/walletUtils';

export default{
  name: 'ConfirmDeleteWalletModal',
  props:['toggleModal','walletName'],
   components: {
    PasswordInput
  },

  setup(p){
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;    
    const passwdPattern = "^[^ ]{8,}$";
    const walletPassword = ref("");
    const err = ref("");

    const disableDelete = computed(() => !(walletPassword.value.match(passwdPattern)));

    const deleteWallet = (walletName) => {   
      var networkName = networkState.chainNetworkName;
      var result = WalletUtils.verifyWalletPassword(walletName, networkName, walletPassword.value);
        if (result == true) {
          walletState.wallets.removeWalletByNetworkNameAndName(networkName, walletName);
          emitter.emit('CLOSE_MODAL', false);
        } else {
          err.value = t('signin.invalidpassword');
          walletPassword.value = "";
        }
    };

     const closeModal = () => {
        emitter.emit('CLOSE_MODAL', false);
        err.value = "";
        walletPassword.value = "";
    };
    
    return {
      err,
      disableDelete,
      deleteWallet,
      closeModal,
      walletPassword
    };
  },
}
</script>
