<template>
  <header class="z-10 fixed w-full">
    <div class="header-height flex items-stretch lg:pr-2 bg-gray-50 filter drop-shadow-xl" v-if="loginStatus">
      <div class="w-12 lg:w-16 flex flex-row items-center left-gray-line lg:hidden ">
        <div class="text-center w-full h-6" @mouseover="hoverOverNavigation" @mouseout="hoverOutNavigation">
          <img src="@/assets/img/icon-menu.svg" class="h-4 w-4 opacity-80 hover:opacity-100 inline-block cursor-pointer" @click="toggleSidebar">
        </div>
      </div>
      <div class=" flex justify-center items-center lg:bg-navy-primary logo-header">
        <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}">
          <img src="@/assets/img/logo-whitetxt.svg" class="w-24 tsm:w-40 hidden lg:inline-block">
        </router-link>
      </div>
      <div class=" flex items-center ml-auto mr-28 lg:mr-auto lg:ml-10 logo-header">
        <div class="hidden lg:block" >Wallet {{walletName}}</div>
        <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}">
          <img  src="@/assets/img/logo-blacktxt.svg" class="w-40 lg:hidden">
        </router-link>
      </div>
      
        <div class="flex flex-row ml-auto h-full">
          <div class="hidden lg:flex w-16 flex-row items-center left-gray-line relative">
            <div class="text-center w-full h-7 cursor-pointer" @mouseover="setHoverSupportToTrue" @mouseout="setHoverSupportToFalse">
              <img src="@/assets/img/icon-support-contact.svg" class="opacity-80 hover:opacity-100 inline-block h-4 w-4 lg:h-5 lg:w-5">
            </div>
            <div class="absolute z-20 w-96 text-left bg-gray-50 shadow-sm rounded-md right-0 p-2 text-tsm transition duration-200 block" style="top: 60px" v-if="isShowSupport" @mouseover="isShowSupport=true;isHoverSupportPanel=true;" @mouseout="hideSupportPanel">
              <div class="font-bold p-2 text-txs uppercase">{{$t('home.beginnerGuide')}}</div>
              <div class="grid grid-cols-2">
                <div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="https://bcdocs.xpxsirius.io/" target=_new>{{$t('home.gettingStarted')}}<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">{{$t('home.allInfo')}}</div>
                  </div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="https://bcdocs.xpxsirius.io/docs/getting-started/what-is-proximax-sirius-chain/" target=_new>{{$t('home.siriusChain')}}<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">{{$t('home.siriusChainTitle')}}</div>
                  </div>
                </div>
                <div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="https://bcdocs.xpxsirius.io/docs/built-in-features/namespace/" target=_new>{{$t('general.namespaceQues')}}<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">{{$t('home.namespaceAns')}}</div>
                  </div>
                  <div class="p-2">
                    <a class="mb-2 block text-blue-primary" href="https://bcdocs.xpxsirius.io/docs/built-in-features/mosaic/" target=_new>{{$t('general.assetQues')}}<img src="@/assets/img/icon-open_in_new.svg" class="inline-block absolute -top-1 ml-2"></a>
                    <div class="text-txs h-10">{{$t('home.assetAns')}}</div>
                  </div>
                </div>
              </div>
              <div class="w-full p-2 pt-3 border-t border-gray-100">
                <a href="https://t.me/proximaxhelpdesk" target=_new class="text-xs text-blue-primary">{{$t('home.contactTeam')}}</a>
              </div>
            </div>
          </div>
          <div class="w-12 lg:w-16 flex flex-row items-center left-gray-line">
            <router-link :to="{name : 'ViewNotification'}" class="text-center w-full h-7 relative">
              <span class="flex h-5 w-5 items-center justify-center absolute notification_counter" v-if="isNewNotification">
                <span class="animate-ping absolute inline-flex rounded-full bg-orange-primary opacity-75 h-4 w-4"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-primary"></span>
              </span>
              <span class="flex items-center justify-center absolute notification_counter" v-else>
                <span v-if="newNotificationCount>0" class="relative inline-flex rounded-full z-20 h-4 w-4 bg-orange-primary text-xxs text-white items-center justify-center">{{ newNotificationCount }}</span>
              </span>
              <div class="mt-2 h-3 w-3 lg:mt-1 lg:h-5 lg:w-5 inline-block">
                <img src="@/assets/img/icon-bell.svg" class="opacity-80 hover:opacity-100">
              </div>
            </router-link>
          </div>
          <div class="hidden lg:flex w-16 lg:flex-row items-center left-gray-line">
            <div class="text-center w-full h-4 lg:h-6">
              <router-link :to="{name : 'ViewSettings'}" class="h-7 w-4 lg:h-6 lg:w-6 inline-block">
                <img src="@/assets/img/icon-setting.svg" class="opacity-80 hover:opacity-100 transition-all duration-300">
              </router-link>
            </div>
          </div>
          <div class="hidden w-40 pl-3 text-center lg:flex items-center left-gray-line">
            <div class="lg:flex lg:items-center">
              <img src="@/assets/img/icon-testnet-block.svg" class="w-3 lg:w-7 block lg:inline-block" :title="chainAPIEndpoint" v-if="wideScreen"> <div class="block lg:inline-block text-txs text-white text-left lg:ml-2"><div class="text-xxs lg:text-tsm text-navy-primary">{{ networkState.chainNetworkName }}</div></div>
            </div>
          </div>
          
        </div>
      </div>
   
    <div class="container mx-auto header-height flex items-stretch bg-navy-primary" v-else>
      <div class="flex-none self-center flex items-end ml-2 lg:ml-0">
        <router-link :to="loginStatus? {name : 'ViewDashboard'}: {name: 'Home'}"><img src="@/assets/img/logo-whitetxt.svg" class="w-24 lg:w-40"></router-link>
      </div>
      <div class="flex-grow"></div>
      <div class="flex-none self-center header-menu">
        <div class="w-20 inline-block ml-2 sm:ml-0" v-if="wideScreen">
          <router-link :to="{ name: 'Home'}" class="font-normal hover:font-bold inline-block text-white">{{$t('home.home')}}</router-link>
        </div>
        <div class="w-20 inline-block" v-if="wideScreen">
          <router-link :to="{ name: 'ViewWallets'}" class="hover:font-bold text-white">{{$t('general.wallet',2)}}</router-link>
        </div>
        <div class="text-center inline-block text-white">
          <selectLanguageModal :loginStatus="loginStatus"/>
        </div>
      </div>
    </div>
    <div v-if="!wideScreen && !loginStatus" class="py-1 text-center" style="background: #484A69">
      <div class="w-20 text-center inline-block text-gray-300">
        <router-link :to="{ name: 'Home'}" class="font-normal hover:font-bold inline-block text-xs sm:text-sm">{{$t('home.home')}}</router-link>
      </div>
      <div class="w-20 text-center inline-block text-gray-300">
        <router-link :to="{ name: 'ViewWallets'}" class="hover:font-bold text-xs sm:text-sm">{{$t('general.wallet',2)}}</router-link>
      </div>
    </div>
  </header>
  <SetAccountDefaultModal @dashboardSelectAccount="updateSelectedAccount" :toggleModal="openSetDefaultModal" />
