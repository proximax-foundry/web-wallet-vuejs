<template>
  <div class="flex flex-col" @mouseover="hoverOverNavigation" @mouseout="hoverOutNavigation">
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div>
        <div class="cursor-pointer link_block flex items-center justify-between">
          <router-link :to="{ name: 'ViewAccountDetails', params: { address: selectedAccountAddress } }"
            class="flex items-center">
            <div class="mr-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
              <img src="@/assets/img/navi/icon-accounts-light.svg" class="h-3 w-3 inline-block relative">
            </div>
            <div class="truncate text-white">{{ selectedAccountName }}</div>
          </router-link>
          <router-link :to="{ name: 'ViewAccountDetails', params: { address: selectedAccountAddress } }"
            class="block p-2 z-20 text-xs">
            <img src="@/modules/dashboard/img/icon-blue-chevron-right.svg" class=" h-6 w-6 cursor-pointer ">
          </router-link>
        </div>
      </div>
    </div>

    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10  3xl:px-10 text-gray-400 uppercase">{{ $t('general.createNew') }}</div>
      <router-link :to="{ name: 'ViewTransferCreate' }" class="link_block flex items-center text-white"
        @click="closeNavi"><img src="@/assets/img/navi/icon-transfer.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.transfer') }}</router-link>
      <router-link :to="{ name: 'ViewServicesNamespaceCreate' }" class="link_block flex items-center text-white"
        @click="closeNavi"><img src="@/assets/img/navi/icon-namespace.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.namespace') }}</router-link>
      <router-link :to="{ name: 'ViewServicesAssetsCreate' }" class="link_block flex items-center text-white"
        @click="closeNavi"><img src="@/assets/img/navi/icon-asset.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.asset') }}</router-link>
      <router-link :to="{ name: 'ViewServicesMainnetSwap' }" class="link_block flex items-center text-white"
        @click="closeNavi" v-if="isDisplaySwap"><img src="@/assets/img/navi/icon-swap.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.swap') }}</router-link>
      <router-link :to="{ name: 'ViewAccountCreateSelectType' }" class="link_block flex items-center text-white"
        @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.account', 1) }}</router-link>
    </div>
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10  3xl:px-10 text-gray-400 uppercase">{{ $t('home.navigate') }}</div>
      <router-link :to="{ name: 'ViewWallets' }" class="link_block flex items-center text-white" @click="closeNavi"><img
          src="@/assets/img/navi/icon-wallets.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.wallet', 2) }}</router-link>
      <router-link :to="{ name: 'ViewAccountDisplayAll' }" class="link_block flex items-center text-white"
        @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.account', 2) }}</router-link>
      <router-link :to="{ name: 'ViewServicesAddressBook' }" class="link_block flex items-center text-white"
        @click="closeNavi"><img src="@/assets/img/navi/icon-address-book.svg"
          class="h-3 w-3 inline-block relative mr-2">{{ $t('general.addressBook') }}</router-link>
      <router-link :to="{ name: 'ViewSettings' }" class="link_block flex items-center text-white" @click="closeNavi">
        <img src="@/assets/img/icon-setting-white.svg" class="h-3 w-3 inline-block relative mr-2">Settings
      </router-link>
    </div>
    <div class="flex-grow"></div>
    <div class="flex-glow-0 w-60 border-t border-gray-700">
      <a @click="logout()" class="signout_block flex items-center cursor-pointer text-white"><img
          src="@/assets/img/navi/icon-sign-out.svg" class="h-4 w-4 inline-block relative mr-2"
          @click="logout()">{{ $t('home.signOut') }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, getCurrentInstance, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { walletState } from '@/state/walletState';
import { networkState } from "@/state/networkState";
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import { AppState } from '@/state/appState'

const showMenu = ref(false)
const showBar = ref(false)
const wideScreen = ref(false)
const navMenuHandler = () => {
  if (window.innerWidth < 768) {
    wideScreen.value = false;
    showBar.value = true;
    showMenu.value = false;
  } else {
    wideScreen.value = true;
    showBar.value = false;
    showMenu.value = true;
  }
}

onMounted(() => {
  navMenuHandler();
  window.addEventListener("resize", navMenuHandler);
})
onUnmounted(() => {
  window.removeEventListener("resize", navMenuHandler);
})

const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const router = useRouter();

let selectedAccount = computed(() => {
  if (!walletState.currentLoggedInWallet) {
    return null
  }
  return walletState.currentLoggedInWallet.selectDefaultAccount()
})

const selectedAccountName = computed(() => {
  if (!selectedAccount.value) {
    return ''
  }
  return selectedAccount.value.name;
});

const selectedAccountAddress = computed(() => {
  if (!selectedAccount.value) {
    return '0'.repeat(40)
  }
  return selectedAccount.value.address;
})

// default account menu
const displayDefaultAccountMenu = ref(false);
const booleanOverDefaultAccount = ref(false);

emitter.on('PAGE_CLICK', () => {
  if (!booleanOverDefaultAccount.value) {
    displayDefaultAccountMenu.value = false;
  }
});

let accountUnconfirmedTxnsCount = ref(0);
let accountPartialTxnsCount = ref(0);

let updateAccountTransactionCount = async () => {
  if (!AppState.isReady) {
    setTimeout(updateAccountTransactionCount, 100);
    return;
  }
  if(!walletState.currentLoggedInWallet || !selectedAccount.value){
    return
  }
  let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);
  let transactionsCount = await dashboardService.getAccountTransactionsCount(selectedAccount.value);
  accountUnconfirmedTxnsCount.value = transactionsCount.unconfirmed;
  accountPartialTxnsCount.value = transactionsCount.partial;
};

