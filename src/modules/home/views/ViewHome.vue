<template>
  <div>
    <div class="container mx-auto md:grid md:grid-cols-2 lg:px-20 xl:px-40 gap-4 ">
      <IntroTextComponent />
      <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
        <div class='text-center font-semibold mt-16 text-gray-700 text-lg'>{{ $t('home.signIn') }}</div>
        <div class="px-5 text-gray-700 md:text-lg text-tsm mt-4">
          <SignInComponent />
        </div>
        <div class='text-center text-xs mt-6'>{{ $t('wallet.noWallet') }}</div>
        <div class="text-center  text-xs text-blue-link font-semibold"><router-link
            :to="{ name: 'ViewWalletCreateSelection' }">{{ $t('wallet.createSiriusWallet') }} ></router-link></div>
        <div class='text-center text-xs text-blue-link font-semibold ' v-if="migrationUI && haveOldWallet">
          <div class="cursor-pointer" @click="oldWalletBackup">{{ $t('wallet.backupOldWallet') }}</div>
        </div>
        <div class='mt-1 h-16 '></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SignInComponent from '@/modules/home/components/SignInComponent.vue'
import IntroTextComponent from '@/components/IntroTextComponent.vue'
import CryptoJS from 'crypto-js';
import { appSetting } from '@/config/appSetting';
import { WalletUtils } from '@/util/walletUtils';
import { NetworkType } from 'tsjs-xpx-chain-sdk';
import { ref } from 'vue';

let migrationUI = appSetting.backupOldWallet;
let haveOldWallet = ref(false);

let mainnetOldFormat = localStorage.getItem("sw-mainnet");
let testnetOldFormat = localStorage.getItem("sw-testnet");


if (mainnetOldFormat || testnetOldFormat) {
  haveOldWallet.value = true
}

let oldWalletBackup = () => {

  if (!haveOldWallet) {
    return;
  }

  const now = Date.now()
  const date = new Date(now);
  const year = date.getFullYear();
  const month = ((date.getMonth() + 1) < 10) ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
  const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();

  let backupType = mainnetOldFormat ? 1 : 2;
  let backupNetwork = "mainnet";

  if (backupType === 2) {
    backupNetwork = "testnet";
  }

  let wltData = JSON.parse(mainnetOldFormat ? mainnetOldFormat : testnetOldFormat??"");
  let addressBookPrefix = backupType === 1 ? "sw-books-mainnet-" : "sw-books-testnet-";

  for (let i = 0; i < wltData.length; ++i) {
    let allAddressBook = WalletUtils.oldFormatCollectAddressBook(wltData[i].name, addressBookPrefix);
    let newWallet = WalletUtils.oldFormatToNewFormat(wltData[i], "", backupType === 1 ? NetworkType.MAIN_NET : NetworkType.TEST_NET, allAddressBook);
    let wltRaw = JSON.stringify(newWallet);
    let wltBackup = CryptoJS.enc.Utf8.parse(wltRaw);
    let file = CryptoJS.enc.Base64.stringify(wltBackup);
    const blob = new Blob([file], { type: '' });
    const url = window.URL.createObjectURL(blob);
    let walletName = wltData[i].name;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    // let networkTypeName = siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network).name;
    // networkTypeName = (networkTypeName.includes(' ')) ? networkTypeName.split(' ').join('') : networkTypeName;
    a.download = `oldWallet_${walletName}_${backupNetwork}_${year}-${month}-${day}.wlt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};


</script>

<style>
h2 {
  width: 60%;
  text-align: center;
  border-bottom: 1px solid #d3d3d3;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

h2 span {
  background: #fff;
  padding: 0 5px;
}

</style>