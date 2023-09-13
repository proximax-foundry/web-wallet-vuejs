import "./assets/scss/main.scss";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { vue3Debounce } from 'vue-debounce'
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import "primeicons/primeicons.css";
import { appSetting } from '@/config/appSetting';
// import "primevue/resources/primevue.min.css";
// import "primevue/resources/themes/saga-blue/theme.css";
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { walletState } from './state/walletState';
import { WalletStateUtils } from './state/utils/walletStateUtils';
import { NetworkStateUtils } from './state/utils/networkStateUtils';
import { ChainUtils } from './util/chainUtils';
import { ChainAPICall } from './models/REST/chainAPICall';
import { AppStateUtils } from './state/utils/appStateUtils';
import { WalletMigration } from './models/walletMigration';
import { ChainProfile, ChainProfileConfig, ChainProfileNames, ChainSwapConfig, ThemeStyleConfig, ChainProfileName } from "./models/stores/"
import { vMaska } from "maska";
import Tooltip from "primevue/tooltip";
// Import Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fas, faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload,
  faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore, faFileExport, faFileImport, faArrowRight, faArrowCircleRight, faAngleRight, faAt, faEquals, faNotEqual, faLink, faUnlink,
  faExternalLinkAlt, faHashtag, faShoppingBag
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import i18n from './i18n';
import VueBlocksTree from 'vue3-blocks-tree';
import 'vue3-blocks-tree/dist/vue3-blocks-tree.css';
import { RequestOptions } from "tsjs-xpx-chain-sdk";
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Import dialog from PrimeVue
import Dropdown from 'primevue/dropdown';
import Sidebar from 'primevue/sidebar'
import Tree from 'primevue/tree'

library.add(
  fas, faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload,
  faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore, faFileExport, faFileImport, faArrowRight, faArrowCircleRight, faAngleRight, faAt, faEquals, faNotEqual, faLink, faUnlink, faExternalLinkAlt, faHashtag, faShoppingBag
);
const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.use(router)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(i18n);
app.use(VueBlocksTree /* , {treeName:'blocks-tree'} */);
// Use Components
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('Dropdown', Dropdown);
app.component('Sidebar', Sidebar);
app.component('Tree',Tree);
app.directive("tooltip", Tooltip);
app.directive("maska", vMaska);
app.directive('debounce', vue3Debounce({ lock: true }))
app.mount('#app');

AppStateUtils.addNewReadyStates('chainProfile');
AppStateUtils.addNewReadyStates('theme');
AppStateUtils.addNewReadyStates('checkSession');
AppStateUtils.addNewReadyStates('walletMigration');
AppStateUtils.addNewReadyStates('loadLoadedData');

const loadThemeConfig = async () => {
  try {
    let config: any;

    if (location.protocol === "file:") {
      config = appSetting.theme;
    }
    else {
      config = await fetch('./themeConfig.json', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      }).then((res) => res.json()).then((configInfo) => { return configInfo });
    }
    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.updateConfig(config);
    themeConfig.saveToLocalStorage();
    AppStateUtils.setStateReady('theme');
  } catch (e) {
    AppStateUtils.setStateReady('theme');
    console.error(e);
  }
}

