<template>
  <div class="flex-none self-center flex items-end logo">
    <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Welcome'}"><img src="../assets/img/logo-proximax-sirius-wallet-beta.svg" class="w-32"></router-link><span class="version-text">v{{ appStore.version }}</span>
  </div>
  <div class="flex-grow h-16"></div>
  <div class="flex-none header-menu mt-3" v-if="loginStatus">
    <div class=" flex flex-row">
      <div class="w-10 text-center flex flex-row h-10 items-center">
        <img src="../assets/img/icon-copy-notification-off-gray.svg" class="h-6 w-6 inline-block">
      </div>
      <div class="w-14 md:w-44 pl-3 text-center flex gray-line-left h-10 items-center">
        <div>
          <img src="../assets/img/icon-nodes-green-30h.svg" class="w-7 inline-block" :title="siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode)"> <div class="font-bold inline-block ml-1 text-xs" v-if="wideScreen">{{ siriusStore.state.chainNetworkName }}</div>
          <!-- networkType['name'] -->
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
          <a @click="logout()">Sign out</a>
        </div>
        <div class="inline-block mt-2" v-else>
          <font-awesome-icon icon="sign-out-alt" @click="logout()" class="text-blue-400 w-6 h-6 cursor-pointer ml-3"></font-awesome-icon>
        </div>
      </div>
    </div>
    <NotificationModal :toggleModal="toggleAnounceNotification" :msg="notificationMessage" :notiType="notificationType" time='2500' />
    <StatusNotificationModal :toggleModal="toggleStatusNotification" :msg="notificationMessage" :notiType="notificationType" time='2500' />
  </div>
  <div class="flex-none self-center header-menu" v-else>
    <div class="select mb-3 relative inline-block">
      <select v-model="selectedNetwork" class="text-gray-600 w-full border-solid border-b border-gray-200 p-2 mb-2 focus:outline-none cursor-pointer" @change="selectNetwork">
          <optgroup label="Networks">
          <option v-for="(name, index) of chainsNetworks" :value="index" :key="index" >{{ name }}</option>
          </optgroup>
          <optgroup label="Setting">
            <option value="customize" >Customize</option>
          </optgroup>
      </select>
    </div>
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
import StatusNotificationModal from '@/components/StatusNotificationModal.vue';

export default{
  components: {
    FontAwesomeIcon,
    NotificationModal,
    StatusNotificationModal,
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
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork");
    const router = useRouter();
    const toggleAnounceNotification = ref(false);
    const toggleStatusNotification = ref(false);
    const notificationMessage = ref('');
    const notificationType = ref('noti');
    // const networkType = computed(
    //   () => {
    //     return siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network);
    //   }
    // );

    const loginStatus = computed(() => appStore.state.isLogin);
    const chainsNetworks = computed(()=> siriusStore.state.availableNetworks);
    const selectedNetwork = ref(siriusStore.state.selectedNetwork);
    // set default for network selection if state.selectedNetwork is null
    if(siriusStore.state.selectedNetwork === ''){
      selectedNetwork.value = 0;
    }

    const selectNetwork= (e) =>{
      if(e.target.value !== 'customize'){
        chainNetwork.updateChainNetwork(parseInt(e.target.value));
      }
    }

    const logout = () => {
      let status = appStore.logoutOfWallet();
      if(status){
        router.push({ name: "Welcome"});
      }
    };

    const totalBalance = computed(()=>{
      return appStore.getTotalBalance();
    });

    transferEmitter.on("CONFIRMED_NOTIFICATION", payload => {
      if(payload.status){
        toggleAnounceNotification.value = payload.status;
        notificationType.value = payload.notificationType;
        notificationMessage.value = payload.message;
        var audio = new Audio(require('@/assets/audio/ding2.ogg'));
        audio.play();
      }
    });

    transferEmitter.on("UNCONFIRMED_NOTIFICATION", payload => {
      if(payload.status){
        toggleAnounceNotification.value = payload.status;
        notificationType.value = payload.notificationType;
        notificationMessage.value = payload.message;
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
      }
    });

    transferEmitter.on("STATUS_NOTIFICATION", payload => {
      if(payload.status){
        toggleStatusNotification.value = payload.status;
        notificationType.value = payload.notificationType;
        notificationMessage.value = payload.message;
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
      }
    });

    emitter.on("NOTIFICATION", payload => {
      if(payload.status){
        toggleAnounceNotification.value = payload.status;
        notificationType.value = payload.notificationType;
        notificationMessage.value = payload.message;
      }
    });

    transferEmitter.on("CLOSE_NOTIFICATION", payload => {
      toggleAnounceNotification.value = payload;
    });

    transferEmitter.on("CLOSE_STATUS_NOTIFICATION", payload => {
      toggleStatusNotification.value = payload;
    });

    return {
      appStore,
      siriusStore,
      // networkType,
      loginStatus,
      logout,
      totalBalance,
      toggleAnounceNotification,
      toggleStatusNotification,
      notificationMessage,
      notificationType,
      chainsNetworks,
      selectedNetwork,
      // selectedNetworkName,
      selectNetwork,
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
  }
}
</script>

<style lang="scss">
.gray-line-left{
  border-left: 1px solid #E4E7EB;
}
</style>