</template>

<script> 
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from "vue";
import { walletState } from "@/state/walletState";
import { networkState } from "@/state/networkState";
import { AppState } from "@/state/appState";
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
import { listenerState, AnnounceType} from "@/state/listenerState";
import { ListenerStateUtils } from "@/state/utils/listenerStateUtils";
import { TransactionType } from "tsjs-xpx-chain-sdk";
import { WalletUtils } from "@/util/walletUtils";
import {useI18n} from 'vue-i18n'
import SetAccountDefaultModal from '@/modules/dashboard/components/SetAccountDefaultModal.vue';
import { NotificationUtils } from '@/util/notificationUtils';
import { UnitConverter } from '@/util/unitConverter';
import { TimeUnit } from '@/models/const/timeUnit';

export default defineComponent({
  components: {
    // Dropdown,
    selectLanguageModal,
    SetAccountDefaultModal,
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

    const isNewNotification = ref(false);
    const newNotificationCount = ref(0);
    const notificationLoading = ref(false);
    let notificationTimeout = 0;
    let doRecheckAssetsNamesInterval = 0;
    let doConfirmedTxnCheckingInterval = 0;
    let doTxnCheckingInterval = 0;
    const isHoverCreate = ref(false);
    const isShowCreate = ref(false);
    const isHoverCreatePanel = ref(false);

    const transactionGroupType = Helper.getTransactionGroupType(); 

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

    const openSetDefaultModal = ref(false);

    const updateSelectedAccount = (data)=>{
      // if(data.type == 0){
      //   selectedAccount.value = walletState.currentLoggedInWallet.accounts.find((account)=> account.name === data.name);
      // }else{
      //   selectedAccount.value = walletState.currentLoggedInWallet.others.find((account)=> account.name === data.name);
      // }
      walletState.currentLoggedInWallet.setDefaultAccountByName(data.name);
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
      toast.add({severity:'success', summary: t('home.switchDefault') , detail: data.name, group: 'br-custom', life: 3000});
    }

    emitter.on('TRIGGER_SWITCH_DEFAULT_ACCOUNT_MODAL', (payload) => {
      openSetDefaultModal.value = payload;
    });

    emitter.on('CLOSE_SET_DEFAULT_ACCOUNT_MODAL', payload => {
      if(payload){
        openSetDefaultModal.value = false;
      }
    });

    const navigationSideBar = inject('navigationSideBar');

    const notificationMessage = ref('');
    const notificationType = ref('noti');

    const chainAPIEndpoint = computed(()=> AppState.nodeFullURL)
    const loginStatus = computed(() => walletState.isLogin);
    const chainsNetworks = computed(()=> {

      let options = [];
      networkState.availableNetworks.forEach((network, index) => {
        options.push({ label: network, value: index });
      });
      return options;
    });

    /*
    watch(()=> networkState.availableNetworks, (availableNetworks)=>{
      let options = [];

      console.log("Network List Updated");

      for(let i=0; i < availableNetworks.length; ++i){
        options.push({ label: availableNetworks[i], value: i });
      }
      chainsNetworks.value = options;
    }, true);
    */
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);

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
    const doLogout = ()=>{
      try{
        if(doRecheckAssetsNamesInterval){
          clearInterval(doRecheckAssetsNamesInterval);
        }

        if(doConfirmedTxnCheckingInterval){
          clearInterval(doConfirmedTxnCheckingInterval);
        }

        if(doTxnCheckingInterval){
          clearInterval(doTxnCheckingInterval);
        }
      }catch(error){

      }
    }

    const currentNetworkType = computed(()=> networkState.currentNetworkProfile ? AppState.networkType : null);
    const walletName = computed(()=>walletState.currentLoggedInWallet?walletState.currentLoggedInWallet.name:'')
    const logout = () => {
      doLogout();
      WalletStateUtils.doLogout();
      AppState.doLogout();
      ListenerStateUtils.reset();
      router.push({ name: "Home"});
      console.log('logout');
    };

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

    // let listener = ref(new Connector("", []));

    // const connectListener = (skipIfEndpointHaveValue = true)=>{

    //   if(skipIfEndpointHaveValue && listener.value.endpoint !== ""){
    //     return;
    //   }
    //   //listener.connectNewEndpoint(ChainUtils.buildWSEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
    //   if(listener.value.endpoint){
    //     ListenerStateUtils.lightReset();
    //   }
    //   else{
    //     ListenerStateUtils.reset();
    //   }
    //   listener.value.terminate();

    //   if(walletState.currentLoggedInWallet === null || walletState.currentLoggedInWallet === undefined){
    //     return;
    //   }

    //   let accountsAddress = walletState.currentLoggedInWallet.accounts.map((acc)=> acc.address);
    //   let othersAddress = walletState.currentLoggedInWallet.others.map((acc)=> acc.address);

    //   let allAddress = Array.from(new Set(accountsAddress.concat(othersAddress)));

    //   //listener.addresses = allAddress;
    //   //console.log(allAddress);
    //   listener.value = new Connector(AppState.wsNodeFullURL, allAddress);

    //   listener.value.startListen();
    // }

    // const terminateListener = () =>{
    //   listener.value.endpoint = "";
    //   listener.value.terminate();
    // }

    const doLogin = async () =>{
      if(loginStatus.value && AppState.isReady){
        await WalletUtils.refreshAllAccountDetails(walletState.currentLoggedInWallet, networkState.currentNetworkProfile);
        doGetNotification();
        //connectListener();
      }
      else if(loginStatus.value && !AppState.isReady){
        setTimeout(doLogin, 100);
      }
    }

    const doGetNotification = async()=>{
      if(loginStatus.value && AppState.isReady && notificationLoading.value === false){
        if(notificationTimeout !== null){
          try {
            clearTimeout(notificationTimeout);  
          } catch (error) {
            
          }
        }
        notificationLoading.value = true;
        let notification = await NotificationUtils.getNotification();
        newNotificationCount.value = notification.length;
        isNewNotification.value = NotificationUtils.highlightNewNotification(); 

        notificationLoading.value = false;
        notificationTimeout = setTimeout(doGetNotification, 90000); // 1.5 minutes- 90 seconds
      }
      else if(loginStatus.value && !AppState.isReady){
        setTimeout(doGetNotification, 100);
      }
    }

    const targetBlockSeconds = computed(()=>{
      return UnitConverter.configReturn(networkState.currentNetworkProfileConfig.blockGenerationTargetTime, TimeUnit.SECOND);
    })

    const doConfirmedTxnChecking = async ()=>{

      if(loginStatus.value && AppState.isReady){

        doConfirmedTxnCheckingInterval = setInterval(WalletUtils.checkConfirmedTxnChecking, 60000); // 1 minute
      }
      else if(loginStatus.value && !AppState.isReady){
        setTimeout(doConfirmedTxnChecking, 100);
      }
    }

    const doRecheckAssetsNames = async ()=>{

      if(loginStatus.value && AppState.isReady){

        doRecheckAssetsNamesInterval = setInterval(WalletUtils.recheckAssetsNames, 60000 * 5); // 5 minute
      }
      else if(loginStatus.value && !AppState.isReady){
        setTimeout(doRecheckAssetsNames, 100);
      }
    }

    const checkTxnStatus = async ()=>{

      let endStatuses = ["failed", transactionGroupType.CONFIRMED];
        let txnsHash1 = AppState.txnActivityLog.filter(x => x.checkedNum < 10 && !endStatuses.includes(x.status)).map(x => x.txnHash);
        let txnsHash2 = AppState.txnCosignLog.filter(x => x.checkedNum < 10 && !endStatuses.includes(x.status)).map(x => x.txnHash);
        let txnsHash3 = AppState.txnSwapLog.filter(x => x.checkedNum < 10 && !endStatuses.includes(x.status)).map(x => x.txnHash);
        let allTransasctionHash = txnsHash1.concat(txnsHash2, txnsHash3);

        if(allTransasctionHash.length === 0){
          return;
        }

        let dataPerRequest = 50;

        let numOfRequest = Math.ceil(allTransasctionHash.length / dataPerRequest);

        let requests = [];

        for(let i =0; i < numOfRequest; ++i){
          let startIndex = i * dataPerRequest;
          let endIndex = (i + 1) * dataPerRequest;

          let requestData = allTransasctionHash.slice(startIndex, endIndex);

          try {
            requests.push(AppState.chainAPI.transactionAPI.getTransactionsStatuses(requestData));
          } catch (error) {
            continue;
          }
        }

        let tempTransactionStatuses = await Promise.all(requests);

        let transactionStatuses= tempTransactionStatuses.flat();
         
        let txnsHashFound = [];
        let txnHashesConfirmed = [];

        for(let i=0; i < transactionStatuses.length; ++i){
          txnsHashFound.push(transactionStatuses[i].hash);

          if(txnsHash1.includes(transactionStatuses[i].hash)){
            let txnActivity = AppState.txnActivityLog.find(x => x.txnHash === transactionStatuses[i].hash);

            if(txnActivity.status !== transactionStatuses[i].group){
              txnActivity.status = transactionStatuses[i].group;
             
              if(txnActivity.status === "failed"){
                txnActivity.statusMsg = transactionStatuses[i].status;
              }
              else if(txnActivity.status === transactionGroupType.CONFIRMED){
                txnHashesConfirmed.push(txnActivity.txnHash);
                listenerState.allConfirmedTransactionsHash.push(txnActivity.txnHash);
              }

              addTxnToastMessage(txnActivity.status, transactionStatuses[i].hash, txnActivity.statusMsg);
            }
          }
          else if(txnsHash2.includes(transactionStatuses[i].hash)){
            let txnCosign = AppState.txnCosignLog.find(x => x.txnHash === transactionStatuses[i].hash);

            if(txnCosign.status !== transactionStatuses[i].group){
              txnCosign.status = transactionStatuses[i].group;
             
              if(txnCosign.status === "failed"){
                txnCosign.statusMsg = transactionStatuses[i].status;
              }
              else if(txnActivity.status === transactionGroupType.CONFIRMED){
                txnHashesConfirmed.push(txnActivity.txnHash);
                listenerState.allConfirmedTransactionsHash.push(txnActivity.txnHash);
              }

              addTxnToastMessage(txnCosign.status, transactionStatuses[i].hash, txnCosign.statusMsg);
            }
          }
          else{
            let txnSwap = AppState.txnSwapLog.find(x => x.txnHash === transactionStatuses[i].hash);

            if(txnSwap.status !== transactionStatuses[i].group){
              txnSwap.status = transactionStatuses[i].group;
             
              if(txnSwap.status === "failed"){
                txnSwap.statusMsg = transactionStatuses[i].status;
              }
              else if(txnActivity.status === transactionGroupType.CONFIRMED){
                txnHashesConfirmed.push(txnActivity.txnHash);
                listenerState.allConfirmedTransactionsHash.push(txnActivity.txnHash);
              }

              addTxnToastMessage(txnSwap.status, transactionStatuses[i].hash, txnSwap.statusMsg, "swap");
            }
          }
        }

        if(txnHashesConfirmed.length){
          ListenerStateUtils.fireRecountConfirmed();
        }
        WalletUtils.transactionConfirmed(txnHashesConfirmed);

        let txnsHashNotFound = allTransasctionHash.filter(x => !txnsHashFound.includes(x));

        for(let i =0; i < txnsHashNotFound.length; ++i){
          if(txnsHash1.includes(txnsHashNotFound[i])){
            let txnActivity = AppState.txnActivityLog.find(x => x.txnHash === txnsHashNotFound[i]);
            txnActivity.checkedNum = txnActivity.checkedNum + 1;
          }
          else if(txnsHash2.includes(txnsHashNotFound[i])){
            let txnCosign = AppState.txnCosignLog.find(x => x.txnHash === txnsHashNotFound[i]);
            txnCosign.checkedNum = txnCosign.checkedNum + 1; 
          }
          else{
            let txnSwap = AppState.txnSwapLog.find(x => x.txnHash === txnsHashNotFound[i]);
            txnSwap.checkedNum = txnSwap.checkedNum + 1;
          }
        }
    }

    const doTxnChecking = async ()=>{
      if(loginStatus.value && AppState.isReady){

        doTxnCheckingInterval = setInterval(checkTxnStatus, targetBlockSeconds.value * 1000);
      }
      else if(loginStatus.value && !AppState.isReady){
        setTimeout(doTxnChecking, 100);
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
    doTxnChecking();
    doConfirmedTxnChecking();
    doRecheckAssetsNames();

    watch(()=> loginStatus.value, async (newValue)=>{
      if(newValue){
        doLogin();
        doTxnChecking();
        doConfirmedTxnChecking();
        doRecheckAssetsNames();
        emitter.emit('LOGIN');
      }
      else{
        // terminateListener();
        emitter.emit('LOGOUT');
      }
    })

    //const newBlockLength = computed(()=> listenerState.blockLength);
    const currentBlockHeight = computed(()=> AppState.readBlockHeight);
    // const confirmedTxLength = computed(()=> listenerState.confirmedTxLength);
    // const unconfirmedTxLength = computed(()=> listenerState.unconfirmedTxLength);
    // const transactionStatusLength = computed(()=> listenerState.transactionStatusLength);
    // const aggregateBondedTxLength = computed(()=> listenerState.aggregateBondedTxLength);
    // const cosignatureAddedTxLength = computed(()=> listenerState.cosignatureAddedTxLength);
    const totalPendingNum = ref(0);
    

    const doAutoAnnounce = async () => {
      if(!AppState.isReady){
        setTimeout(doAutoAnnounce, 1000);
      }

      let currentBlockHeight = await AppState.chainAPI.chainAPI.getBlockchainHeight();

      for (let i = 0; i < listenerState.autoAnnounceSignedTransaction.length; ++i) {

          let letAnnouce = false;
          
          let currentAutoAnnounceTx = listenerState.autoAnnounceSignedTransaction[i];

          if(currentAutoAnnounceTx.announced){
              continue;
          }

          if(currentAutoAnnounceTx.announceAtBlock && currentBlockHeight >= currentAutoAnnounceTx.announceAtBlock){
              letAnnouce = true;
          }
          else if(currentAutoAnnounceTx.hashAnnounceBlock && currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock){
              if(currentBlockHeight > currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock + currentAutoAnnounceTx.hashAnnounceBlock.annouceAfterBlockNum){
                  letAnnouce = true;
              }
          }
          else if(currentAutoAnnounceTx.hashAnnounceBlock){
            try {
              let txnStatusInfo = await AppState.chainAPI.transactionAPI.getTransactionStatus(currentAutoAnnounceTx.hashAnnounceBlock.trackHash);
            
              if(txnStatusInfo.group === transactionGroupType.CONFIRMED){
                currentAutoAnnounceTx.hashAnnounceBlock.hashFound = true;
                currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock = txnStatusInfo.height.compact();

                if(currentBlockHeight > currentAutoAnnounceTx.hashAnnounceBlock.hashFoundAtBlock + currentAutoAnnounceTx.hashAnnounceBlock.annouceAfterBlockNum){
                  letAnnouce = true;
                }
              }
            } catch (error) {
              currentAutoAnnounceTx.checkCount += 1;
            }
          }

          if(letAnnouce){
              if (currentAutoAnnounceTx.type === AnnounceType.NORMAL) {
                  await AppState.chainAPI.transactionAPI.announce(currentAutoAnnounceTx.signedTransaction);
              }
              else {
                  await AppState.chainAPI.transactionAPI.announceAggregateBonded(currentAutoAnnounceTx.signedTransaction);
              }

              currentAutoAnnounceTx.announced = true;
          }
      }

      let remainingTransactionsToAnnounce = listenerState.autoAnnounceSignedTransaction.filter(
          (autoTx) => !autoTx.announced
      );

      listenerState.autoAnnounceSignedTransaction = remainingTransactionsToAnnounce;

      if(listenerState.autoAnnounceSignedTransaction.length){
        setTimeout(doAutoAnnounce, 15000);
      }
      else{
        AppState.isPendingTxnAnnounce = false;
      }
    }

    watch(()=> AppState.isPendingTxnAnnounce, async (newValue)=>{
      if(newValue){
        setTimeout(doAutoAnnounce, 5000);
      }
      else{
        toast.removeGroup("tr-wait");
      }
    }, {immediate: true});

    watch(()=> listenerState.autoAnnounceSignedTransaction, (newValue)=>{
      let newLength = newValue.length;

      if(newLength !== totalPendingNum.value){
        toast.removeGroup("tr-wait");

        if(newLength){
          let singularPluralText =  newLength > 1 ? "s" : "";
          toast.add(
              {
                severity:'info', 
                summary: newLength +" "+ t('transaction.inQueue',newLength),
                detail: t('transaction.dontRefresh'), 
                group: 'tr-wait'
              }
          );
        }
      }

      totalPendingNum.value = newLength;
    }, {immediate: true});

    const createTxnHashExplorerLink = (txnHash)=>{
      return `${networkState.currentNetworkProfile.chainExplorer.url}/${networkState.currentNetworkProfile.chainExplorer.hashRoute}/${txnHash}`;
    }

    const addTxnToastMessage = (status, txnHash, statusMessage, extraData = "") =>{
      let txnHashExplorerLink = createTxnHashExplorerLink(txnHash);

      if(status === "failed"){
        toast.add({
          severity:'error', 
          summary: t('transaction.txError'), 
          detail1: "Transaction Failed with error",
          detail2: "Transaction Hash: ", 
          detail3: txnHash,
          detail4: statusMessage,
          group: 'br-custom',
          life: 10000
       });
      }
      else if(status === transactionGroupType.UNCONFIRMED){
        toast.add(
          {
            severity:'warn', 
            summary: t('transaction.txAdded', 1), 
            detail:  t('transaction.txUnconfirmed', 1),
            detail2: "Transaction Hash: ",
            detail3: txnHash,
            url: txnHashExplorerLink,
            group: 'br-custom', 
            life: 5000
          }
        );
      }
      else if(status === transactionGroupType.PARTIAL){
        toast.add({
              severity:'warn', 
              summary: t('transaction.partialAdded',1),
              // detail:  t('transaction.partialAdded',1),
              detail1: "Transaction Hash: ", 
              detail3: txnHash,
              url: txnHashExplorerLink,
              group: 'br-custom', 
              life: 5000
        });
      }
      else if(status === transactionGroupType.CONFIRMED){
        if(extraData === "swap"){
          toast.add({
            severity:'success', 
            summary: t('transaction.swapTx',1),
            // detail:  t('transaction.swapTx',1),
            detail1: "Transaction Hash: ", 
            detail3: txnHash,
            url: txnHashExplorerLink,
            group: 'br-custom', 
            life: 8000
          });
        }
        else{
          toast.add(
            {
              severity:'success', 
              summary:  t('transaction.txConfirmed',1),
              // detail: t('transaction.txConfirmed',1),
              detail1: "Transaction Hash: ", 
              detail3: txnHash, 
              url: txnHashExplorerLink,
              group: 'br-custom', 
              life: 8000
          });
        }
      }
    }

    let txnActivityLogLength = computed(()=> AppState.txnActivityLogNum);
    let txnCosignLogLength = computed(()=> AppState.txnCosignLogNum);

    watch(()=> txnActivityLogLength.value, (newValue, oldValue)=>{

      if(newValue > oldValue){

        let data = AppState.txnActivityLog[newValue - 1];

        toast.add(
          {
            severity:'info', 
            summary: "Transaction announced",
            detail1: "Transaction Hash:", 
            detail3: data.txnHash,
            group: 'br-custom', 
            life: 5000
          }
        );
      }
     });

     watch(()=> txnCosignLogLength.value, (newValue, oldValue)=>{

      if(newValue > oldValue){

        let data = AppState.txnCosignLog[newValue - 1];

        toast.add(
          {
            severity:'info', 
            summary: "Transaction Cosigned",
            detail1: "Transaction Hash:", 
            detail3: data.txnHash,
            url: createTxnHashExplorerLink(data.txnHash),
            group: 'br-custom', 
            life: 5000
          }
        );
      }
     });

    // watch(()=> currentBlockHeight.value, async()=>{

    //   listener.value.refreshTimer();
    // });

    //  watch(()=> unconfirmedTxLength.value, (newValue, oldValue)=>{

    //   if(newValue > oldValue){
    //     let txLength = newValue - oldValue;
    //     emitter.emit("TXN_UNCONFIRMED", txLength);
    //     let singularPluralText =  txLength > 1 ? "s" : "";
    //     toast.add(
    //       {
    //         severity:'warn', 
    //         summary: t('transaction.txAdded',txLength), 
    //         detail:  txLength+" "+t('transaction.txUnconfirmed',txLength),
    //         group: 'br-custom', 
    //         life: 5000
    //       }
    //     );
    //   }
    //  });

    //  watch(()=> confirmedTxLength.value, (newValue, oldValue)=>{
      // if(newValue > oldValue){
        //WalletUtils.confirmedTransactionRefresh(walletState.currentLoggedInWallet, AppState.nativeToken.assetId);

        // let txLength = newValue - oldValue;

        // emitter.emit("TXN_CONFIRMED", txLength);

        // let transactionHashes = listenerState.allConfirmedTransactionsHash.slice(-txLength);

        // let swapTransactionsCount = 0;
        // let swapTransactionHash = [];

        // for(let i =0; i < listenerState.confirmedTransactions.length; ++i){
        //   let txs = listenerState.confirmedTransactions[i].confirmedTransactions.filter((tx)=> transactionHashes.includes(tx.transactionInfo.hash));

        //   for(let x=0; x < txs.length; ++x){
        //     let tx = txs[x];
        //     if(tx.type === TransactionType.TRANSFER && tx.message.payload && Helper.checkIsJSON(tx.message.payload)){
        //       let parsedMessage = JSON.parse(tx.message.payload);

        //       if(parsedMessage.type && parsedMessage.type.substr(0, 4) === "Swap"){
        //         swapTransactionHash.push(tx.transactionInfo.hash);
        //       }
        //     }
        //   }
        // }

        // swapTransactionsCount = new Set(swapTransactionHash).size;

        // let singularPluralText = swapTransactionsCount > 1 ? "s" : "";

        // if(swapTransactionsCount){
        //   toast.add({
        //       severity:'success', 
        //       summary: t('transaction.swapTx',swapTransactionsCount),
        //       detail:  swapTransactionsCount+" "+t('transaction.swapTx',swapTransactionsCount),
        //       group: 'br-custom', 
        //       life: 5000
        //   });
        // }

        // let remainingTxLength = txLength - swapTransactionsCount;
        // if(remainingTxLength){
        //   singularPluralText =  remainingTxLength > 1 ? "s" : "";
        //   toast.add(
        //     {
        //       severity:'success', 
        //       summary:  t('transaction.txConfirmed',remainingTxLength),
        //       detail: txLength + " "+ t('transaction.txConfirmed',remainingTxLength), 
        //       group: 'br-custom', 
        //       life: 5000
        //   }
        // );
        // } 
      // }
    //  });

    //  watch(()=> transactionStatusLength.value, (newValue, oldValue)=>{

    //   if(newValue > oldValue){
    //     let txLength = newValue - oldValue;
    //     let totalTxLength = listenerState.allTransactionStatus.length;
    //     let lastIndex = totalTxLength - 1;

    //     for(let i= 0; i < txLength; ++i){
    //       let status = listenerState.allTransactionStatus[lastIndex - i].status;
    //       let hash = listenerState.allTransactionStatus[lastIndex - i].hash;
    //       emitter.emit("TXN_ERROR", hash);
    //       if(AppState.trackingTxnHash.includes(hash)){
    //         toast.add({
    //           severity:'error', 
    //           summary: t('transaction.txError'), 
    //           detail3: status + " " + hash,
    //           group: 'br-custom', 
    //           life: 10000
    //         });
    //       }
    //     }
    //   }
    //  });

    //  watch(()=> cosignatureAddedTxLength.value, (newValue, oldValue)=>{

    //   if(newValue > oldValue){
    //     let txLength = newValue - oldValue;
    //     emitter.emit("COSIGNER_SIGNED", txLength);
    //     let singularPluralText =  txLength > 1 ? "s" : "";
    //     toast.add(
    //       {
    //         severity:'info', 
    //         summary: t('transaction.cosignAdded'), 
    //         detail: txLength + " " + t('transaction.cosignTxAdded',txLength),
    //         group: 'br-custom', 
    //         life: 5000
    //       }
    //     );
    //   }
    //  });

    //  watch(()=> aggregateBondedTxLength.value, async(newValue, oldValue)=>{

    //   if(newValue > oldValue){
    //     let txLength = newValue - oldValue;
    //     emitter.emit("ABT_ADDED", txLength);
    //     let singularPluralText =  txLength > 1 ? "s" : "";
    //     toast.add(
    //       {
    //         severity:'warn', 
    //         summary: t('transaction.partialAdded',txLength), 
    //         detail: txLength + " " + t('transaction.partialAdded',txLength), 
    //         group: 'br-custom', 
    //         life: 5000
    //       }
    //     );
    //     let notification = await NotificationUtils.getNotification();
    //     newNotificationCount.value = notification.length;
    //     isNewNotification.value = NotificationUtils.highlightNewNotification();
    //   }
    //  });

    //  emitter.on("listener:reconnect", ()=>{
    //    connectListener(false);
    //  });

    //  emitter.on("listener:setEndpoint", endpoint =>{
    //    listener.value.endpoint = endpoint;
    //  });

     emitter.on("VIEW_NOTIFICATION", async() => {
       doGetNotification();
     });

    return {
      openSetDefaultModal,
      updateSelectedAccount,
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
      // listener,
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
      currentBlockHeight,
      isNewNotification,
      newNotificationCount,
      walletName
    };
  },
  created() {
    this.headerMenuHandler();
    window.addEventListener("resize", this.headerMenuHandler);
  },
  beforeUnmount(){
    // this.listener.terminate();
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

@screen lg {
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

.notification_counter{
  right: 8px; top: -2px;
}

@screen lg {
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

  .notification_counter{
    right: 15px; top: -2px;
  }
}

</style>