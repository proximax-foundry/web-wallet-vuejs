<template>
  <div class="flex-none self-center flex items-end logo">
    <router-link :to="(appStore.state.currentLoggedInWallet)? {name : 'ViewDashboard'}: {name: 'Welcome'}"><img src="../assets/img/logo-proximax-sirius-wallet-beta.svg" class="w-32"></router-link><span class="version-text">v{{ appStore.version }}</span>
  </div>
  <div class="flex-grow h-16"></div>
  <div class="flex-none flex items-end">
    <div>
        <div class="select mb-3" style="position: relative">
          <font-awesome-icon icon="times" class="text-gray-400 hover:text-gray-600 cursor-pointer" style="display: inline-block; position: absolute; top: 9px; right: 25px;" @click="clearSelection()" v-if="displayClearIcon" />
          <select :value="selectedNetwork" class="text-gray-600 w-full border-solid border-b border-gray-200 p-2 mb-2 focus:outline-none" @change="networkSelection">
             <optgroup label="Networks">
              <option v-for="(name, index) of chainsNetwork" :value="index" :key="index" >{{ name }}</option>
             </optgroup>
             <optgroup label="Setting">
              <option value="customize" >Customize</option>
             </optgroup>
          </select>
        </div>
      </div>
  </div>
  <div class="flex-none header-menu mt-3" v-if="loginStatus">
    <div class=" flex flex-row">
      <div class="w-10 text-center flex flex-row h-10 items-center">
        <img src="../assets/img/icon-copy-notification-off-gray.svg" class="h-6 w-6 inline-block">
      </div>
      <div class="w-14 md:w-44 pl-3 text-center flex gray-line-left h-10 items-center">
        <div>
          <img src="../assets/img/icon-nodes-green-30h.svg" class="w-7 inline-block"> <div class="font-bold inline-block ml-1 text-xs" v-if="wideScreen">{{ networkName }}</div>
        </div>
      </div>
      <div class="w-52 pl-3 inline-block text-left gray-line-left h-10 items-center" v-if="wideScreen">
        <div>
          <div class="text-xs inline-block">{{ appStore.state.currentLoggedInWallet.name }}</div>
          <div class="text-xs">Total Balance: <span>{{ totalBalance }}</span> XPX</div>
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
    <NotificationModal :toggleModal="toggleAnounceNotification" msg="Transaction confirmed" notiType="noti" time='2500' />
  </div>
  <div class="flex-none self-center header-menu" v-else>
    <div class="w-16 text-center inline-block">
      <router-link :to="{ name: 'Welcome'}" class="font-normal hover:font-bold inline-block">Home</router-link>
    </div>
    <div class="w-16 text-center inline-block">
      <router-link :to="{ name: 'ViewWallets'}" class="hover:font-bold">Wallets</router-link>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import { transferEmitter } from '../util/listener.js';
import NotificationModal from '@/components/NotificationModal.vue';
import { ChainProfileNames } from '../store/storeClasses';

export default{
  components: {
    FontAwesomeIcon,
    NotificationModal,
  },
  name: 'headerComponent',
  data() {
    return {
      login: false,
      wideScreen: false,
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const router = useRouter();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const toggleAnounceNotification = ref(false);
    const chainsNetwork = computed(()=> ChainProfileNames.createDefault().names);
    let selectedNetwork = localStorage.getItem("lastAccessNetwork") ? parseInt(localStorage.getItem("lastAccessNetwork")) : 0;

    if(chainsNetwork.value[selectedNetwork] === undefined){
      selectedNetwork = 0;
    }    

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
        if(!appStore.checkFromSession(appStore, siriusStore)){
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

    const totalBalance = computed(()=>{
      return appStore.getTotalBalance();
    });

    transferEmitter.on("TRANSACTION_CONFIRMED_NOTIFICATION", verify => {
      if(verify){
        toggleAnounceNotification.value = true;
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
      }
    });

    transferEmitter.on("CLOSE_NOTIFICATION", payload => {
      toggleAnounceNotification.value = payload;
    });

    let networkName = chainsNetwork.value[selectedNetwork];

    if(networkName){
      sessionStorage.setItem("selectedNetwork", selectedNetwork);
      sessionStorage.setItem("selectedNetworkName", networkName);
      siriusStore.refreshselectedNetwork();
    }

    const networkSelection= (e) =>{

      if(e.target.value !== 'customize'){

        networkName = chainsNetwork.value[parseInt(e.target.value)];
        sessionStorage.setItem("selectedNetwork", e.target.value);
        sessionStorage.setItem("selectedNetworkName", networkName);
        selectedNetwork = e.target.value.id;
        siriusStore.refreshselectedNetwork();
        emitter.emit("SELECT NETWORK", { id: e.target.value, name: networkName });
      }
    }

    return {
      appStore,
      loginStatus,
      logout,
      totalBalance,
      toggleAnounceNotification,
      chainsNetwork,
      selectedNetwork,
      networkSelection
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
    },
    displayNotification: function (){
      console.log('hellonotti')
    }
  }
}
</script>

<style lang="scss">
.gray-line-left{
  border-left: 1px solid #E4E7EB;
}
</style>