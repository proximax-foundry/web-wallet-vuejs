<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold default-title mt-20 mb-5">Select Wallet Creation Type</h1>
    <div class="page-title-gray-line grid grid-cols-1 md:grid-cols-3 pt-20">
      <div class="px-5 self-center text-center my-10">
        <img src="@/modules/wallet/img/icon-add-new-blue.svg" class="w-12 inline-block">
        <p class="mt-3">New Wallet</p>
        <router-link :to="{ name: 'ViewWalletCreate'}" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link></div>
      <div class="px-5 self-center text-center my-10">
        <img src="@/modules/wallet/img/icon-private-key-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Private Key</p>
        <router-link :to="{ name : 'ViewWalletCreatePrivateKey'}" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link>
      </div>
      <div class="px-5 self-center text-center my-10"><img src="@/modules/wallet/img/icon-wallet-import-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Wallet Backup</p>
        <label class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center cursor-pointer">
          <span>Import</span>
          <input type="file" @change="readWalletBackup" ref="walletFile" hidden />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, ref, computed } from 'vue';
import CryptoJS from 'crypto-js';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { WalletUtils } from '@/util/walletUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';

export default defineComponent({
  name: 'ViewWalletCreateSelection',
  setup(){
    const confirm = useConfirm();
    const toast = useToast();
    // comparing with default networktype 168 till multiple network selection interface is added
    const selectedNetworkType = computed(()=> ChainUtils.getNetworkType(networkState.chainNetwork));
    const selectedNetworkName = computed(()=> networkState.chainNetworkName);
    const msg = ref('');
    const walletFile = ref('');

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
            });
          }
          else{
            var importResult = importBackup(dataDecryp);
            toast.add({severity: importResult.status, summary: importResult.msg, group: 'br', life: 3000});
          }
        } catch (error) {
          msg.value = 'Unable to add wallet. Invalid file.';
          toast.add({severity:'error', summary:'Import Failed', detail: msg.value, group: 'br', life: 5000});
        }
      }
      reader.readAsText(file);
    };

    const importBackup = (dataDecryp) =>{
      const returnMsg = WalletUtils.importWalletNewFormat(dataDecryp, selectedNetworkName.value, selectedNetworkType.value);
      let status = "success";
      switch (returnMsg){
        case 'wallet_added':
          msg.value = 'Wallet is added successfully.';
          WalletStateUtils.refreshWallets();
          break;
        case 'invalid_network':
          msg.value = 'Network is invalid';
          status = "error";
          break;
        case 'existed_wallet':
          msg.value = 'Wallet already exist';
          status = "warn";
          break;
        case 'invalid_wallet':
          msg.value = 'Wallet is invalid';
          status = "error";
          break;
        default:
          msg.value = 'Unable to add wallet';
          status = "error";
      }
      return {
        msg: msg.value,
        status: status
      };
    };

    return {
      walletFile,
      readWalletBackup,
      msg,
    };
  },
});
</script>
