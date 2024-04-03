<template>
  <div
    class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md"
  >
    <div class="text-center font-semibold mt-16 text-gray-700 text-lg">
      {{ $t("home.signIn") }}
    </div>
    <div class="px-5 text-gray-700 md:text-lg text-tsm mt-4">
      <SignInComponent />
    </div>
    <!--  <div v-if ='currentNetwork == "Sirius Mainnet"'>
      <h2 class = 'my-10 ml-auto mr-auto'><span class = 'text-semibold'>or</span></h2>
      <div class="px-5 mt-4  text-center">
        <router-link :to="{ name: 'ViewHomeSignInSiriusID' }" >
          <div class="sirius-id-button bg-gray-200 py-2 w-8/12 ml-auto mr-auto ">
          <img src="@/assets/img/sirius-id-icon.svg" class="h-6 inline-block mr-1">{{$t('welcome.signinwithsiriusid')}}
          </div>
        </router-link>
      </div>
      </div> -->
    <div class="text-center text-xs mt-6">{{ $t("wallet.noWallet") }}</div>
    <div class="text-center text-xs text-blue-link font-semibold">
      <router-link :to="{ name: 'ViewWalletCreateSelection' }"
        >{{ $t("wallet.createSiriusWallet") }} ></router-link
      >
    </div>
    <div
      class="text-center text-xs text-blue-link font-semibold"
      v-if="migrationUI && haveOldWallet"
    >
      <div class="cursor-pointer" @click="oldWalletBackup">
        {{ $t("wallet.backupOldWallet") }}
      </div>
    </div>
    <div class="mt-1 h-16"></div>
  </div>
</template>

<script setup lang="ts">
//import SignInSiriusIDModal from '@/modules/home/views/ViewHomeSignInSiriusID.vue'
import SignInComponent from "@/modules/home/components/SignInComponent.vue";
import CryptoJS from "crypto-js";
import { appSetting } from "@/config/appSetting";
import { WalletUtils } from "@/util/walletUtils";
import { NetworkType } from "tsjs-xpx-chain-sdk";

let migrationUI = appSetting.backupOldWallet;

let mainnetOldFormat = localStorage.getItem("sw-mainnet");
let testnetOldFormat = localStorage.getItem("sw-testnet");

let haveOldWallet = mainnetOldFormat || testnetOldFormat;

let oldWalletBackup = () => {
  if (!haveOldWallet) {
    return;
  }

  const now = Date.now();
  const date = new Date(now);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  let backupType = mainnetOldFormat ? 1 : 2;
  let backupNetwork = "mainnet";

  if (backupType === 2) {
    backupNetwork = "testnet";
  }

  let wltData = JSON.parse(
    mainnetOldFormat ? mainnetOldFormat : testnetOldFormat
  );
  let addressBookPrefix =
    backupType === 1 ? "sw-books-mainnet-" : "sw-books-testnet-";

  for (let i = 0; i < wltData.length; ++i) {
    let allAddressBook = WalletUtils.oldFormatCollectAddressBook(
      wltData[i].name,
      addressBookPrefix
    );
    let newWallet = WalletUtils.oldFormatToNewFormat(
      wltData[i],
      "",
      backupType === 1 ? NetworkType.MAIN_NET : NetworkType.TEST_NET,
      allAddressBook
    );
    let wltRaw = JSON.stringify(newWallet);
    let wltBackup = CryptoJS.enc.Utf8.parse(wltRaw);
    let file = CryptoJS.enc.Base64.stringify(wltBackup);
    const blob = new Blob([file], { type: "" });
    const url = window.URL.createObjectURL(blob);
    let walletName = wltData[i].name;
    const a = document.createElement("a");
    a.style.display = "none";
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
