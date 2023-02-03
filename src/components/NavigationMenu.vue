<template>
  <div class="flex flex-col" @mouseover="hoverOverNavigation" @mouseout="hoverOutNavigation">
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div>
        <div class="cursor-pointer link_block flex items-center justify-between">
          <router-link :to="{ name: 'ViewAccountDetails', params: { address: selectedAccountAddress }}" class="flex items-center">
            <div class="mr-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
              <img src="@/assets/img/navi/icon-accounts-light.svg" class="h-3 w-3 inline-block relative">
            </div>
            <div class="truncate text-white">{{ selectedAccountName }}</div>
          </router-link>
          <router-link :to="{ name: 'ViewAccountDetails', params: { address: selectedAccountAddress }}"  class="block p-2 z-20 text-xs">
            <img src="@/modules/dashboard/img/icon-blue-chevron-right.svg" class=" h-6 w-6 cursor-pointer " >
          </router-link>
        </div>
        <!-- <div @click="updateDefaultAccount(item.name)" v-for="(item) in accounts" :key="item.address" class="cursor-pointer link_block flex items-center"><div class="mr-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"><img src="@/assets/img/navi/icon-accounts-light.svg" class="h-3 w-3 inline-block relative"></div><span class="truncate overflow-hidden text-white">{{ item.name }}</span></div> -->
      </div>
      <!-- <router-link :to="{ name: 'ViewAccountDisplayAll'}" class="link_block flex items-center text-white" v-if="allAccountsCount > 5" @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg" class="h-4 w-4 inline-block mr-1 text-white">View all accounts</router-link> -->
      <!-- <router-link :to="{ name: 'ViewAccountCreateSelectType'}" class="mt-2 block font-bold link_block text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-add.svg" class="h-4 w-4 inline-block relative mr-1">{{$t('general.createNewAcc')}}</router-link> -->
    </div>
   <!--  <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 lg:px-5 3xl:px-10 text-gray-400 uppercase">{{$t('general.transaction',2)}}</div>
      <div class="flex justify-start px-10 lg:px-5 3xl:px-10 mt-5">
        <router-link :to="{ name : 'ViewDashboard', params: {type: 'transaction' } }" class="relative mr-5"><div class="rounded-full h-8 w-8 flex items-center justify-center" style="background: #007CFF"><img src="@/assets/img/navi/icon-unconfirmed-transaction-white.svg" class="w-5 h-5"></div></router-link>
        <router-link :to="{ name : 'ViewTransactionStatus', params: {transactionType: 'unconfirmed' } }" class="relative mr-5"><div class="rounded-full h-8 w-8 flex items-center justify-center" style="background: #f3a91d"><img src="@/assets/img/navi/icon-unconfirmed-transaction-white.svg" class="w-5 h-5"></div><div class="absolute bg-gray-50 text-xxs rounded text-center" style="min-width: 15px; padding: 1px 2px; top: -5px; right: -8px;">{{ accountUnconfirmedTxnsCount }}</div></router-link>
        <router-link :to="{ name : 'ViewTransactionStatus', params: {transactionType: 'partial' } }" class="relative"><div class="rounded-full h-8 w-8 flex items-center justify-center" style="background: #f06623"><img src="@/assets/img/navi/icon-waiting-for-transaction-white.svg" class="w-5 h-5"></div><div class="absolute bg-gray-50 text-xxs rounded text-center" style="min-width: 15px; padding: 1px 2px; top: -5px; right: -8px;">{{ accountPartialTxnsCount }}</div></router-link>
      </div>
    </div> -->
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10  3xl:px-10 text-gray-400 uppercase">{{$t('general.createNew')}}</div>
      <router-link :to="{ name : 'ViewTransferCreate'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-transfer.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.transfer')}}</router-link>
      <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-namespace.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.namespace')}}</router-link>
      <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-asset.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.asset')}}</router-link>
      <router-link :to="{ name : 'ViewServicesMainnetSwap'}" class="link_block flex items-center text-white" @click="closeNavi" v-if="isDisplaySwap"><img src="@/assets/img/navi/icon-swap.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.swap')}}</router-link>
      <router-link :to="{ name : 'ViewAccountCreateSelectType'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.account',1)}}</router-link>
      <!-- <router-link :to="{ name : 'ViewServicesStackingOption'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg" class="h-3 w-3 inline-block relative mr-2">Stack</router-link> -->
      <!-- <router-link :to="{ name : 'ViewServices'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-services.svg" class="h-3 w-3 inline-block relative mr-2">Other Services</router-link> -->
    </div>
    <div class="border-b border-gray-700 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10  3xl:px-10 text-gray-400 uppercase">{{$t('home.navigate')}}</div>
      <router-link :to="{ name : 'ViewWallets'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-wallets.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.wallet',2)}}</router-link>
      <router-link :to="{ name : 'ViewAccountDisplayAll'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-accounts.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.account',2)}}</router-link>
      <router-link :to="{ name : 'ViewServicesAddressBook'}" class="link_block flex items-center text-white" @click="closeNavi"><img src="@/assets/img/navi/icon-address-book.svg" class="h-3 w-3 inline-block relative mr-2">{{$t('general.addressBook')}}</router-link>
      <router-link :to="{ name : 'ViewSettings'}" class="link_block flex items-center text-white" @click="closeNavi">
        <img src="@/assets/img/icon-setting-white.svg" class="h-3 w-3 inline-block relative mr-2">Settings
        </router-link>
    </div>
    <div class="flex-grow"></div>
    <div class="flex-glow-0 w-60 border-t border-gray-700">
      <a @click="logout()" class="signout_block flex items-center cursor-pointer text-white"><img src="@/assets/img/navi/icon-sign-out.svg" class="h-4 w-4 inline-block relative mr-2" @click="logout()">{{$t('home.signOut')}}</a>
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
import { DashboardService } from '@/modules/dashboard/service/dashboardService';
import {AppState} from '@/state/appState'

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

    const openSetDefaultModal = ref(false);
    let selectedAccount = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
      return walletState.currentLoggedInWallet.selectDefaultAccount()
    })

    const selectedAccountName = computed(() => {
      if(!selectedAccount.value){
        return ''
      }
      return selectedAccount.value.name;
    });

    const selectedAccountAddress = computed(() => {
      if(!selectedAccount.value){
        return '0'.repeat(40)
      }
      return selectedAccount.value.address;
    })

    const selectedAccountPublicKey = computed(() => {
      if(!selectedAccount.value){
        return '0'.repeat(64)
      }
      return selectedAccount.value.publicKey;
    })

    const isMultiSig = computed(() => {
      if(!selectedAccount.value){
        return
      }
      return selectedAccount.value.getDirectParentMultisig().length? true: false;
    });

    // default account menu
    const displayDefaultAccountMenu = ref(false);
    const booleanOverDefaultAccount = ref(false);
    const hoverOverSetDefaultMenu = () => {
      booleanOverDefaultAccount.value = true;
    }

    const hoverOutSetDefaultMenu = () => {
      booleanOverDefaultAccount.value = false;
    }

    emitter.on('PAGE_CLICK', () => {
      if(!booleanOverDefaultAccount.value){
        displayDefaultAccountMenu.value = false;
      }
    });

    let accountUnconfirmedTxnsCount = ref(0);
    let accountPartialTxnsCount = ref(0);

    let updateAccountTransactionCount = async() => {
      if(!AppState.isReady){
        setTimeout(updateAccountTransactionCount, 100);
        return ;
      }

      let dashboardService = new DashboardService(walletState.currentLoggedInWallet, selectedAccount.value);
      let transactionsCount = await dashboardService.getAccountTransactionsCount(selectedAccount.value);
      accountUnconfirmedTxnsCount.value = transactionsCount.unconfirmed;
      accountPartialTxnsCount.value = transactionsCount.partial;
    };

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

    emitter.on('DEFAULT_ACCOUNT_SWITCHED', payload => {
      if(!walletState.currentLoggedInWallet){
        return
      }
      // selectedAccount.value = walletState.currentLoggedInWallet.selectDefaultAccount();
      updateAccountTransactionCount();
    });

    const navigationSideBar = inject('navigationSideBar');

    const isDisplaySwap = computed(() => {
      return (networkState.chainNetworkName == 'Sirius Mainnet' || networkState.chainNetworkName == 'Sirius Testnet 1' || networkState.chainNetworkName == 'Sirius Testnet 2');
    });

    const logout = () => {
      WalletStateUtils.doLogout();
      sessionStorage.removeItem("defaultAcc");
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

    // const updateDefaultAccount = (accountName) => {
    //   currentAccount = walletState.currentLoggedInWallet.accounts.find((account)=> account.name === accountName);
    //   walletState.currentLoggedInWallet.setDefaultAccountByName(accountName);
    //   walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
    //   toast.add({severity:'success', summary: 'Default account has switched to' , detail: accountName, group: 'br-custom', life: 3000});
    //   emitter.emit('DEFAULT_ACCOUNT_SWITCHED', accountName);
    //   updateAccountTransactionCount();
    //   closeNavi();
    // }

    const init = ()=>{
      updateAccountTransactionCount();
    }

    if(AppState.isReady){
      init();
    }
    else{
      let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
          init();
          readyWatcher();
        }
      });
    }

    return {
      hoverOverSetDefaultMenu,
      hoverOutSetDefaultMenu,
      displayDefaultAccountMenu,
      logout,
      walletState,
      // accounts,
      // allAccountsCount,
      hoverOverNavigation,
      hoverOutNavigation,
      closeNavi,
      isDisplaySwap,
      accountUnconfirmedTxnsCount,
      accountPartialTxnsCount,
      // updateDefaultAccount,
      selectedAccountName,
      openSetDefaultModal,
      selectedAccountAddress,
      isMultiSig,
      selectedAccountPublicKey
    };
  }
}
</script>
<style lang="scss" scoped>
.link_block{
  @apply px-10  3xl:px-10 hover:bg-navy-lighter py-2 transition-all duration-200;
}

.signout_block{
  @apply  px-10  3xl:px-10 hover:bg-navy-lighter py-5 transition-all duration-200;
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
  border-left:1px solid #E4E4E4;
  border-top:1px solid #E4E4E4;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
}
</style>