const chainProfileIntegration = async () => {
  try {
    let networksInfo: ChainProfile[];
    let isLocalAccess = false;

    if (location.protocol === "file:") {
      networksInfo = appSetting.chainProfile;
      isLocalAccess = true;
    }
    else {
      networksInfo = await fetch('./chainProfile.json', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      }).then((res) => res.json()).then((networksInfo) => { return networksInfo });
    }

    const chainProfilesData = networksInfo;
    const chainProfileNames = Object.keys(networksInfo);

    const chainProfileNamesStore = ChainProfileNames.createDefault();

    const chainNameArray: ChainProfileName[] = [];

    for (let i = 0; i < chainProfileNames.length; ++i) {
      chainNameArray.push({
        name: chainProfileNames[i],
        isPreset: true
      });
    }

    try {
      let customChainProfile = chainProfileNamesStore.names.filter(data => {
        if (typeof data === 'string' || data instanceof String) {
          return false;
        }
        else {
          return !data.isPreset;
        }
      });

      chainNameArray.concat(customChainProfile);
    } catch (error) {

    }

    chainProfileNamesStore.names = chainNameArray;

    chainProfileNamesStore.saveToLocalStorage();

    for (const chainProfileName of chainProfileNames) {
      const chainProfileStore = new ChainProfile(chainProfileName);

      chainProfileStore.init();
      const chainProfileData = chainProfilesData[chainProfileName];

      if (chainProfileStore.getVersion() !== chainProfileData['version']) {

        chainProfileStore.version = chainProfileData['version'];
        chainProfileStore.apiNodes = chainProfileData['apiNodes'];
        chainProfileStore.secured = chainProfileData['secured'];
        chainProfileStore.chainExplorer = chainProfileData['chainExplorer'];
        chainProfileStore.generationHash = chainProfileData['generationHash'];
        chainProfileStore.httpPort = chainProfileData['httpPort'];
        chainProfileStore.network = chainProfileData['network'];
        chainProfileStore.nftBackend = chainProfileData['nftBackend'];

        if(isLocalAccess){
          if(chainProfileData['apikey']){
            chainProfileStore.apikey = chainProfileData['apikey'];
          }
          else{
            chainProfileStore.apikey = "";
          }
        }

        chainProfileStore.saveToLocalStorage();

        if(!chainProfileStore.secured || (chainProfileStore.apikey && chainProfileStore.secured)){
          const endpoint = ChainUtils.buildAPIEndpoint(chainProfileStore.apiNodes[0], chainProfileStore.httpPort);

          const chainAPICall = new ChainAPICall(endpoint);

          try {
            let requestOptions: RequestOptions | undefined = undefined; 
            
            if(chainProfileStore.apikey){
              requestOptions = new RequestOptions({apikey: chainProfileStore.apikey});
              chainAPICall.chainAPI.requestOptions = requestOptions;
              chainAPICall.chainConfigAPI.requestOptions = requestOptions;
            }
            
            const chainHeight = await chainAPICall.chainAPI.getBlockchainHeight();
  
            const config = await ChainUtils.getChainConfig(chainHeight, chainAPICall.chainConfigAPI)
  
            const chainProfileConfigStore = new ChainProfileConfig(chainProfileName);
  
            chainProfileConfigStore.init()
  
            if (typeof config !== "string") {
              config.chainHeight = chainHeight;
              chainProfileConfigStore.updateConfig(config);
              chainProfileConfigStore.saveToLocalStorage();
            }
            else {
              console.error(config);
            }
  
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    NetworkStateUtils.refreshAvailableNetwork();
    NetworkStateUtils.checkDefaultNetwork();

  } catch (e) {
    console.error(e);
  }
  AppStateUtils.setStateReady('chainProfile');
}



const chainSwapIntegration = async () => {
  try {
    let swapInfo: ChainSwapConfig[];

    if (location.protocol === "file:") {
      swapInfo = appSetting.chainSwap;
    }
    else {
      swapInfo = await fetch('./chainSwapProfile.json', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      }).then((res) => res.json()).then((swapInfo) => { return swapInfo });
    }

    const chainSwapProfilesData = swapInfo;
    const chainSwapProfileNames = Object.keys(swapInfo);

    for (const chainSwapProfileName of chainSwapProfileNames) {
      const chainSwapProfileData = chainSwapProfilesData[chainSwapProfileName];

      if (chainSwapProfileData['swapData']) {
        let chainSwapConfig = new ChainSwapConfig(chainSwapProfileName);
        chainSwapConfig.updateConfig(chainSwapProfileData['swapData']);

        chainSwapConfig.saveToLocalStorage();
      }
    }
  } catch (e) {
    console.error(e);
  }
};

loadThemeConfig();
chainProfileIntegration();
chainSwapIntegration();

const runWalletMigration = async () => {

  let walletMigration = new WalletMigration();

  walletMigration.runPatching();

  AppStateUtils.setStateReady('walletMigration');
}

runWalletMigration();




// check from session when page refreshed
if (!walletState.currentLoggedInWallet) {
  // reload loaded data
  WalletStateUtils.checkSessionLoadedData();
  AppStateUtils.setStateReady('loadLoadedData');

  // check sessionStorage
 
  WalletStateUtils.checkFromSession().then(bool=>{
    if(!bool){
      NetworkStateUtils.checkSession();
      AppStateUtils.setStateReady('checkSession');
  
      router.push({ name: "Home" });
    }
  }).finally(()=>{
    AppStateUtils.setStateReady('checkSession');
    AppStateUtils.setStateReady('loadLoadedData');
  })

}
// NetworkStateUtils.checkDefaultNetwork();

