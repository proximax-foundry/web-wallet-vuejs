<template>
  <div class="container mx-auto text-center">
    <Toast />
    <Toast position="top-left" group="tl" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" />
    <ConfirmDialog></ConfirmDialog>
    <h1 class="font-bold default-title mt-20">Select Wallet Creation Type</h1>
    <div class="page-title-gray-line grid grid-cols-1 md:grid-cols-3 pt-20">
      <div class="px-5 self-center text-center mb-10">
        <img src="../assets/img/icon-add-new-blue.svg" class="w-12 inline-block">
        <p class="mt-3">New Wallet</p>
        <router-link :to="{ name: 'ViewCreateNewWallet'}" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link></div>
      <div class="px-5 self-center text-center mb-10">
        <img src="../assets/img/icon-private-key-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Private Key</p>
        <router-link :to="{ name : 'ViewCreatePrivateKeyWallet'}" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link>
      </div>
      <div class="px-5 self-center text-center mb-10"><img src="../assets/img/icon-wallet-import-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Wallet Backup</p>
        <label class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center cursor-pointer">
          <span>Import</span>
          <input type="file" @change="readWalletBackup" ref="walletFile" hidden />
        </label>
      </div>
    </div>
    <!-- <NotificationModal :toggleModal="toggle" :msg="msg" :notiType="notificationType" time='1500' /> -->
  </div>
</template>

<script>
import { inject, ref, computed } from 'vue'; //getCurrentInstance
// import { useRouter } from "vue-router";
import CryptoJS from 'crypto-js';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
// import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'CreateWalletSelection',
  components: {
    // NotificationModal,
  },
  setup(){
    const confirm = useConfirm();
    const toast = useToast();
    // const router = useRouter();
    // const internalInstance = getCurrentInstance();
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork");
    // const emitter = internalInstance.appContext.config.globalProperties.emitter;
    // comparing with default networktype 168 till multiple network selection interface is added
    // const selectedNetwork = ref("168");
    const selectedNetworkType = computed(()=> chainNetwork.getNetworkType());
    const selectedNetworkName = computed(()=> siriusStore.state.chainNetworkName);
    const notificationType = ref("err");
    // const toggle = ref(false);
    const msg = ref('');
    const walletFile = ref('');

    // emitter.on("CLOSE_NOTIFICATION", payload => {
    //   toggle.value = payload;
    // });

    const readWalletBackup = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const file = CryptoJS.enc.Base64.parse(e.target.result);
        try {
          const dataDecryp = JSON.parse(file.toString(CryptoJS.enc.Utf8));

          if(dataDecryp.networkName === undefined || dataDecryp.networkName !== selectedNetworkName.value){
            confirm.require({
              message: `You are about to import a wallet into ${selectedNetworkName.value}. Proceed ?`,
              header: 'Confirm Import',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                var importResult = importBackup(dataDecryp);
                toast.add({severity: importResult.status, summary: importResult.msg, group: 'br', life: 3000});
              },
              reject: () => {}
            });
          }
          else{
            var importResult = importBackup(dataDecryp);
            toast.add({severity: importResult.status, summary: importResult.msg, group: 'br', life: 3000});
          }
        } catch (error) {
          msg.value = 'Unable to add wallet. Invalid file.';
          toast.add({severity:'error', summary:'Import Failed', detail: msg.value, group: 'br', life: 5000});
          // notificationType.value = 'err';
          // toggle.value = true;
          // setTimeout(() => {
          //   toggle.value = false;
          // }, 1500);
        }
      }
      reader.readAsText(file);
    };

    const importBackup = (dataDecryp) =>{
      const returnMsg = appStore.importWallet(dataDecryp, selectedNetworkName.value, selectedNetworkType.value);
      let status = "success";
      switch (returnMsg){
        case 'wallet_added':
          msg.value = 'Wallet is added successfully.';
          // router.push({ name: "Welcome", params: {toggle: true, modalMsg: 'Wallet is added successfully.' }});
          break;
        case 'invalid_network':
          msg.value = 'Network is invalid';
          status = "error";
          // notificationType.value = 'err';
          // toggle.value = true;
          break;
        case 'existed_wallet':
          msg.value = 'Wallet already exist';
          status = "warn";
          // notificationType.value = 'warn';
          // toggle.value = true;
          break;
        case 'invalid_wallet':
          msg.value = 'Wallet is invalid';
          status = "error";
          // notificationType.value = 'err';
          // toggle.value = true;
          break;
        default:
          msg.value = 'Unable to add wallet';
          status = "error";
          // notificationType.value = 'err';
          // toggle.value = true;
      }
      // setTimeout(() => {
      //   toggle.value = false;
      //   notificationType.value = '';
      // }, 1500);
      return {
        msg: msg.value,
        status: status
      };
    };

    return {
      walletFile,
      // toggle,
      appStore,
      readWalletBackup,
      msg,
      notificationType
    };
  },
}
</script>
