<template>
    <!-- <font-awesome-icon  icon="eye" title='View Private Key' class="text-blue-link relative cursor-pointer ml-1"  ></font-awesome-icon> -->
    <font-awesome-icon :title="$t('general.copy')" icon="copy" class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer " @click=" toggleModal = !toggleModal"></font-awesome-icon>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box "> 
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center mt-2 text-xs font-semibold'>{{$t('general.enterPassword')}}</div>
            <PasswordInput class = 'my-3' v-model= 'walletPasswd' :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')"/>
            <div @click="verifyWalletPwPk()"  class = 'blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableShow">{{$t('general.confirm')}}</div>
            <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="toggleModal = !toggleModal;walletPasswd=''">{{$t('general.cancel')}}</div>
          </div>
        
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>
<script>
import PasswordInput from '@/components/PasswordInput.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from '@/util/walletUtils';
import { Account } from '@/models/account';
import {  ref, getCurrentInstance,computed } from "vue";
import { useI18n } from 'vue-i18n';

export default {
    name: 'PkPasswordModal',
    props:{
      account: Account
    },
    components:{
      PasswordInput
    },
    setup(p){
      const {t} = useI18n();
      let toggleModal = ref(false)
      let walletPasswd = ref('')
      let err = ref('')
      let privateKey = ref('')
      const passwdPattern = "^[^ ]{8,}$";
      const disableShow = computed(() => !(walletPasswd.value.match(passwdPattern)));
      const acc = ref(p.account)
      const internalInstance = getCurrentInstance();
      const emitter = internalInstance.appContext.config.globalProperties.emitter;
      const verifyWalletPwPk =()=> {
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPasswd.value)) {
          // pw is correct
          const passwordInstance = WalletUtils.createPassword(walletPasswd.value);
          const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.value.encrypted,acc.value.iv);
          privateKey.value= walletPrivateKey.toUpperCase();
          err.value=''
          emitter.emit('revealPK',true);
          emitter.emit('pkValue',privateKey.value);
        } else {
          let walletName = walletState.currentLoggedInWallet.name
          err.value = t('general.walletPasswordInvalid',{name: walletName});
        }
      
     }
     return{
       verifyWalletPwPk,
       toggleModal,
       err,
       walletPasswd,
       disableShow
     }
    }
}
</script>
