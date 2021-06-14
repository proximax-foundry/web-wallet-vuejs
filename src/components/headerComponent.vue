<template>
  <div class="flex-none self-center flex items-end logo">
    <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}"><img src="../assets/img/logo-proximax-sirius-wallet-beta.svg" class="w-32"></router-link><span class="version-text">v{{ appStore.version }}</span>
  </div>
  <div class="flex-grow h-16"></div>
  <div class="flex-none header-menu mt-3" v-if="loginStatus">
    <div class=" flex flex-row">
      <div class="w-16 inline-block items-center relative">
        <SelectLanguagePlugin style="position: absolute; top: 0px" />
      </div>
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
  </div>
  <div class="flex-none self-center header-menu" v-else>
    <div class="w-16 inline-block mr-3 self-center">
      <SelectLanguagePlugin />
    </div>
    <div class="select mb-3 inline-block">
      <!-- <select v-model="selectedNetwork" class="text-gray-600 w-full border-solid border-b border-gray-200 p-2 mb-2 focus:outline-none cursor-pointer" @change="selectNetwork">
          <optgroup label="Networks">
          <option v-for="(name, index) of chainsNetworks" :value="index" :key="index" >{{ name }}</option>
          </optgroup>
          <optgroup label="Setting">
            <option value="customize" >Customize</option>
          </optgroup>
      </select> -->
      <Dropdown v-model="selectedNetwork" name="selectedNetwork" :options="chainsNetworkOption" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" @change="selectNetwork"></Dropdown>
    </div>
    <div class="w-16 text-center inline-block">
      <router-link :to="{ name: 'Home'}" class="font-normal hover:font-bold inline-block">Home</router-link>
    </div>
    <div class="w-16 text-center inline-block">
      <router-link :to="{ name: 'ViewWallets'}" class="hover:font-bold">Wallets</router-link>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { transferEmitter } from '../util/listener.js';
import Dropdown from 'primevue/dropdown';
import SelectLanguagePlugin from '@/components/SelectLanguagePlugin.vue';
import { useToast } from "primevue/usetoast";

