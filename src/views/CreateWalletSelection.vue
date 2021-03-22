<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold default-title mt-20">Select Wallet Creation Type</h1>
    <div class="page-title-gray-line grid grid-cols-1 md:grid-cols-3 pt-20">
      <div class="px-5 self-center text-center mb-10">
        <img src="../assets/img/icon-add-new-blue.svg" class="w-12 inline-block">
        <p class="mt-3">New Wallet</p>
        <router-link to="/create-wallet" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link></div>
      <div class="px-5 self-center text-center mb-10">
        <img src="../assets/img/icon-private-key-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Private Key</p>
        <router-link to="/import-wallet" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link>
      </div>
      <div class="px-5 self-center text-center mb-10"><img src="../assets/img/icon-wallet-import-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Wallet Backup</p>
        <label class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center cursor-pointer">
          <span>Import</span>
          <input type="file" @change="readWalletBackup" ref="walletFile" hidden />
        </label>
      </div>
    </div>
    <NotificationModal :toggleModal="toggle" :msg="msg" :notiType="notificationType" time='1500' />
  </div>
</template>

<script>
import { inject, ref, getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
import CryptoJS from 'crypto-js';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'CreateWalletSelection',
  components: {
    NotificationModal,
  },
  setup(){
    const router = useRouter();
    const internalInstance = getCurrentInstance();
    const appStore = inject("appStore");
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    // comparing with default networktype 168 till multiple network selection interface is added
    const selectedNetwork = ref("168");
    const notificationType = ref("err");
    const toggle = ref(false);
    const msg = ref('');
    const walletFile = ref('');

    emitter.on("CLOSE_NOTIFICATION", payload => {
      toggle.value = payload;
    });

    const readWalletBackup = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const file = CryptoJS.enc.Base64.parse(e.target.result);
        try {
          const dataDecryp = JSON.parse(file.toString(CryptoJS.enc.Utf8));
          const returnMsg = appStore.importWallet(dataDecryp, selectedNetwork.value);
          switch (returnMsg){
            case 'wallet_added':
              // msg.value = 'Wallet is added successfully.';
              router.push({ name: "Welcome", params: {toggle: true, modalMsg: 'Wallet is added successfully.' }});
              break;
            case 'invalid_network':
              msg.value = 'Network is invalid';
              notificationType.value = 'err';
              toggle.value = true;
              break;
            case 'existed_wallet':
              msg.value = 'Wallet already exist';
              notificationType.value = 'warn';
              toggle.value = true;
              break;
            case 'invalid_wallet':
              msg.value = 'Wallet is invalid';
              notificationType.value = 'err';
              toggle.value = true;
              break;
            default:
              msg.value = 'Unable to add wallet';
              notificationType.value = 'err';
              toggle.value = true;
          }
          setTimeout(() => {
            toggle.value = false;
            notificationType.value = '';
          }, 1500);
        } catch (error) {
          msg.value = 'Unable to add wallet. Invalid file.';
          notificationType.value = 'err';
          toggle.value = true;
          setTimeout(() => {
            toggle.value = false;
          }, 1500);
        }
      }
      reader.readAsText(file);
    }
    return {
      walletFile,
      toggle,
      appStore,
      readWalletBackup,
      msg,
      notificationType
    };
  },
}
</script>
