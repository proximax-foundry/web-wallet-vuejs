<template>
  <div class="flex flex-col" @mouseover="hoverOverNavigation" @mouseout="hoverOutNavigation">
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 lg:px-5 3xl:px-10 font-txs text-gray-400">ACCOUNTS ({{ allAccountsCount }})</div>
      <div>
        <div @click="updateDefaultAccount(item.name)" v-for="(item) in accounts" :key="item.address" class="cursor-pointer link_block flex items-center"><div class="mr-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"><img src="@/assets/img/navi/icon-accounts-light.svg" class="h-3 w-3 inline-block relative"></div><span class="truncate overflow-hidden text-white">{{ item.name }}</span></div>
      </div>
      <!-- <router-link :to="{ name: 'ViewAccountDisplayAll'}" class="link_block flex items-center text-white" v-if="allAccountsCount > 5" @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg" class="h-4 w-4 inline-block mr-1 text-white">View all accounts</router-link> -->
      <router-link :to="{ name: 'ViewAccountCreateSelectType'}" class="block font-bold link_block text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-add.svg" class="h-4 w-4 inline-block relative mr-1">Create New Account</router-link>
    </div>
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 lg:px-5 3xl:px-10 text-gray-400">Transactions</div>
      <div class="flex justify-start px-10 lg:px-5 3xl:px-10 mt-5">
        <router-link :to="{ name : 'ViewDashboard', params: {type: 'transaction' } }" class="relative mr-5"><div class="rounded-full h-8 w-8 flex items-center justify-center" style="background: #007CFF"><img src="@/assets/img/navi/icon-unconfirmed-transaction-white.svg" class="w-5 h-5"></div></router-link>
        <router-link :to="{ name : 'ViewTransactionStatus', params: {transactionType: 'unconfirmed' } }" class="relative mr-5"><div class="rounded-full h-8 w-8 flex items-center justify-center" style="background: #f3a91d"><img src="@/assets/img/navi/icon-unconfirmed-transaction-white.svg" class="w-5 h-5"></div><div class="absolute bg-gray-50 text-xxs rounded text-center" style="min-width: 15px; padding: 1px 2px; top: -5px; right: -8px;">{{ accountUnconfirmedTxnsCount }}</div></router-link>
        <router-link :to="{ name : 'ViewTransactionStatus', params: {transactionType: 'partial' } }" class="relative"><div class="rounded-full h-8 w-8 flex items-center justify-center" style="background: #f06623"><img src="@/assets/img/navi/icon-waiting-for-transaction-white.svg" class="w-5 h-5"></div><div class="absolute bg-gray-50 text-xxs rounded text-center" style="min-width: 15px; padding: 1px 2px; top: -5px; right: -8px;">{{ accountPartialTxnsCount }}</div></router-link>
      </div>
    </div>
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 lg:px-5 3xl:px-10 text-gray-400 uppercase">Quick Action</div>
      <router-link :to="{ name : 'ViewTransferCreate'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-transfer.svg" class="h-3 w-3 inline-block relative mr-2">Transfer</router-link>
      <router-link :to="{ name : 'ViewServicesNamespace'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-namespace.svg" class="h-3 w-3 inline-block relative mr-2">Namespace</router-link>
      <router-link :to="{ name : 'ViewServicesAssets'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-asset.svg" class="h-3 w-3 inline-block relative mr-2">Asset</router-link>
      <router-link :to="{ name : 'ViewServicesMainnetSwap'}" class="link_block flex items-center text-white" @click="closeNavi" v-if="isDisplaySwap"><img src="@/assets/img/navi/icon-swap.svg" class="h-3 w-3 inline-block relative mr-2">Swap</router-link>
      <!-- <router-link :to="{ name : 'ViewServices'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-services.svg" class="h-3 w-3 inline-block relative mr-2">Other Services</router-link> -->
    </div>
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 lg:px-5 3xl:px-10 text-gray-400">NAVIGATE</div>
      <router-link :to="{ name : 'ViewWallets'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-wallets.svg" class="h-3 w-3 inline-block relative mr-2">Wallets</router-link>
      <router-link :to="{ name : 'ViewAccountDisplayAll'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg" class="h-3 w-3 inline-block relative mr-2">Accounts</router-link>
      <router-link :to="{ name : 'ViewServicesAddressBook'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-address-book.svg" class="h-3 w-3 inline-block relative mr-2">Address Book</router-link>
    </div>
    <div class="flex-grow"></div>
    <div class="flex-glow-0 w-60 border-t border-gray-700">
      <a @click="logout()" class="signout_block flex items-center cursor-pointer text-white"><img src="@/assets/img/navi/icon-sign-out.svg" class="h-4 w-4 inline-block relative mr-2" @click="logout()">{{$t('Header.signout')}}</a>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, getCurrentInstance, watch } from "vue";
import { useRouter } from "vue-router";
import { walletState } from '@/state/walletState';
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { networkState } from "@/state/networkState";
import { useI18n } from 'vue-i18n';
import { useToast } from "primevue/usetoast";
import { AppState } from '@/state/appState';
import { DashboardService } from '@/modules/dashboard/service/dashboardService';

