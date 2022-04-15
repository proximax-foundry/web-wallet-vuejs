<template>
    <img @click=" toggleModal =! toggleModal" src="@/modules/wallet/img/icon-delete.svg" class=" cursor-pointer inline">
     <transition
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__fadeOutUp"
      >
      <div v-if='toggleModal' class="popup-outer fixed flex z-50 text-black mt-10">
        <div class="modal-popup-box">
          <div class="error error_box mb-3 text-center" v-if="err!=''">{{ err }}</div>
            <div class ='text-center mt-2 text-md font-normal'>{{$t('wallet.walletDeletion')}}</div>
              <img src='@/modules/wallet/img/icon-delete-wallet.svg' class='ml-auto mr-auto'>
              <div class ='text-black text-center text-xs mt-2 font-normal'>{{$t('wallet.deleteMessage')}}</div>
              <div class ='font-bold text-center text-xs mt-2'>{{$t('wallet.deleteWarning')}}</div>
              <div class="w-92">
                <div class= 'text-center'>
                  <div class="mt-3">
                    <PasswordInput class ='w-8/12 ml-auto mr-auto' :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')" v-model="walletPassword" icon="lock"/>
                    <button @click="deleteWallet(walletName)" class='red-btn px-4 py-3 font-semibold cursor-pointer text-center ml-auto mt-3 mr-auto w-8/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableDelete">{{$t('wallet.confirmDelete')}}</button>
                    <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-3' @click="toggleModal = !toggleModal;walletPassword='';err=''">{{$t('general.cancel')}}</div>
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
import { useToast } from "primevue/usetoast";
export default{
  name: 'ConfirmDeleteWalletModal',
  props:['walletName'],
   components: {
    PasswordInput
  },

  setup(p){
    const {t} = useI18n();
    const toast = useToast();
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
          toast.add({severity:'success', summary: t('general.notification'), detail: t('wallet.walletRemoved'), group: 'br', life: 5000});
        } else {
          err.value = t('general.walletPasswordInvalid',{name:walletName});
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
