<template>
  <div class="flex flex-col">
    <div class="border-b border-gray-200 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 font-txs text-gray-400">ACCOUNTS ({{ allAccountsCount }})</div>
      <div>
        <router-link :to="{ name: 'ViewAccountDetails', params: { address: item.address }}" v-for="(item, index) in accounts" :key="index" class="link_block flex items-center"><div class="mr-2 bg-gray-200 rounded-full w-5 h-5 flex items-center"><div class="text-center w-full"><img src="@/assets/img/navi/icon-accounts-light.svg" class="h-3 w-3 inline-block relative"></div></div><span class="truncate overflow-hidden">{{ item.name }}</span></router-link>
      </div>
      <router-link :to="{ name: 'ViewAccountDisplayAll'}" class="link_block flex items-center" v-if="allAccountsCount > 5"><img src="@/assets/img/navi/icon-accounts.svg" class="h-4 w-4 inline-block mr-1">View all accounts</router-link>
      <router-link :to="{ name: 'ViewAccountCreateSelectType'}" class="block font-bold link_block"><img src="@/assets/img/navi/icon-add.svg" class="h-4 w-4 inline-block relative mr-1">Create New Account</router-link>
    </div>
    <div class="border-b border-gray-200 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 text-gray-400">CREATE</div>
      <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="link_block flex items-center"><img src="@/assets/img/navi/icon-namespace.svg" class="h-3 w-3 inline-block relative mr-2">Namespace</router-link>
      <router-link :to="{ name : 'ViewServicesAssetsCreate'}"  class="link_block flex items-center"><img src="@/assets/img/navi/icon-asset.svg" class="h-3 w-3 inline-block relative mr-2">Asset</router-link>
      <router-link :to="{ name : 'ViewServices'}"  class="link_block flex items-center"><img src="@/assets/img/navi/icon-services.svg" class="h-3 w-3 inline-block relative mr-2">Other Services</router-link>
    </div>
    <div class="border-b border-gray-200 py-5 w-60 flex-grow-0">
      <div class="my-3 px-10 text-gray-400">NAVIGATE</div>
      <router-link :to="{ name : 'ViewWallets'}" class="link_block flex items-center"><img src="@/assets/img/navi/icon-wallets.svg" class="h-3 w-3 inline-block relative mr-2">Wallets</router-link>
      <router-link :to="{ name : 'ViewAccountDisplayAll'}" class="link_block flex items-center"><img src="@/assets/img/navi/icon-accounts.svg" class="h-3 w-3 inline-block relative mr-2">Accounts</router-link>
      <router-link :to="{ name : 'ViewServicesAddressBook'}" class="link_block flex items-center"><img src="@/assets/img/navi/icon-address-book.svg" class="h-3 w-3 inline-block relative mr-2">Address Book</router-link>
    </div>
    <div class="flex-grow"></div>
    <div class="flex-glow-0 w-60">
      <a @click="logout()" class="signout_block flex items-center cursor-pointer"><img src="@/assets/img/navi/icon-sign-out.svg" class="h-3 w-3 inline-block relative mr-2" @click="logout()">{{$t('Header.signout')}}</a>
    </div>

    <!-- <font-awesome-icon @click="showhideMenu();" icon="bars" :class="menuColorClass" class="menuBar absolute w-4 cursor-pointer" style="right: 7px; top: 9px;" v-if="showBar"></font-awesome-icon> -->
    <!-- <nav class="navbar" ref="navbarRef" v-if="showMenu">
      <router-link class="col" class-active="active" :to="{ name : 'ViewDashboard'}">{{$t('NavigationMenu.Dashboard')}}</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewTransferCreate'}">{{$t('NavigationMenu.Transfer')}}</router-link>
      <router-link class="col" class-active="active" :to="{ name : 'ViewAccountDisplayAll'}" :class="{'router-link-active': subIsActive([
        '/view-all-accounts',
        '/select-type-creation-account',
        '/create-account',
        '/import-account',
        '/delete-account',
        '/details-account',
        '/created-account',
        '/convert-account-multisign',
        '/edit-account-multisign',
        '/delegate', 
        '/alias-address-to-namespace',
      ])}">{{$t('NavigationMenu.Accounts')}}</router-link>
    </nav>
    <nav class="navbar h-9" v-else>
    </nav> -->
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { walletState } from '@/state/walletState';
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import {useI18n} from 'vue-i18n';

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
    const {t} = useI18n();
    const router = useRouter();
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

    const logout = () => {
      WalletStateUtils.doLogout();
      router.push({ name: "Home"});
      console.log('logout')
    };

    return {
      logout,
      walletState,
      accounts,
      allAccountsCount
    };
  }
}
</script>
<style lang="scss" scoped>
.link_block{
  @apply px-10 hover:bg-white py-2 transition-all duration-200;
}

.signout_block{
  @apply px-10 hover:bg-white py-5 transition-all duration-200;
}
</style>
