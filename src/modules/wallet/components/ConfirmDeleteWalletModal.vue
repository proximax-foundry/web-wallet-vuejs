<template>
    <img @click=" toggleModal =! toggleModal" src="@/modules/wallet/img/icon-delete.svg" class="opacity-0 group-hover:opacity-100 cursor-pointer inline">
     <transition
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__fadeOutUp"
      >
      <div v-if='toggleModal' class="popup-outer fixed flex z-50 text-black mt-10">
        <div class="modal-popup-box">
          <div class="error error_box mb-3 text-center" v-if="err!=''">{{ err }}</div>
            <div class ='text-center mt-2 text-md font-normal'>Wallet Deletion</div>
              <img src='@/modules/wallet/img/icon-delete-wallet.svg' class='ml-auto mr-auto'>
              <div class ='text-black text-center text-xs mt-2 font-normal'>This action will delete the wallet.</div>
              <div class ='font-bold text-center text-xs mt-2'>Are you sure you want to delete this wallet?</div>
              <div class="w-92">
                <div class= 'text-center'>
                  <div class="mt-3">
                    <PasswordInput class ='w-8/12 ml-auto mr-auto' placeholder="Password"  v-model="walletPassword" icon="lock"/>
                    <button @click="deleteWallet(walletName)" class='red-btn px-4 py-3 font-semibold cursor-pointer text-center ml-auto mt-3 mr-auto w-8/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableDelete">Confirm Wallet Deletion</button>
                    <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-3' @click="toggleModal = !toggleModal;walletPassword=''">Cancel</div>
                  </div>
                </div> 
            </div>
          </div>
      </div>
      </transition>
       <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 z-20 bg-gray-100"></div>
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
  props:['walletName'],
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
    const toggleModal = ref(false);

    const disableDelete = computed(() => !(walletPassword.value.match(passwdPattern)));

    const deleteWallet = (walletName) => {   
      var networkName = networkState.chainNetworkName;
      var result = WalletUtils.verifyWalletPassword(walletName, networkName, walletPassword.value);
        if (result == true) {
          walletState.wallets.removeWalletByNetworkNameAndName(networkName, walletName);
        } else {
          err.value = t('signin.invalidpassword');
          walletPassword.value = "";
        }
    };
    
    return {
      err,
      disableDelete,
      deleteWallet,
      walletPassword,
      toggleModal
    };
  },
}
</script>
