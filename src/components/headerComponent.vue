<template>
  <header>
    <div class="header-height flex items-stretch md:pr-2 bg-gray-50" v-if="loginStatus">
      <div class="header-height flex-none self-center flex pt-3 md:pt-4 pl-2 sm:pl-4 bg-navy-primary logo-header">
        <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}"><img src="@/assets/img/logo-whitetxt.svg" class="w-24 tsm:w-40"></router-link>
      </div>
      <div class="flex-none md:flex items-center w-16 hidden md:visible right-gray-line">
        <div class="text-center w-full h-7">
          <router-link :to="{name : 'ViewDashboard'}"><img src="@/assets/img/icon-home.svg" class="h-7 w-7 inline-block"></router-link>
        </div>
      </div>
      <div class="flex-none md:flex items-center md:ml-4 hidden md:visible">
        <img src="@/assets/img/icon-blockheight.svg" class="h-10 w-10 inline-block">
        <div class="ml-3">
          <div class="uppercase text-txs text-gray-400">block height</div>
          <div class="text-gray-800 text-md font-bold mt-1">{{ blockHeight }}</div>
        </div>
      </div>

      <div class="flex-grow"></div>
      <div class="flex-none">
        <div class="flex flex-row h-full">
          <div class="flex flex-row items-center">
            <div class="text-center w-full h-6 pr-10 mt-2 relative">
              <div class="cursor-pointer text-blue-primary text-tsm" @mouseover="setHoverCreateToTrue" @mouseout="setHoverCreateToFalse">+ Create</div>
              <div class="absolute z-20 w-60 text-left mt-2 bg-gray-50 shadow-sm rounded-md right-0 p-2 text-xs transition duration-200 block" v-if="isShowCreate" @mouseover="isShowCreate=true;isHoverCreatePanel=true;" @mouseout="hideCreatePanel">
                <router-link :to="{ name: 'ViewServicesAssetsCreate'}" class="hover:bg-gray-200 p-2 block">
                  <div class="inline-block mr-2">
                    <img src="@/assets/img/icon-header-asset.svg" class="">
                  </div>
                  <div class="inline-block">
                    <div class="font-bold mb-1">Digital Asset</div>
                    <div class="text-txs text-gray-400">Create your own unique token</div>
                  </div>
                </router-link>
                <router-link :to="{ name: 'ViewServicesNamespaceCreate'}" class="hover:bg-gray-200 p-2 block">
                  <div class="inline-block mr-2">
                    <img src="@/assets/img/icon-header-namespace.svg" class="">
                  </div>
                  <div class="inline-block">
                    <div class="font-bold mb-1">Namespace</div>
                    <div class="text-txs text-gray-400">Create an on-chain unique space</div>
                  </div>
                </router-link>
                <router-link :to="{ name: 'ViewAccountCreate'}" class="hover:bg-gray-200 p-2 block">
                  <div class="inline-block mr-2">
                    <img src="@/assets/img/icon-header-account.svg" class="">
                  </div>
                  <div class="inline-block">
                    <div class="font-bold mb-1">Account</div>
                    <div class="text-txs text-gray-400">Secure XPX in new account</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <div class="w-12 md:w-16 flex flex-row items-center left-gray-line relative">
            <div class="text-center w-full h-7 cursor-pointer" @mouseover="setHoverSupportToTrue" @mouseout="setHoverSupportToFalse">
              <img src="@/assets/img/icon-support-contact.svg" class="opacity-80 hover:opacity-100 inline-block h-4 w-4 md:h-5 md:w-5">
            </div>
            <div class="absolute z-20 w-96 text-left bg-gray-50 shadow-sm rounded-md right-0 p-2 text-tsm transition duration-200 block" style="top: 60px" v-if="isShowSupport" @mouseover="isShowSupport=true;isHoverSupportPanel=true;" @mouseout="hideSupportPanel">
              <div class="font-bold p-2 text-txs">BEGINNER'S GUIDE</div>
              <div class="grid grid-cols-2">
                <div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="#" target=_new>Getting Started<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">Everything you need to know about the Sirius Wallet</div>
                  </div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="#" target=_new>What is Sirius Chain?<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">Start building apps on the ProximaX Sirius blockchain layer</div>
                  </div>
                </div>
                <div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="#" target=_new>What is Namespace?<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">Create an on-chain unique place for your business and your assets</div>
                  </div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="#" target=_new>What is Asset?<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">Everything you need to know about the Sirius Wallet</div>
                  </div>
                </div>
              </div>
              <div class="w-full p-2 pt-3 border-t border-gray-100">
                <a href="https://t.me/proximaxhelpdesk" target=_new class="text-xs text-blue-primary">Contact our support team</a>
              </div>
            </div>
          </div>
          <div class="w-12 md:w-16 flex flex-row items-center left-gray-line">
            <div class="text-center w-full h-7">
              <img src="@/assets/img/icon-bell.svg" class="opacity-80 hover:opacity-100 inline-block h-7 w-3 md:h-5 md:w-5">
            </div>
          </div>
          <div class="w-12 md:w-16 flex flex-row items-center left-gray-line">
            <div class="text-center w-full h-4 md:h-6">
              <router-link :to="{name : 'ViewServices'}" class="h-7 w-4 md:h-6 md:w-6 inline-block">
                <img src="@/assets/img/icon-setting.svg" class="opacity-80 hover:opacity-100 transition-all duration-300">
              </router-link>
            </div>
          </div>
          <div class="w-16 md:w-40 pl-3 text-center flex items-center left-gray-line">
            <div class="md:flex md:items-center">
              <img src="@/assets/img/icon-testnet-block.svg" class="w-3 md:w-7 block md:inline-block" :title="chainAPIEndpoint" v-if="wideScreen"> <div class="block md:inline-block text-txs text-white text-left md:ml-2"><div class="text-xxs md:text-tsm text-navy-primary">{{ networkState.chainNetworkName }}</div></div>
            </div>
          </div>
          <div class="w-12 md:w-16 flex flex-row items-center left-gray-line md:hidden">
            <div class="text-center w-full h-6" @mouseover="hoverOverNavigation" @mouseout="hoverOutNavigation">
              <img src="@/assets/img/icon-menu.svg" class="h-4 w-4 opacity-80 hover:opacity-100 inline-block cursor-pointer" @click="toggleSidebar">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto header-height flex items-stretch" v-else>
      <div class="flex-none self-center flex items-end ml-2 sm:ml-0">
        <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}"><img src="@/assets/img/logo-proximax-sirius-wallet.svg" class="w-24 tsm:w-40"></router-link>
      </div>
      <div class="flex-grow"></div>
      <div class="flex-none self-center header-menu">
        <div class="w-20 inline-block ml-2 sm:ml-0" v-if="wideScreen">
          <router-link :to="{ name: 'Home'}" class="font-normal hover:font-bold inline-block">{{$t('Header.home')}}</router-link>
        </div>
        <div class="w-20 inline-block" v-if="wideScreen">
          <router-link :to="{ name: 'ViewWallets'}" class="hover:font-bold">{{$t('Header.wallet')}}</router-link>
        </div>
        <div class="text-center inline-block">
          <selectLanguageModal />
        </div>
      </div>
    </div>
    <div v-if="!wideScreen && !loginStatus" class="bg-gray-200 py-1 text-center">
      <div class="w-16 text-center inline-block">
        <router-link :to="{ name: 'Home'}" class="font-normal hover:font-bold inline-block text-xs sm:text-sm">{{$t('Header.home')}}</router-link>
      </div>
      <div class="w-16 text-center inline-block">
        <router-link :to="{ name: 'ViewWallets'}" class="hover:font-bold text-xs sm:text-sm">{{$t('Header.wallet')}}</router-link>
      </div>
    </div>
  </header>
