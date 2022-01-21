<template>
    <button class="cursor-pointer text-white bg-blue-primary px-7 py-2 lg:px-12 lg:py-3 rounded-md text-xs lg:text-tsm inline-block font-bold border-2 border-blue-primary hover:opacity-80 transition-all duration-300 disabled:opacity-50" @click=" toggleModal = !toggleModal" :disabled="disabled">Approve</button>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box text-center">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
          <div class="text-center mt-2 text-xs font-semibold">Enter Password</div>
          <!-- <div class ='text-gray-300 text-center text-xs mt-2'>For security, this is required before revealing your private key.</div> -->
          <PasswordInput class="mt-3" v-model="walletPasswd" :placeholder="'Password'"/>
          <button @click="verifyWalletPwPk()"  class="blue-btn py-2 font-semibold cursor-pointer text-center w-7/12 mt-5 inline-block">Confirm</button>
          <div class= "text-center cursor-pointer text-xs font-semibold text-blue-link mt-2" @click="toggleModal = !toggleModal;walletPasswd=''">Cancel</div>
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
import {  ref } from "vue";

export default {
    name: 'CosignPasswordModal',
    props:{
      transactionHash: String,
      disabled: Boolean
    },
    components:{
      PasswordInput
    },
    emits:[
      'return-password'
    ],
    setup( p, {emit} ){
      let toggleModal = ref(false)
      let walletPasswd = ref('');
      let err = ref('');
      const verifyWalletPwPk =()=> {
        if (walletPasswd.value == "") {
          err.value = "Please insert wallet password to show Private Key";
          /* showPK.value = false;
          showPwPK.value = false; */
        } else{
          if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)) {
            toggleModal.value =!toggleModal.value
            emit('return-password', walletPasswd.value);
            walletPasswd.value = '';
            err.value = '';
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
