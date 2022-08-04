<template>
    <img src="@/modules/dashboard/img/encrypted-icon-message.svg" v-tooltip.left="{ value: '<tiptitle>' + messageTypeTitle + '</tiptitle><tiptext>' + message + '</tiptext>', escape: true}" class=" cursor-pointer w-6 h-6" @click="showModal = true" >
      <div v-if="showModal && showPassword" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box ">
          <div >
            <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'text-center mt-2 text-xs font-semibold'>Decrypt Message</div>
            <PasswordInput class = 'my-3' v-model= 'walletPassword' :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')"/>
            <div @click="decryptMessage()"  class = 'blue-btn font-semibold py-2 cursor-pointer text-center ml-auto mr-auto w-7/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableDecrypt">{{$t('general.confirm')}}</div>
            <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="closeModal()">{{$t('general.cancel')}}</div>
          </div>
        </div>
      </div>
      <div v-else-if="showModal && showPassword == false" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box ">
          <div>Decrypted Message: </div>
          <div>{{decryptedMessage}}</div>
           <div @click="closeModal()"  class = 'blue-btn font-semibold py-2 mt-3 cursor-pointer text-center ml-auto mr-auto w-7/12' >{{$t('general.close')}}</div>
        </div>
      </div>
    <div @click="closeModal" v-if="showModal" class="fixed inset-0 bg-opacity-60 z-20"></div>
</template>

<script lang="ts">
import Tooltip  from 'primevue/tooltip';
export default {
  name: 'DecryptMessageModal',
  directives: {
    'tooltip': Tooltip
  }
}
</script>

<script setup lang="ts">
import { getCurrentInstance, ref, computed, watch } from "vue";
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Helper } from '@/util/typeHelper';
import { WalletUtils } from '@/util/walletUtils';
import { networkState } from '@/state/networkState';
import { walletState } from '@/state/walletState';
import { AppState } from '@/state/appState';
import { EncryptedMessage } from "tsjs-xpx-chain-sdk";
import { useI18n } from 'vue-i18n';

  
const p =defineProps({
  messageTypeTitle: String,
  message: String || null,
  recipientAddress:String || null,
  initiator: String || null
})
const showModal = ref(false)
const {t} = useI18n();
const showPassword = ref(true) 
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const err = ref('')
const walletPassword = ref('');
const decryptedMessage = ref('');
const recipientPublicKey = ref('')
let encryptedMsg = Helper.createEncryptedMessageFromEncoded(p.message); 
const fetchPublicKey = ()=>{
  if(!p.recipientAddress){
    return
  }
  let recipientAddress = Helper.createAddress(p.recipientAddress)
  AppState.chainAPI.accountAPI.getAccountInfo(recipientAddress)
  .then(accInfo=>{
    recipientPublicKey.value = accInfo.publicKey
  })
}
const passwdPattern = "^[^ ]{8,}$";
const disableDecrypt = computed(()=>!(walletPassword.value.match(passwdPattern)))
const showPasswdError = ref(false)

const closeModal = () => {
  walletPassword.value = ""
  decryptedMessage.value = ""
  showPassword.value = true
  err.value = ""
  showModal.value = false
};

const recipientAcc = computed(()=>{
  if(!walletState.currentLoggedInWallet){
    return null
  }
  
  let acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.publicKey==recipientPublicKey.value) 
  return acc?acc:null
})

const decryptMessage = () =>{
  if(!recipientAcc.value){
    return
  }
  let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)
  if (!verify) {
    
    err.value = t('general.walletPasswordInvalid',{name : walletState.currentLoggedInWallet.name});
    return;
  }
  err.value = ''
  let privateKey = WalletUtils.decryptPrivateKey(Helper.createPasswordInstance(walletPassword.value), recipientAcc.value.encrypted, recipientAcc.value.iv);
  let initiatorPublicAccount = Helper.createPublicAccount(p.initiator, AppState.networkType)
  let decryptedMsg =EncryptedMessage.decrypt(encryptedMsg,privateKey,initiatorPublicAccount).payload
  if(decryptedMsg=== ""){
    err.value = "Error when trying to decrypt"
  }
  else{
    showPassword.value=false
    decryptedMessage.value = EncryptedMessage.decrypt(encryptedMsg,privateKey,initiatorPublicAccount).payload
  }
}

  const init = ()=>{
    fetchPublicKey()  
  }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }
</script>