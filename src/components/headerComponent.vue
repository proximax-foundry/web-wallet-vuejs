<template>
  <div class="flex-none self-center flex items-end logo">
    <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}"><img src="../assets/img/logo-proximax-sirius-wallet-beta.svg" class="w-32"></router-link><span class="version-text">v{{ versioning }}</span>
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
          <img src="../assets/img/icon-nodes-green-30h.svg" class="w-7 inline-block" :title="chainAPIEndpoint"> <div class="font-bold inline-block ml-1 text-xs" v-if="wideScreen">{{ networkState.chainNetworkName }}</div>
        </div>
      </div>
      <div class="w-52 pl-3 inline-block text-left gray-line-left h-10 items-center" v-if="wideScreen">
        <div>
          <div class="text-xs inline-block">{{ walletState.currentLoggedInWallet.name }}</div>
          <div class="text-xs">Total Balance: <span>{{ totalBalance }}</span> {{ currentNativeTokenName}}</div>
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
      <Dropdown v-model="selectedNetwork" name="selectedNetwork" :modelValue="networkState.chainNetwork" :options="chainsNetworkOption" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" @change="selectNetwork"></Dropdown>
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
import { computed, defineComponent, getCurrentInstance, ref, watch } from "vue";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { useRouter } from "vue-router";
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { ChainUtils } from '@/util/chainUtils';
import { Helper } from '@/util/typeHelper';
// import { transferEmitter } from '../util/listener.js';
import Dropdown from 'primevue/dropdown';
import SelectLanguagePlugin from '@/components/SelectLanguagePlugin.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { useToast } from "primevue/usetoast";
import { Connector } from '../models/connector';
import { listenerState} from "@/state/listenerState";
import packageData from "../../package.json"
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";