export default{
  name: 'NavigationMenu',
  data() {
    return {
      showMenu: false,
      showBar : false,
      wideScreen: false,
      menuColorClass: 'text-gray-700'
    };
  },
  methods: {
    showhideMenu: function (){
      this.showMenu = !this.showMenu;
      if(this.showMenu){
        this.menuColorClass = 'text-gray-300';
      }else{
        this.menuColorClass = 'text-gray-700';
      }
    },
    navMenuHandler: function (){
      if(window.innerWidth < '768'){
        this.wideScreen = false;
        this.showBar = true;
        this.showMenu = false;
      }else{
        this.wideScreen = true;
        this.showBar = false;
        this.showMenu = true;
      }
    },
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input]
      return paths.some(path => {
        return this.$route.path.indexOf(path) === 0 // current path starts with this path string
      })
    }
  },
  created() {
    this.navMenuHandler();
    window.addEventListener("resize", this.navMenuHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.navMenuHandler);
  },
  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const toast = useToast();
    const {t} = useI18n();
    const router = useRouter();

    let currentAccount = walletState.currentLoggedInWallet.selectDefaultAccount() ? walletState.currentLoggedInWallet.selectDefaultAccount() : walletState.currentLoggedInWallet.accounts[0];
    currentAccount.default = true;

    const selectedAccount = ref(currentAccount);

    let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);

    let accountUnconfirmedTxnsCount = ref(0);
    let accountPartialTxnsCount = ref(0);

    let updateAccountTransactionCount = async()=>{
      let transactionsCount = await dashboardService.getAccountTransactionsCount(currentAccount);
      accountUnconfirmedTxnsCount.value = transactionsCount.unconfirmed;
      accountPartialTxnsCount.value = transactionsCount.partial;
    };
    // updateAccountTransactionCount();

    emitter.on("TXN_UNCONFIRMED", (num) => {
      if(num> 0){
        updateAccountTransactionCount();
      }
    });

    emitter.on("TXN_CONFIRMED", (num) => {
      if(num> 0){
        updateAccountTransactionCount();
      }
    });

    emitter.on("ABT_ADDED", (num) => {
      if(num> 0){
        updateAccountTransactionCount();
      }
    });

    const navigationSideBar = inject('navigationSideBar');

    const allAccountsCount = computed(
      () => {
        if(walletState.currentLoggedInWallet){
          if(walletState.currentLoggedInWallet.others){
            const concatOther = walletState.currentLoggedInWallet.accounts.length
            return concatOther;
          } else{
            return walletState.currentLoggedInWallet.accounts.length;
          }
        } else{
          return null;
        }
      }
    );

    const accounts = computed(
      () => {
        if(walletState.currentLoggedInWallet){
          let displayAccounts = [];
          let accountCount;
          if(walletState.currentLoggedInWallet.accounts.length < 6){
            accountCount = walletState.currentLoggedInWallet.accounts.length;
          }else{
            accountCount = 5;
          }
          for(var a = 0; a < accountCount; ++a){
            displayAccounts.push(walletState.currentLoggedInWallet.accounts[a]);
          }
          return displayAccounts;
        }else{
          return null;
        }
      }
    );

    const isDisplaySwap = computed(() => {
      return (networkState.chainNetworkName == 'Sirius Mainnet' || networkState.chainNetworkName == 'Sirius Testnet 1' || networkState.chainNetworkName == 'Sirius Testnet 2');
    });

    const logout = () => {
      WalletStateUtils.doLogout();
      router.push({ name: "Home"});
      closeNavi();
    };

    // const isShowNavi = ref(false);
    const hoverOverNavigation = () => {
      navigationSideBar.inNavi = true;
    }

    const hoverOutNavigation = () => {
      navigationSideBar.inNavi = false;
    }

    const closeNavi = () => {
      navigationSideBar.inNavi = false;
      navigationSideBar.isOpen = false;
    }

    const updateDefaultAccount = (accountName) => {
      walletState.currentLoggedInWallet.setDefaultAccountByName(accountName);
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
      toast.add({severity:'success', summary: 'Default account has switched to' , detail: accountName, group: 'br', life: 3000});
      emitter.emit('DEFAULT_ACCOUNT_SWITCHED', accountName);
      closeNavi();
    }

    const init = ()=>{
      updateAccountTransactionCount();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState.isReady, (value) => {
        if(value){
          init();
          readyWatcher();
        }
      });
    }

    return {
      logout,
      walletState,
      accounts,
      allAccountsCount,
      hoverOverNavigation,
      hoverOutNavigation,
      closeNavi,
      isDisplaySwap,
      accountUnconfirmedTxnsCount,
      accountPartialTxnsCount,
      updateDefaultAccount,
    };
  }
}
</script>
<style lang="scss" scoped>
.link_block{
  @apply px-10 lg:px-5 3xl:px-10 hover:bg-navy-lighter py-2 transition-all duration-200;
}

.signout_block{
  @apply px-10 hover:bg-navy-lighter py-5 transition-all duration-200;
}
</style>
