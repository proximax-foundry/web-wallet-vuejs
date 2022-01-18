<template>
    <font-awesome-icon  icon="eye" title='View Private Key' class="text-blue-link relative cursor-pointer ml-1"  @click=" toggleModal = !toggleModal"></font-awesome-icon>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center mt-2 text-xs font-semibold'>Enter Password</div>
            <!-- <div class ='text-gray-300 text-center text-xs mt-2'>For security, this is required before revealing your private key.</div> -->
            <PasswordInput class = 'my-3' v-model= 'walletPasswd' :placeholder="'Password'"/>
            <div @click="verifyWalletPwPk()"  class = 'blue-btn py-2  font-semibold cursor-pointer text-center ml-auto mr-auto w-7/12'>Confirm</div>
            <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="toggleModal = !toggleModal;walletPasswd=''">Cancel</div>
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
import {  ref, getCurrentInstance } from "vue";

export default {
    name: 'PkPasswordModal',
    props:{
      account: Account
    },
    components:{
      PasswordInput
    },
    setup(p){
      let toggleModal = ref(false)
      let walletPasswd = ref('')
      let err = ref('')
      let privateKey = ref('')
      const acc = ref(p.account)
      const internalInstance = getCurrentInstance();
      const emitter = internalInstance.appContext.config.globalProperties.emitter;
      const verifyWalletPwPk =()=> {
      if (walletPasswd.value == "") {
        err.value = "Please insert wallet password to show Private Key";
        /* showPK.value = false;
        showPwPK.value = false; */
      } else{
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPasswd.value)) {
          // pw is correct
          const passwordInstance = WalletUtils.createPassword(walletPasswd.value);
          const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.value.encrypted,acc.value.iv);
          privateKey.value= walletPrivateKey.toUpperCase();
          err.value=''
          emitter.emit('revealPK',true);
          emitter.emit('pkValue',privateKey.value);
        } else {
         
          err.value = "Wallet password is incorrect";
        }
      }
     }
     return{
       verifyWalletPwPk,
       toggleModal,
       err,
       walletPasswd
     }
    }
}
</script>
