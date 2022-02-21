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
            <div class="default-title font-bold my-5 text-left">
              You are signing with: {{ selectedAccountName }}
            </div>
            <div v-if="needSigning">
              <div v-if="showError" class="mt-1 mb-1">{{ errorMessage }}</div>
              <PasswordInput placeholder="Enter Wallet Password to sign" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" class="w-full" />

              <div class="text-center w-full">
                <button type="button" class="small-default-btn disabled:opacity-50" @click="cosignTransaction()">Sign</button>
              </div>             
            </div>
            <div v-else-if="isSigned">
              You have signed
            </div>
            <div v-else-if="nothingToSign">
              Nothing to sign from this account
            </div>
            <div v-else-if="cannotSign">
              You do not have access to sign with this account 
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
import PasswordInput from '@/components/PasswordInput.vue';
import { Helper } from '@/util/typeHelper';
import { WalletUtils } from '@/util/walletUtils';
import { networkState } from '@/state/networkState';
import { walletState } from '@/state/walletState';

export default{

  name: 'CosignModal',
  props: {
    'showModal': Boolean,
    'txHash': String,
    'signedPublicKey': Array,
    'signerPublicKey': Array,
    'selectedAccountName': String,
    'selectedAccountPublicKey': String
  },
  emits: ['cosignTransaction']
  ,
  components: {
    PasswordInput,
  },
  setup(p, context) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showPasswdError = ref(false);
    const showError = ref(false);
    const showPublicKeyErr = ref(false);
    const errorMessage = ref('');
    const walletPassword = ref('');
    const needSigning = ref(false);
    const cannotSign = ref(false);
    const nothingToSign = ref(false);
    const isSigned = ref(false);
    let accountDetail = {};

    // console.log(p.signerPublicKey);

    if(p.signedPublicKey.includes(p.selectedAccountPublicKey)){
      isSigned.value = true;
    }
    else if(p.signerPublicKey.includes(p.selectedAccountPublicKey)){
      accountDetail = walletState.currentLoggedInWallet.accounts.find((acc) => acc.publicKey === p.selectedAccountPublicKey);
      
      if(accountDetail){
        needSigning.value = true;
      }
      else{
        cannotSign.value = true;
      }
    }
    else{
      nothingToSign.value = true;
    }

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    const cosignTransaction = () =>{

      showError.value = false;
      showPasswdError.value = false;

      if(walletPassword.value === "" || walletPassword.value === undefined){
          showPasswdError.value = true;
          return;
      }

      if (needSigning.value) { 

        let verify = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name, networkState.chainNetworkName, walletPassword.value)

        if (!verify) {
          showError.value = true;
          errorMessage.value = "Invalid Password"
          return;
        }

        showError.value = false;
        let privateKey = WalletUtils.decryptPrivateKey(Helper.createPasswordInstance(walletPassword.value), accountDetail.encrypted, accountDetail.iv);
        
        let account = Helper.createAccount(privateKey, AppState.networkType);
        context.emit("cosignTransaction", account);
      }
    }

    return {
      closeModal,
      showPasswdError,
      errorMessage,
      showError,
      walletPassword,
      cosignTransaction,
      isSigned,
      nothingToSign,
      needSigning,
      cannotSign
    };
  }
}
</script>