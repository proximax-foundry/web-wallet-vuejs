<template>
  <div class='p-1'>      
    <div class="flex justify-between bg-white border rounded-lg border-gray-200 filter shadow-lg  group">
    <div class='border-l-4 rounded-l-lg border-blue-primary opacity-0 group-hover:opacity-100 '>
    </div>
      <div class="ml-5 mt-5 mr-5 mb-5 text-xs text-left">      
        <div class="font-bold text-blue-primary">{{ wallet.name }}  
          <img v-if="wallet.name!=walletState.currentLoggedInWallet.name" src="@/modules/wallet/img/icon-delete.svg" class="opacity-0 group-hover:opacity-100 inline-block" @click="getModal()">
          <div v-if="wallet.name == walletState.currentLoggedInWallet.name" class="mt-1"> </div>
        </div>
        <div class="text-txs text-black-400">Number of accounts: <span class="font-bold">{{ wallet.accounts.length }}</span></div>
      </div>
      <div class="mr-1 ml-5 text-xs font-bold flex">   
        <button class="bg-transparent font-bold py-2 px-4 rounded inline-flex items-center " @click="exportWallet(wallet.name)">
          <svg class="color-blue-primary" id="file_upload_black_24dp" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <path d="M15.667,13.167v2.5h-10v-2.5H4v2.5a1.672,1.672,0,0,0,1.667,1.667h10a1.672,1.672,0,0,0,1.667-1.667v-2.5Zm-9.167-5L7.675,9.342l2.158-2.15V14H11.5V7.192l2.158,2.15,1.175-1.175L10.667,4Z" fill="#007cff"/></svg>
          <span>Export</span>
        </button>
      </div>
    </div>
  </div>
  <ConfirmDeleteWalletModal :toggleModal="showModal" :walletName="wallet.name"/> 
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { ref,computed } from 'vue';
import { walletState } from '@/state/walletState';
import CryptoJS from 'crypto-js';
import ConfirmDeleteWalletModal from "@/modules/wallet/components/ConfirmDeleteWalletModal.vue";

export default defineComponent({
  name: 'WalletTile', 
  components: {
    ConfirmDeleteWalletModal
   },
  props: {
    wallet: {
      type: Object,
      default: null,
    },
  },
  
  setup(){
    const showModal = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const walletPassword = ref("");
    const err = ref("");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const disableDelete = computed(() => !(walletPassword.value.match(passwdPattern)));
 
    const getModal=()=>{
      showModal.value = true;
    };

    const exportWallet = (walletName) => {
      const wallet = walletState.wallets.filterByNetworkNameAndName(walletState.currentLoggedInWallet.networkName,walletName);
      //appStore.getWalletByName(walletName);
      let wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(wallet));
      let file = CryptoJS.enc.Base64.stringify(wordArray);
      const now = Date.now()
      const date = new Date(now);
      const year = date.getFullYear();
      const month = ((date.getMonth() + 1) < 10) ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
      const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();

      const blob = new Blob([file], { type: '' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      // let networkTypeName = siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network).name;
      // networkTypeName = (networkTypeName.includes(' ')) ? networkTypeName.split(' ').join('') : networkTypeName;
      a.download = `${walletName}_${walletState.currentLoggedInWallet.networkName}_${year}-${month}-${day}.wlt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    emitter.on("CLOSE_MODAL",(payload)=>{
        showModal.value = payload;
    });

    return {
      exportWallet,
      getModal,
      showModal,
      disableDelete,
      err,
      walletState
    };
  }
 
});
</script>