</template>

<script> 
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { useRouter } from "vue-router";
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { ChainUtils } from '@/util/chainUtils';
import { Helper } from '@/util/typeHelper';
// import Dropdown from 'primevue/dropdown';
// import SelectLanguagePlugin from '@/components/SelectLanguagePlugin.vue';
import selectLanguageModal from '@/modules/home/components/selectLanguageModal.vue'
import { WalletStateUtils } from "@/state/utils/walletStateUtils";
import { useToast } from "primevue/usetoast";
import { Connector } from '../models/connector';
import { listenerState} from "@/state/listenerState";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { TransactionType } from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import {useI18n} from 'vue-i18n'

export default defineComponent({
  components: {
    // Dropdown,
    selectLanguageModal,
  },

  name: 'headerComponent',
  data() {
    return {
      login: false,
      wideScreen: false,
    };
  },
  setup() {
    const {t} = useI18n();
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const router = useRouter();

    const blockHeight = computed(() => networkState.currentNetworkProfileConfig.chainHeight);

    const isHoverCreate = ref(false);
    const isShowCreate = ref(false);
    const isHoverCreatePanel = ref(false);
    const setHoverCreateToTrue = () => {
      isHoverCreate.value = true;
      isShowCreate.value = true;
    }
    const setHoverCreateToFalse = () => {
      isHoverCreate.value = false;
      setTimeout(() => {
        if(!isHoverCreatePanel.value && !isHoverCreate.value){
          isShowCreate.value = false;
        }
      }, 100);
    }
    const hideCreatePanel = () => {
      isHoverCreatePanel.value = false;
      setTimeout(() => {
        if(!isHoverCreate.value && !isHoverCreatePanel.value){
          isShowCreate.value = false;
        }
      }, 100);
    }

    const isHoverSupport = ref(false);
    const isShowSupport = ref(false);
    const isHoverSupportPanel = ref(false);
    const setHoverSupportToTrue = () => {
      isHoverSupport.value = true;
      isShowSupport.value = true;
    }
    const setHoverSupportToFalse = () => {
      isHoverSupport.value = false;
      setTimeout(() => {
        if(!isHoverSupportPanel.value && !isHoverSupport.value){
          isShowSupport.value = false;
        }
      }, 100);
    }
    const hideSupportPanel = () => {
      isHoverSupportPanel.value = false;
      setTimeout(() => {
        if(!isHoverSupport.value && !isHoverSupportPanel.value){
          isShowSupport.value = false;
        }
      }, 100);
    }

    const navigationSideBar = inject('navigationSideBar');

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

      console.log("Network List Updated");

      for(let i=0; i < availableNetworks.length; ++i){
        options.push({ label: availableNetworks[i], value: i });
      }
      chainsNetworks.value = options;
    }, true);

    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    const chainsNetworkOption = computed(()=>{

      return [{
        label: t('Header.network'),
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

    // setInterval(()=>{
    //   toast.add(
    //     {
    //       severity:'info', 
    //       summary: `Waiting queue`, 
    //       detail: `Please do not`, 
    //       detail2: "refresh or logout",
    //       group: 'brt'
    //     }
    //   );
    // }, 60000);

    const currentNetworkType = computed(()=> networkState.currentNetworkProfile ? networkState.currentNetworkProfile.network.type : null);

    const logout = () => {
      WalletStateUtils.doLogout();
      router.push({ name: "Home"});
      console.log('logout')
    };

    //const totalBalance = ref(0);
    const totalBalance = computed(()=>{

      if(!walletState.currentLoggedInWallet){
        return 0;
      }

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

      if(walletState.currentLoggedInWallet === null || walletState.currentLoggedInWallet === undefined){
        return;
      }

      let accountsAddress = walletState.currentLoggedInWallet.accounts.map((acc)=> acc.address);
      let othersAddress = walletState.currentLoggedInWallet.others.map((acc)=> acc.address);

      let allAddress = Array.from(new Set(accountsAddress.concat(othersAddress)));

      //listener.addresses = allAddress;
      //console.log(allAddress);

      listener.value = new Connector(ChainUtils.buildWSEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort), allAddress);

      listener.value.startListen();
    }

    const terminateListener = () =>{
      listener.value.endpoint = "";
      listener.value.terminate();
    }

    const doLogin = async () =>{
      if(loginStatus.value){
        await WalletUtils.refreshAllAccountDetails(walletState.currentLoggedInWallet, networkState.currentNetworkProfile);
        connectListener();
      }
    }

    const toggleSidebar = () => {
      navigationSideBar.isOpen = !navigationSideBar.isOpen;
    }

    const hoverOverNavigation = () => {
      navigationSideBar.inNavi = true;
    }

    const hoverOutNavigation = () => {
      navigationSideBar.inNavi = false;
    }

    doLogin();

    watch(()=> loginStatus.value, async (newValue)=>{
      if(newValue){
        doLogin();
        emitter.emit('LOGIN');
      }
      else{
        terminateListener();
        emitter.emit('LOGOUT');
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
        emitter.emit("TXN_UNCONFIRMED", txLength);
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

        emitter.emit("TXN_CONFIRMED", txLength);

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
          toast.add({
              severity:'success', 
              summary: `Swap Transaction${singularPluralText} Confirmed`, 
              detail: `${swapTransactionsCount} swap transaction${singularPluralText} confirmed`, 
              group: 'br', 
              life: 5000
          });
        }

        let remainingTxLength = txLength - swapTransactionsCount;
        if(remainingTxLength){
          singularPluralText =  remainingTxLength > 1 ? "s" : "";
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

      if(newValue > oldValue){
        let txLength = newValue - oldValue;
        let totalTxLength = listenerState.allTransactionStatus.length;
        let lastIndex = totalTxLength - 1;

        for(let i= 0; i < txLength; ++i){
          let status = listenerState.allTransactionStatus[lastIndex - i].status;
          let hash = listenerState.allTransactionStatus[lastIndex - i].hash;
          emitter.emit("TXN_ERROR", hash);
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
        emitter.emit("COSIGNER_SIGNED", txLength);
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
        emitter.emit("ABT_ADDED", txLength);
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
    return {
      toggleSidebar,
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
      listener,
      hoverOverNavigation,
      hoverOutNavigation,
      isHoverCreate,
      isShowCreate,
      setHoverCreateToTrue,
      setHoverCreateToFalse,
      hideCreatePanel,
      isHoverCreatePanel,
      isHoverSupport,
      isShowSupport,
      setHoverSupportToTrue,
      setHoverSupportToFalse,
      hideSupportPanel,
      isHoverSupportPanel,
      blockHeight,
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

.left-gray-line{
  border-left: 1px solid #dedede;
}

.right-gray-line{
  border-right: 1px solid #dedede;
}

.gray-bar{
  background: #3F4058;
}

.lang-mobile-placement{
  top: -30px; position: relative;
}

.lang-mobile-placement-postlogin{
  position: relative; top: 0px !important; left: -35px;
}

.logo-header{
  width: 115px;
}

.header-height{
  @apply h-12;
}

.header-menu{
  margin-left: 5px;
}

.header-menu a{
  font-size: 15px;
  margin-left: 10px;
}

.version-text{
  @apply text-gray-400;
  font-size: 10px;
  position: relative;
  top: 4px;
  left: 5px;
}

@screen md {
  .logo-header{
    width: 240px;
  }

 .version-text{
    font-size: 13px;
    top: 5px;
    left: 5px;
  }

  .lang-mobile-placement-postlogin{
    left: 0px;
  }
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
  font-size: 12px;
  color: #495057;
  background: #ffffff;
  padding: 3px 5px;
  padding-right: 0px;
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
  width: 110px;
  margin-top: 10px;
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
  width: 20px;
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

@screen md {
  .header-height{
    @apply h-16;
  }

  .header-menu{
    margin-left: 20px;
  }

 .p-inputtext {
    font-size: 16px;
    padding-right: 5px;
  }

  .p-dropdown {
    width: 150px;
    margin-top: 0px;
  }

  .p-dropdown .p-dropdown-trigger {
    width: 30px;
  }
}

</style>