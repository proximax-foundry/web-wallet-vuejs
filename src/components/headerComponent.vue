<template>
  <div class="flex-none self-center flex items-end logo">
    <router-link :to="(appStore.state.currentLoggedInWallet)?'/dashboard':'/'"><img src="../assets/img/logo-proximax-sirius-wallet-beta.svg" class="w-32"></router-link><span class="version-text">v{{ appStore.version }}</span>
  </div>
  <div class="flex-grow h-16"></div>
  <div class="flex-none header-menu mt-3" v-if="loginStatus">
    <div class=" flex flex-row">
      <div class="w-10 text-center flex flex-row h-10 items-center">
        <img src="../assets/img/icon-copy-notification-off-gray.svg" class="h-6 w-6 inline-block">
      </div>
      <div class="w-14 md:w-44 pl-3 text-center flex gray-line-left h-10 items-center">
        <div>
          <img src="../assets/img/icon-nodes-green-30h.svg" class="w-7 inline-block"> <div class="font-bold inline-block ml-1 text-xs" v-if="wideScreen">{{ networkType['name'] }}</div>
        </div>
      </div>
      <div class="w-52 pl-3 inline-block text-left gray-line-left h-10 items-center" v-if="wideScreen">
        <div>
          <div class="text-xs inline-block">{{ appStore.state.currentLoggedInWallet.name }}</div>
          <div class="text-xs">Total Balance: <span>100,000.0000</span> XPX</div>
        </div>
      </div>
      <div class="w-17 text-center h-10 items-center gray-line-left">
        <div class="text-xs inline-block mt-3" v-if="wideScreen">
          <a href="#" @click="logout()">Sign out</a>
        </div>
        <div class="inline-block mt-2" v-else>
          <font-awesome-icon icon="sign-out-alt" @click="logout()" class="text-blue-400 w-6 h-6 cursor-pointer ml-3"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-none self-center header-menu" v-else>
    <div class="w-16 text-center inline-block">
      <router-link to="/" class="font-normal hover:font-bold inline-block">Home</router-link>
    </div>
    <div class="w-16 text-center inline-block">
      <router-link to="/wallets" class="hover:font-bold">Wallets</router-link>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
export default{
  components: {
    FontAwesomeIcon
  },
  name: 'headerComponent',
  data() {
    return {
      login: false,
      wideScreen: false,
    };
  },
  setup() {
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const router = useRouter();
    const networkType = computed(
      () => {
        return siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network);
      }
    );

    const logout = () => {
      appStore.logoutOfWallet();
      if(sessionStorage.getItem('pageRefresh') == 'y'){
        window.location.href = '/';
      }else{
        router.push({ name: "Welcome"});
      }
    };

    const getAccountInfo = async () => {
      if (!appStore.state.currentLoggedInWallet) {
        // check sessionStorage
        if(!appStore.checkFromSession(siriusStore.accountHttp, siriusStore.namespaceHttp)){
          useRouter().replace({ path: "/" });
        }
      }
      return;
    };
    getAccountInfo();

    const loginStatus = computed(
      () => {
        if(!appStore.state.currentLoggedInWallet){
          // if empty, check from sessionStorage
          return appStore.checkFromSession(siriusStore.accountHttp, siriusStore.namespaceHttp);
        }else{
          // remain logged in when state.wallet is available
          return true;
        }
      }
    );

    return {
      appStore,
      networkType,
      loginStatus,
      logout,
      // walletName
    };
  },
  created() {
    this.headerMenuHandler();
    window.addEventListener("resize", this.headerMenuHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.headerMenuHandler);
  },
  methods: {
    headerMenuHandler: function (){
      if(window.innerWidth < '768'){
        this.wideScreen = false;
      }else{
        this.wideScreen = true;
      }
    }
  }
}
</script>

<style lang="scss">
.gray-line-left{
  border-left: 1px solid #E4E7EB;
}
</style>