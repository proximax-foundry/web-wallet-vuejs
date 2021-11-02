<template>
    <img src='@/modules/account/img/download-icon.svg' class="ml-2 w-5 h-5 text-blue-link cursor-pointer " @click=" toggleModal = !toggleModal">
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center mt-2 text-xs font-semibold'>Enter Password</div>
            <div class ='text-gray-300 text-center text-xs mt-2'>For security, this is required before downloading your paper wallet.</div>
            <PasswordInput class = 'mt-3' v-model= 'walletPasswd' :placeholder="'Password'"/>
            
            <div @click="verifyWalletPwWalletPaper()"  class = 'default-btn cursor-pointer text-center ml-auto mr-auto w-7/12'>Confirm</div>
            <div class= 'text-center cursor-pointer text-xs text-blue-link mt-2' @click="toggleModal = !toggleModal">Cancel</div>
            <!-- <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div class="mt-10 mb-5"><div class="font-bold text-xl text-gray-900">{{ name }}</div> <span class="text-lg text-gray-700">{{$t('deletewallet.deletemessage')}}</span></div>
            <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
              <div class="text-center w-full">
                <div class="border border-gray-600 rounded-full w-8 h-8 inline-block relative">
                  <font-awesome-icon icon="exclamation" class="w-5 h-5 text-gray-600 inline-block absolute" style="top:5px; left: 12px"></font-awesome-icon>
                </div>
                <div class="font-bold text-sm">{{$t('deletewallet.warning')}}</div>
                <p class="text-sm mt-3">{{$t('deletewallet.warningmessage')}}</p>
              </div>
            </div>
            <fieldset class="w-full">
              <label class="inline-flex items-center mb-10">
                <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="readCheck">
                <span class="ml-2 cursor-pointer text-xs">{{$t('deletewallet.deleteconsent')}}</span>
              </label>
              <div>
                <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">{{$t('deletewallet.cancel')}}</button>
                <button type="submit" class="default-btn py-1 disabled:opacity-50" @click="deleteAccount();" :disabled="disableDelete">{{$t('deletewallet.delete')}}</button>
              </div>
            </fieldset> -->
          </div>
        
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100"></div>
</template>
<script>
import PasswordInput from '@/components/PasswordInput.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from '@/util/walletUtils';
import { Account } from '@/models/account';
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
        this.err = "Please insert wallet password to save paper wallet";
      } else{
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)) {
            toggleModal.value =!toggleModal.value
            emitter.emit('unlockWalletPaper', walletPasswd.value);
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