export default defineComponent({
  components: {
    Dropdown,
    SelectLanguagePlugin,
    FontAwesomeIcon,
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
    const router = useRouter();
    const notificationMessage = ref('');
    const notificationType = ref('noti');

    const chainAPIEndpoint = computed(()=> ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort))
    const loginStatus = computed(() => walletState.isLogin);
    const chainsNetworks = computed(()=> {

      let options = [];
      networkState.availableNetworks.forEach((network, index) => {
        options.push({ label: network, value: index });
      });
      return options;
    });

    watch(()=> networkState.availableNetworks, (availableNetworks)=>{
      let options = [];

      console.log("Updated");
      console.log(availableNetworks);

      for(let i=0; i < availableNetworks.length; ++i){
        options.push({ label: availableNetworks[i], value: i });
      }
      chainsNetworks.value = options;
    }, true);

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    const chainsNetworkOption = computed(()=>{

      return [{
        label: 'Networks',
        items: chainsNetworks.value
      }];
    });
      // , {
      //   label: 'Setting',
      //   items: [
      //     {label: 'Customize', value: 'customize'}
      //   ]
      // }

    const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});

    const selectNetwork= (e) =>{
      // if(e.value.value !== 'customize'){
        NetworkStateUtils.changeNetworkByIndex(parseInt(e.value.value));
      //}
      // console.log(e.value.value);
    }

    const currentNetworkType = computed(()=> networkState.currentNetworkProfile ? networkState.currentNetworkProfile.network.type : null);

    const logout = () => {
      WalletStateUtils.doLogout();

      router.push({ name: "Home"});
      console.log('logout')
    };

    //const totalBalance = ref(0);
    const totalBalance = computed(()=>{

      let accountsBalance = walletState.currentLoggedInWallet.accounts.map((account)=> account.balance);
      let othersBalance = walletState.currentLoggedInWallet.others.map((otherAccount)=> otherAccount.balance);

      let accountsTotalAmount = accountsBalance.reduce((prevAmount, newAmount)=> prevAmount + newAmount);
      let totalAmount = othersBalance.reduce((prevAmount, newAmount)=> prevAmount + newAmount, accountsTotalAmount);

      totalAmount = Helper.toCurrencyFormat(totalAmount, currentNativeTokenDivisibility.value);

      return totalAmount;
    });

    let listener = ref(new Connector("", []));

    const connectListener = (skipIfEndpointHaveValue = true)=>{

      if(skipIfEndpointHaveValue && listener.value.endpoint !== ""){
        return;
      }
      //listener.connectNewEndpoint(ChainUtils.buildWSEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
      if(listener.value.endpoint){
        ListenerStateUtils.lightReset();
      }
      else{
        ListenerStateUtils.reset();
      }
      listener.value.terminate();

      let accountsAddress = walletState.currentLoggedInWallet.accounts.map((acc)=> acc.address);
      let othersAddress = walletState.currentLoggedInWallet.others.map((acc)=> acc.address);

      let allAddress = Array.from(new Set(accountsAddress.concat(othersAddress)));

      //listener.addresses = allAddress;
      //console.log(allAddress);

      listener.value = new Connector(ChainUtils.buildWSEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort), allAddress);

      listener.value.startListen();
    }

    const terminateListener = () =>{
      listener.value.terminate();
    }

    if(loginStatus.value){
      connectListener();
    }

    watch(()=> loginStatus.value, (newValue)=>{
      if(newValue){
        connectListener();
      }
      else{
        terminateListener();
      }
    })

    //const newBlockLength = computed(()=> listenerState.blockLength);
    const currentBlockHeight = computed(()=> listenerState.currentBlock);
    const confirmedTxLength = computed(()=> listenerState.confirmedTxLength);
    const unconfirmedTxLength = computed(()=> listenerState.unconfirmedTxLength);
    const transactionStatusLength = computed(()=> listenerState.transactionStatusLength);
    const aggregateBondedTxLength = computed(()=> listenerState.aggregateBondedTxLength);
    const cosignatureAddedTxLength = computed(()=> listenerState.cosignatureAddedTxLength);
    const totalPendingNum = ref(0);

    watch(()=> listenerState.autoAnnounceSignedTransaction, (newValue)=>{
      
      let newLength = newValue.length;

      if(newLength !== totalPendingNum.value){
        toast.removeGroup("tr");

        if(newLength){
          let singularPluralText =  newLength > 1 ? "s" : "";
          toast.add(
              {
                severity:'info', 
                summary: `${newLength} Transaction${singularPluralText} in waiting queue`, 
                detail: `Please do not refresh or logout`, 
                group: 'tr'
              }
          );
        }
      }

      totalPendingNum.value = newLength;
      
    }, true);

    watch(()=> currentBlockHeight.value, ()=>{

      listener.value.refreshTimer();
    });
    

     watch(()=> unconfirmedTxLength.value, (newValue, oldValue)=>{

      if(newValue > oldValue){
        let txLength = newValue - oldValue;
        let singularPluralText =  txLength > 1 ? "s" : "";
        toast.add(
          {
            severity:'warn', 
            summary: `Transaction${singularPluralText} Added`, 
            detail: `${txLength} transaction${singularPluralText} in unconfirmed state`, 
            group: 'br', 
            life: 5000
          }
        );
      }
     });

     watch(()=> confirmedTxLength.value, (newValue, oldValue)=>{

      if(newValue > oldValue){
        WalletUtils.confirmedTransactionRefresh(walletState.currentLoggedInWallet, networkState.currentNetworkProfile.network.currency.assetId);

        let txLength = newValue - oldValue;

        let transactionHashes = listenerState.allConfirmedTransactionsHash.slice(-txLength);

        let swapTransactionsCount = 0;
        let swapTransactionHash = [];


        for(let i =0; i < listenerState.confirmedTransactions.length; ++i){
          let txs = listenerState.confirmedTransactions[i].confirmedTransactions.filter((tx)=> transactionHashes.includes(tx.transactionInfo.hash));

          for(let x=0; x < txs.length; ++x){
            let tx = txs[x];
            if(tx.type === TransactionType.TRANSFER && tx.message.payload && Helper.checkIsJSON(tx.message.payload)){
              let parsedMessage = JSON.parse(tx.message.payload);

              if(parsedMessage.type && parsedMessage.type.substr(0, 4) === "Swap"){
                swapTransactionHash.push(tx.transactionInfo.hash);
              }
            }
          }
        }

        swapTransactionsCount = new Set(swapTransactionHash).size;

        let singularPluralText = swapTransactionsCount > 1 ? "s" : "";

        if(swapTransactionsCount){
          toast.add(
          {
            severity:'success', 
            summary: `Swap Transaction${singularPluralText} Confirmed`, 
            detail: `${swapTransactionsCount} swap transaction${singularPluralText} confirmed`, 
            group: 'br', 
            life: 5000
          }
          );
        }

        let remainingTxLength = txLength - swapTransactionsCount;
        if(remainingTxLength){
          singularPluralText =  newTxLength > 1 ? "s" : "";
          toast.add(
            {
              severity:'success', 
              summary: `Transaction${singularPluralText} Confirmed`, 
              detail: `${txLength} transaction${singularPluralText} confirmed`, 
              group: 'br', 
              life: 5000
          }
        );
        } 
      }
     });

     watch(()=> transactionStatusLength.value, (newValue, oldValue)=>{

       console.log(newValue + ":" + oldValue);

      if(newValue > oldValue){
        let txLength = newValue - oldValue;
        let totalTxLength = listenerState.allTransactionStatus.length;
        let lastIndex = totalTxLength - 1;

        for(let i= 0; i < txLength; ++i){
          let status = listenerState.allTransactionStatus[lastIndex - i].status;
          let hash = listenerState.allTransactionStatus[lastIndex - i].hash;
          toast.add({
            severity:'error', 
            summary: `Transaction Error`, 
            detail: `Status: ${status} - Hash: ${hash} `, 
            group: 'br', 
            life: 10000
          });
        }
      }
     });

     watch(()=> cosignatureAddedTxLength.value, (newValue, oldValue)=>{

      if(newValue > oldValue){
        let txLength = newValue - oldValue;
        let singularPluralText =  txLength > 1 ? "s" : "";
        toast.add(
          {
            severity:'info', 
            summary: `Transaction${singularPluralText} Cosignature Added`, 
            detail: `${txLength} cosignature transaction${singularPluralText} added`, 
            group: 'br', 
            life: 5000
          }
        );
      }
     });

     watch(()=> aggregateBondedTxLength.value, (newValue, oldValue)=>{

      if(newValue > oldValue){
        let txLength = newValue - oldValue;
        let singularPluralText =  txLength > 1 ? "s" : "";
        toast.add(
          {
            severity:'warn', 
            summary: `Partial Transaction${singularPluralText} Added`, 
            detail: `${txLength} partial transaction${singularPluralText} added`, 
            group: 'br', 
            life: 5000
          }
        );
      }
     });

     emitter.on("listener:reconnect", ()=>{
       connectListener(false);
     });

     emitter.on("listener:setEndpoint", endpoint =>{
       listener.value.endpoint = endpoint;
     });

    const versioning = ref('0.0.1');

    versioning.value = packageData.version;

    return {
      versioning,
      networkState,
      walletState,
      loginStatus,
      logout,
      totalBalance,
      notificationMessage,
      notificationType,
      chainsNetworks,
      selectedNetwork,
      selectNetwork,
      chainAPIEndpoint,
      chainsNetworkOption,
      currentNativeTokenName,
      listener
    };
  },
  created() {
    this.headerMenuHandler();
    window.addEventListener("resize", this.headerMenuHandler);
  },
  beforeUnmount(){
    this.listener.terminate();
  },
  unmounted() {
    window.removeEventListener("resize", this.headerMenuHandler);
  },
  methods: {
    headerMenuHandler: function (){
      if(window.innerWidth < 768){
        this.wideScreen = false;
      }else{
        this.wideScreen = true;
      }
    },
  }
});
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
  // font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
  // font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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