emitter.on("TXN_UNCONFIRMED", (num: number) => {
  if (num > 0) {
    updateAccountTransactionCount();
  }
});

emitter.on("TXN_CONFIRMED", (num: number) => {
  if (num > 0) {
    updateAccountTransactionCount();
  }
});

emitter.on("ABT_ADDED", (num: number) => {
  if (num > 0) {
    updateAccountTransactionCount();
  }
});

emitter.on('DEFAULT_ACCOUNT_SWITCHED', () => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  updateAccountTransactionCount();
});

const navigationSideBar: { isOpen: boolean, inNavi: boolean } | undefined = inject('navigationSideBar');

const isDisplaySwap = computed(() => {
  return (networkState.chainNetworkName == 'Sirius Mainnet' || networkState.chainNetworkName == 'Sirius Testnet 1' || networkState.chainNetworkName == 'Sirius Testnet 2');
});

const logout = () => {
  walletState.isLogin = false;
  router.push({ name: "Home" });
  closeNavi();
};

// const isShowNavi = ref(false);
const hoverOverNavigation = () => {
  if (navigationSideBar) {
    navigationSideBar.inNavi = true;
  }
}

const hoverOutNavigation = () => {
  if (navigationSideBar) {
    navigationSideBar.inNavi = false;
  }
}

const closeNavi = () => {
  if (navigationSideBar) {
    navigationSideBar.inNavi = false;
    navigationSideBar.isOpen = false;
  }
}

// const updateDefaultAccount = (accountName) => {
//   currentAccount = walletState.currentLoggedInWallet.accounts.find((account)=> account.name === accountName);
//   walletState.currentLoggedInWallet.setDefaultAccountByName(accountName);
//   walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
//   toast.add({severity:'success', summary: 'Default account has switched to' , detail: accountName, group: 'br-custom', life: 3000});
//   emitter.emit('DEFAULT_ACCOUNT_SWITCHED', accountName);
//   updateAccountTransactionCount();
//   closeNavi();
// }

const init = () => {
  updateAccountTransactionCount();
}

if (AppState.isReady) {
  init();
}
else {
  let readyWatcher = watch(AppState, (value) => {
    if (value.isReady) {
      init();
      readyWatcher();
    }
  });
}


</script>
<style lang="scss" scoped>
.link_block {
  @apply px-10  hover:bg-navy-lighter py-2 transition-all duration-200;
}

.signout_block {
  @apply px-10  hover:bg-navy-lighter py-5 transition-all duration-200;
}

.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -4px;
  right: 7px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left: 1px solid #E4E4E4;
  border-top: 1px solid #E4E4E4;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}</style>