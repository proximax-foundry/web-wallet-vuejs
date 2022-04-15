<template>
  <div class='p-1'>      
    <div class="bg-white border rounded-lg border-gray-200 shadow-lg group " >
    <!-- <div class="flex justify-between bg-white border rounded-lg border-gray-200 shadow-lg group"> -->
      <!-- <div v-if="walletState.currentLoggedInWallet" class='border-l-4 rounded-l-lg border-blue-primary opacity-0 group-hover:opacity-100'>
      </div> -->
      <div class="flex justify-between items-center">
        <div class="ml-4 mt-5 mb-5 mr-5 text-txs text-left">      
          <div v-if="isLogin" class="font-bold text-blue-primary flex items-center">
            <div v-if="isLogin" class="w-36 inline truncate">{{ wallet.name }}
            <ConfirmDeleteWalletModal v-if="canDelete" :walletName="wallet.name"/> 
            </div>
            <div v-if="!isLogin" class="w-36 inline-block truncate">{{ wallet.name }}</div>
            <div v-if="!isLogin" class="ml-0 mt-4"> </div>
          </div>
          <div v-else class="font-bold text-blue-primary flex items-center">
              <div class="w-32 inline-block truncate">{{ wallet.name }}</div>
          </div>
          <div  class="text-txs pt-1 text-black-400">{{$t('wallet.numberOfAccounts')}}: <span>{{ wallet.accounts.length }}</span></div>
        </div>
        <div v-if="isLogin" class="xl:mr-3 xl:ml-0 text-xs font-bold">   
          <button class="bg-transparent font-bold py-2 ml-2 mr-2 rounded inline-flex items-center" @click="exportWallet(wallet.name)">
            <svg class="color-blue-primary" id="file_upload_black_24dp" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20">
            <path d="M15.667,13.167v2.5h-10v-2.5H4v2.5a1.672,1.672,0,0,0,1.667,1.667h10a1.672,1.672,0,0,0,1.667-1.667v-2.5Zm-9.167-5L7.675,9.342l2.158-2.15V14H11.5V7.192l2.158,2.15,1.175-1.175L10.667,4Z" fill="#007cff"/></svg>
            <span class="font-semibold text-txs">{{$t('general.export')}}</span>
          </button>
        </div>
        <div v-else class="xl:mr-1 xl:ml-5 text-xs font-bold">   
          <!-- <button class="font-bold py-2 sm:py-2 md:px-5 md:py-2 xl:py-2 xl:mr-2 xl:ml-0 rounded inline-flex items-center" @click="deleteWallet(wallet.name)">
          <svg id="clear_black_24dp" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <path id="Path_114" data-name="Path 114" d="M0,0H24V24H0Z" fill="none"/>
            <path id="Path_115" data-name="Path 115" d="M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89A1,1,0,0,0,7.11,18.3L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12,18.3,7.11A1,1,0,0,0,18.3,5.71Z"/>
          </svg>
          </button> -->
          <ConfirmDeleteWalletModal v-if="!isLogin " :walletName="wallet.name"/> 
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { ref,computed } from 'vue';
import { walletState } from '@/state/walletState';
import CryptoJS from 'crypto-js';
import ConfirmDeleteWalletModal from "@/modules/wallet/components/ConfirmDeleteWalletModal.vue";
import { networkState } from "@/state/networkState";
import { useI18n } from 'vue-i18n';

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
  
  setup(p){
    const showModal = ref(false);
    const {t} = useI18n();
    const passwdPattern = "^[^ ]{8,}$";
    const walletPassword = ref("");
    const err = ref("");
    const disableDelete = computed(() => !(walletPassword.value.match(passwdPattern)));
    const canDelete = computed(() =>{
      let boolean = true
      if(p.wallet.name==walletState.currentLoggedInWallet.name){
        boolean = false
      }
      return boolean
    })
    const getModal=()=>{
      showModal.value = true;
    };

    const deleteWallet = (walletName) => {   
      var networkName = networkState.chainNetworkName;
      walletState.wallets.removeWalletByNetworkNameAndName(networkName, walletName);
    };

    const exportWallet = (walletName) => {
      var networkName = networkState.chainNetworkName;
      const wallet = walletState.wallets.filterByNetworkNameAndName(networkName,walletName);
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
      a.download = `${walletName}_${networkName}_${year}-${month}-${day}.wlt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };
    const currentWalletName = computed(()=>{
      if(walletState.currentLoggedInWallet){
        return walletState.currentLoggedInWallet.name
      }else{
        return ''
      }
    }) 

    const isLogin = computed(()=>{
      return walletState.currentLoggedInWallet
    })

    return {
      exportWallet,
      getModal,
      showModal,
      disableDelete,
      err,
      isLogin,
      walletState,
      deleteWallet,
      currentWalletName,
      canDelete
    };
  }
 
});
</script>