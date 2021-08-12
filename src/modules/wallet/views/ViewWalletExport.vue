<template>
<div class="flex justify-between text-xs sm:text-sm">
  <div><span class="text-gray-400">Wallet ></span> <span class="text-blue-primary font-bold">{{$t('wallets.exportWallet')}}</span></div>
  <div>
    <router-link :to="{ name: 'ViewWallets'}" class="font-bold" active-class="accounts">{{$t('wallets.deleteWallet')}}</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
      <div class="grid xs-grid-cols-1 sm:grid-cols-2 mt-10" v-else>
        <div class='p-3' :key="wallet.name" v-for="wallet in appStore.state.wallets">
          <div class="bg-gray-200 rounded-2xl flex justify-between py-3">
            <div class="ml-5 text-left text-sm"><div class="font-bold mb-1">{{ wallet.name }}</div><div class="text-xs">{{$t('common.account',(wallet.accounts.length>1)? 2: 1)}}: <span class="font-bold">{{ wallet.accounts.length }}</span></div></div>
            <div class="mr-5 self-center"><img src="@/assets/img/icon-wallet-export-blue.svg" class="w-7 cursor-pointer" @click="exportWallet(wallet.name)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import { ref, inject } from 'vue';
import CryptoJS from 'crypto-js';
// import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';

export default {
  name: 'ViewWalletExport',
  components: {
    // FontAwesomeIcon,
  },
  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");

    const err = ref(false);

    const exportWallet = (walletName) => {
      const wallet = appStore.getWalletByName(walletName);
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
      a.download = `${wallet.name}_${ siriusStore.state.chainNetworkName }_${year}-${month}-${day}.wlt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };


    return {
      appStore,
      exportWallet,
      err,
    };
  },
}
</script>