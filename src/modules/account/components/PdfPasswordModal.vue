<template>
    <div  class=" blue-btn cursor-pointer py-3 px-4 text-center" @click=" toggleModal = !toggleModal">{{$t('general.downloadPaperWallet')}}</div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center mt-2 text-xs font-semibold'>{{$t('general.enterPassword')}}</div>
            <PasswordInput class = 'my-3' v-model= 'walletPasswd' :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')"/>
            <div @click="verifyWalletPwWalletPaper()"  class = 'blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableDownload">{{$t('general.confirm')}}</div>
            <div class= 'text-center cursor-pointer text-xs text-blue-link mt-2 font-semibold' @click="toggleModal = !toggleModal;walletPasswd=''">{{$t('general.cancel')}}</div>
          </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 z-20 bg-gray-100"></div>
</template>
<script>
import PasswordInput from '@/components/PasswordInput.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from '@/util/walletUtils';
import {  ref, getCurrentInstance,computed } from "vue";
import { useI18n } from 'vue-i18n';
export default {
    name: 'PdfPasswordModal',
    components:{
        PasswordInput
    }, 
    setup(){
      const {t} = useI18n();
      let toggleModal = ref(false)
      let walletPasswd = ref('')
      let err = ref('')
      const passwdPattern = "^[^ ]{8,}$";
      const disableDownload = computed(() => !(walletPasswd.value.match(passwdPattern)));
      const internalInstance = getCurrentInstance();
      const emitter = internalInstance.appContext.config.globalProperties.emitter;
      const verifyWalletPwWalletPaper = () =>{
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)) {
            toggleModal.value =!toggleModal.value
            emitter.emit('unlockWalletPaper', walletPasswd.value);
            walletPasswd.value=''
        } else {
          let walletName = walletState.currentLoggedInWallet.name
          err.value = t('general.walletPasswordInvalid',{name: walletName});
        }
        
    }
    return{
      verifyWalletPwWalletPaper,
      toggleModal,
      err,
      walletPasswd,
      disableDownload
    }
    }
}
</script>
