<template>
    <div  class=" blue-btn cursor-pointer py-3 px-3 " @click=" toggleModal = !toggleModal">Download Wallet Paper</div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center mt-2 text-xs font-semibold'>Enter Password</div>
           <!--  <div class ='text-gray-300 text-center text-xs mt-2'>For security, this is required before downloading your paper wallet.</div> -->
            <PasswordInput class = 'my-3' v-model= 'walletPasswd' :placeholder="'Password'"/>
            <div @click="verifyWalletPwWalletPaper()"  class = 'blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12'>Confirm</div>
            <div class= 'text-center cursor-pointer text-xs text-blue-link mt-2 font-semibold' @click="toggleModal = !toggleModal;walletPasswd=''">Cancel</div>
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
import {  ref, getCurrentInstance } from "vue";
export default {
    name: 'PdfPasswordModal',
    components:{
        PasswordInput
    }, 
    setup(){
      let toggleModal = ref(false)
      let walletPasswd = ref('')
      let err = ref('')
      const internalInstance = getCurrentInstance();
      const emitter = internalInstance.appContext.config.globalProperties.emitter;
      const verifyWalletPwWalletPaper = () =>{
      if (walletPasswd.value == "") {
        err.value= "Please insert wallet password to save paper wallet";
      } else{
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)) {
            toggleModal.value =!toggleModal.value
            emitter.emit('unlockWalletPaper', walletPasswd.value);
            walletPasswd.value=''
        } else {
          err.value = "Wallet password is incorrect";
        }
        }
    }
    return{
      verifyWalletPwWalletPaper,
      toggleModal,
      err,
      walletPasswd
    }
    }
}
</script>
