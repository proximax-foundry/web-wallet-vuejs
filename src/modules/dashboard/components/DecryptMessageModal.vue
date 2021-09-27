<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="showModal" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position" style=" position: absolute; right: 15px;">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal();"></font-awesome-icon>
          </div>
          <div>
            <h3 class="default-title font-bold my-5 text-left">Decrypt message: </h3>
            <div v-if="cannotDecrypt">
              Unable to decrypt message with selected account
            </div>
            <div v-else>
              <div v-if="showError" class="mt-1 mb-1">{{ errorMessage }}</div>
              <PasswordInput placeholder="Enter Wallet Password to Decrypt" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="w-full" />
              <div v-if="manualPublicKey">
                  <TextInput placeholder="Public Key Used To Decrypt" errorMessage="Public key required" v-model="decryptingPublicKey" icon="id-card-alt" :showError="showPublicKeyErr" class="w-full" />
              </div>
              <div class="text-center w-full">
                <button type="button" class="small-default-btn disabled:opacity-50" :disabled="disableDecrypt" @click="decryptMessage()">Decrypt</button>
              </div>
              
              <div class="text-left" v-if="decryptedMessage.length">
                <div>Decrypted message: </div>
                <div>{{ decryptedMessage }} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeModal();" v-if="showModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Helper } from '@/util/typeHelper';
import { WalletUtils } from '@/util/walletUtils';
import { networkState } from '@/state/networkState';
import { walletState } from '@/state/walletState';

export default{

  name: 'MessageModal',
  props: {
    'showModal': Boolean,
    'message': String,
    'selectedAccountPublicKey': String,
    'publicKeyToUse': String,
    'manualPublicKey': Boolean,
    'initialSignerPublicKey': String,
    'isInitialSender': Boolean
  },
  components: {
    TextInput,
    PasswordInput,
  },
  setup(p, context) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showPasswdError = ref(false);
    const disableDecrypt = ref(false);
    const showError = ref(false);
    const showPublicKeyErr = ref(false);
    const errorMessage = ref('');
    //const manualPublicKey = ref(false);
    const walletPassword = ref('');
    const cannotDecrypt = ref(false);
    const decryptedMessage = ref('');
    let accountDetail = {};
    let encryptedMsg = Helper.createEncryptedMessageFromEncoded(p.message);
    let decryptingPublicKey = ref(p.publicKeyToUse);
    const isRecipient = ref(false);

    // console.log(p.isInitialSender);
    // console.log(p.initialSignerPublicKey);

    if(p.isInitialSender){
      accountDetail = walletState.currentLoggedInWallet.accounts.find((acc) => acc.publicKey === p.initialSignerPublicKey);
      
      // console.log(accountDetail);
      if(!accountDetail){
        cannotDecrypt.value = true;
      }
    }
    else{
      accountDetail = walletState.currentLoggedInWallet.accounts.find((acc) => acc.publicKey === p.publicKeyToUse);

      decryptingPublicKey = ref(p.initialSignerPublicKey);
      
      if(!accountDetail){
        cannotDecrypt.value = true;
      }
    }

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    const decryptMessage = () =>{
      showError.value = false;
      showPasswdError.value = false;

      // console.log(decryptingPublicKey.value);

      if(decryptingPublicKey.value.length !== 64){
        showError.value = true;
        errorMessage.value = "Invalid Public Key length"
        return;
      }

      if(walletPassword.value === "" || walletPassword.value === undefined){
          showPasswdError.value = true;
          return;
      }

      let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)

      if (!verify) {
        showError.value = true;
        errorMessage.value = "Invalid Password"
        return;
      }

      showError.value = false;
      let privateKey = WalletUtils.decryptPrivateKey(Helper.createPasswordInstance(walletPassword.value), accountDetail.encrypted, accountDetail.iv);
      
      let account = Helper.createAccount(privateKey, networkState.currentNetworkProfile.network.type);

      let decryptingPublicAccount = Helper.createPublicAccount(decryptingPublicKey.value, networkState.currentNetworkProfile.network.type)
      
      try {
        let decryptedMessageInstance = account.decryptMessage(encryptedMsg, decryptingPublicAccount);
        
        if(decryptedMessageInstance.payload === ""){
          showError.value = true;
          errorMessage.value = "Error when trying to decrypt"
        }
        else{
          decryptedMessage.value = decryptedMessageInstance.payload;
        }

      } catch (error) {
        showError.value = true;
        errorMessage.value = "Unable to decrypt"
      }
      
      //context.emit("decryptMessage", account);
    }

    return {
      closeModal,
      showPasswdError,
      errorMessage,
      showError,
      //manualPublicKey,
      showPublicKeyErr,
      walletPassword,
      decryptMessage,
      decryptedMessage,
      cannotDecrypt,
      decryptingPublicKey,
      disableDecrypt
    };
  }
}
</script>