export default{
  components: {
    Dropdown,
    SelectLanguagePlugin,
  },

  name: 'headerComponent',
  data() {
    return {
      login: false,
      wideScreen: false,
    };
  },
  setup() {
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork");
    const router = useRouter();
    const notificationMessage = ref('');
    const notificationType = ref('noti');
    // const networkType = computed(
    //   () => {
    //     return siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network);
    //   }
    // );

    const loginStatus = computed(() => appStore.state.isLogin);
    const chainsNetworks = computed(()=> {
      let options = [];
      siriusStore.state.availableNetworks.forEach((network, index) => {
        options.push({ label: network, value: index });
      });
      return options;
    });


    const chainsNetworkOption = [{
      label: 'Networks',
      items: chainsNetworks.value
    }, {
      label: 'Setting',
      items: [
        {label: 'Customize', value: 'customize'}
      ]
    }];

    // const selectedNetwork = ref({ label: siriusStore.state.selectedNetworkName, value: siriusStore.state.selectedNetwork });
    const selectedNetwork = ref();
    selectedNetwork.value= { label: siriusStore.state.availableNetworks[siriusStore.state.selectedNetwork], value: siriusStore.state.selectedNetwork };
    // set default for network selection if state.selectedNetwork is null
    if(siriusStore.state.selectedNetwork === ''){
      selectedNetwork.value= { label: siriusStore.state.availableNetworks[0], value: 0 };
    }

    const selectNetwork= (e) =>{
      if(e.value.value !== 'customize'){
        chainNetwork.updateChainNetwork(parseInt(e.value.value));
      }
    }

    // watch(selectedNetwork, (n) => {
    //   console.log(n)
    // });

    const logout = () => {
      let status = appStore.logoutOfWallet();
      if(status){
        router.push({ name: "Home"});
      }
    };

    const totalBalance = computed(()=>{
      return appStore.getTotalBalance();
    });

    transferEmitter.on("CONFIRMED_NOTIFICATION", payload => {
      if(payload.status){
        toast.add({severity:'success', summary: 'Notification', detail: payload.message, group: 'br', life: 5000});
        var audio = new Audio(require('@/assets/audio/ding2.ogg'));
        audio.play();
      }
    });

    transferEmitter.on("UNCONFIRMED_NOTIFICATION", payload => {
      if(payload.status){
        toast.add({severity:'info', summary: 'Notification', detail: payload.message, group: 'br', life: 5000});
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
      }
    });

    transferEmitter.on("STATUS_NOTIFICATION", payload => {
      if(payload.status){
        toast.add({severity:'error', summary: 'Error status', detail: payload.message, group: 'br', life: 5000});
        var audio = new Audio(require('@/assets/audio/ding.ogg'));
        audio.play();
      }
    });

    emitter.on("NOTIFICATION", payload => {
      if(payload.status){
        toast.add({severity:'warn', summary: 'Alert', detail: payload.message, group: 'br', life: 5000});
      }
    });

    return {
      appStore,
      siriusStore,
      loginStatus,
      logout,
      totalBalance,
      notificationMessage,
      notificationType,
      chainsNetworks,
      selectedNetwork,
      selectNetwork,
      chainsNetworkOption,
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
@import "../assets/scss/multiselect.scss";

.gray-line-left{
  border-left: 1px solid #E4E7EB;
}

.p-hidden-accessible {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.p-hidden-accessible input,
.p-hidden-accessible select {
  transform: scale(0);
}

.p-inputtext {
  margin: 0;
}

.p-inputtext {
  width: 100%;
}


.p-inputtext {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
  color: #495057;
  background: #ffffff;
  padding: 3px 5px;
  border: 1px solid #ced4da;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  border-radius: 3px;
}
.p-inputtext:enabled:hover {
  border-color: #2196F3;
}
.p-inputtext:enabled:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
  border-color: #2196F3;
}
.p-inputtext.p-invalid.p-component {
  border-color: #f44336;
}
.p-inputtext.p-inputtext-sm {
  font-size: 0.875rem;
  padding: 0.4375rem 0.4375rem;
}
.p-inputtext.p-inputtext-lg {
  font-size: 1.25rem;
  padding: 0.625rem 0.625rem;
}


.p-component {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
  font-weight: normal;
}

.p-dropdown {
  background: #ffffff;
  border-bottom: 1px solid #ced4da;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  border-radius: 3px;
  width: 150px;
}
// .p-dropdown:not(.p-disabled):hover {
//   border-color: #2196F3;
// }
// .p-dropdown:not(.p-disabled).p-focus {
//   outline: 0 none;
//   outline-offset: 0;
//   box-shadow: 0 0 0 0.2rem #a6d5fa;
//   border-color: #2196F3;
// }
.p-dropdown.p-dropdown-clearable .p-dropdown-label {
  padding-right: 1.5rem;
}
.p-dropdown .p-dropdown-label {
  background: transparent;
  border: 0 none;
}
.p-dropdown .p-dropdown-label.p-placeholder {
  color: #6c757d;
}
.p-dropdown .p-dropdown-label:enabled:focus {
  outline: 0 none;
  box-shadow: none;
}
.p-dropdown .p-dropdown-trigger {
  background: transparent;
  color: #6c757d;
  width: 30px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
// .p-dropdown .p-dropdown-clear-icon {
//   color: #6c757d;
//   right: 0px;
// }
.p-dropdown.p-invalid.p-component {
  border-color: #f44336;
}

.p-dropdown-panel {
  background: #ffffff;
  color: #495057;
  border: 0 none;
  border-radius: 3px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
}
.p-dropdown-panel .p-dropdown-header {
  padding: 0.5rem 1rem;
  border-bottom: 0 none;
  color: #495057;
  background: #f8f9fa;
  margin: 0;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.p-dropdown-panel .p-dropdown-header .p-dropdown-filter {
  padding-right: 1.5rem;
}
.p-dropdown-panel .p-dropdown-header .p-dropdown-filter-icon {
  right: 0.5rem;
  color: #6c757d;
}
.p-dropdown-panel .p-dropdown-items {
  padding: 0.5rem 0;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
  margin: 0;
  padding: 5px 10px;
  border: 0 none;
  color: #495057;
  background: transparent;
  transition: box-shadow 0.2s;
  border-radius: 0;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
  color: #495057;
  background: #e9ecef;
  display: block;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-disabled):hover {
  color: #495057;
  background: #E3F2FD;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item-group {
  margin: 0;
  padding: 0px 10px;
  color: #495057;
  background: #ffffff;
  font-weight: 700;
  font-size: 12px;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-empty-message {
  padding: 0.5rem 1rem;
  color: #495057;
  background: transparent;
}

.p-input-filled .p-dropdown {
  background: #f8f9fa;
}
.p-input-filled .p-dropdown:not(.p-disabled):hover {
  background-color: #f8f9fa;
}
.p-input-filled .p-dropdown:not(.p-disabled).p-focus {
  background-color: #ffffff;
}

</style>