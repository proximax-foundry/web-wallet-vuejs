import "./assets/scss/main.scss";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'animate.css';
import { VuePassword } from 'vue-password';
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import "primeicons/primeicons.css";
// import "primevue/resources/primevue.min.css";
// import "primevue/resources/themes/saga-blue/theme.css";
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { walletState } from './state/walletState';
import { WalletStateUtils } from './state/utils/walletStateUtils';
import { NetworkStateUtils } from './state/utils/networkStateUtils';
import { ChainUtils } from './util/chainUtils';
import { ChainAPICall } from './models/REST/chainAPICall';
import { ChainProfile, ChainProfileConfig, ChainProfileNames } from "./models/stores/"

// Import Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore, faFileExport, faFileImport, faArrowRight, faAt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

library.add(faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore, faFileExport, faFileImport, faArrowRight, faAt );
const app = createApp(App);
const emitter = mitt();

app.config.globalProperties.emitter = emitter;
app.use(router)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.mount('#app');
// Use Components
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component(VuePassword);

const enforceProvidedChainProfileOnly = true; 

const chainProfileIntegration = async () => {
  try {
    const networksInfo = await fetch('./chainProfile.json', {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma' : 'no-cache'
      }
    }).then((res) => res.json()).then((networksInfo) => { return networksInfo });

    const chainProfilesData = networksInfo;
    const chainProfileNames = Object.keys(networksInfo);

    const chainProfileNamesStore = ChainProfileNames.createDefault();

    let namesUpdate = 0;

    if(chainProfileNamesStore.names.length !== 0){
      
      switch (chainProfileNames.length) {
        case 1:
          namesUpdate = chainProfileNamesStore.replaceFirstNames(chainProfileNames);
          break;
        case 2:
          namesUpdate = chainProfileNamesStore.replaceFirst2Names(chainProfileNames);
          break;
        case 3:
          namesUpdate = chainProfileNamesStore.replaceFirst3Names(chainProfileNames);
          break;
        default:
          break;
      }

      if(enforceProvidedChainProfileOnly){
        chainProfileNamesStore.names = chainProfileNames;
        namesUpdate = 1;
      }
    }
    else{
      chainProfileNamesStore.names = chainProfileNames;
      namesUpdate = 1;
    }
    
    chainProfileNamesStore.saveToLocalStorage();

    for(const chainProfileName of chainProfileNames){
      const chainProfileStore = new ChainProfile(chainProfileName);

      chainProfileStore.init();
      const chainProfileData = chainProfilesData[chainProfileName];

      if(chainProfileStore.getVersion() !== chainProfileData['version']){

        chainProfileStore.version = chainProfileData['version'];
        chainProfileStore.apiNodes = chainProfileData['apiNodes'];
        chainProfileStore.chainExplorer = chainProfileData['chainExplorer'];
        chainProfileStore.generationHash = chainProfileData['generationHash'];
        chainProfileStore.httpPort = chainProfileData['httpPort'];
        chainProfileStore.network = chainProfileData['network'];

        chainProfileStore.saveToLocalStorage();

        const endpoint = ChainUtils.buildAPIEndpoint(chainProfileStore.apiNodes[0], chainProfileStore.httpPort);

        const chainAPICall = new ChainAPICall(endpoint);

        try {
          const chainHeight = await chainAPICall.chainAPI.getBlockchainHeight();

          const config = await ChainUtils.getChainConfig(chainHeight, chainAPICall.chainConfigAPI.chainConfigHttp)

          const chainProfileConfigStore = new ChainProfileConfig(chainProfileName);

          chainProfileConfigStore.init()
  
          if(typeof config !== "string"){
            config.chainHeight = chainHeight;
            chainProfileConfigStore.updateConfig(config);
            chainProfileConfigStore.saveToLocalStorage();
          }
          else{
            console.error(config);
          }
          
        } catch (error) {
          console.log(error);
        }
        
       
      }
    }

    if(namesUpdate){
      NetworkStateUtils.refreshAvailableNetwork();
      NetworkStateUtils.checkDefaultNetwork();
    }

  } catch (e) {
    console.error(e);
  }
}

chainProfileIntegration();

// check from session when page refreshed
if (!walletState.currentLoggedInWallet) {
  // check sessionStorage
  if(!WalletStateUtils.checkFromSession()){
    router.push({ name: "Home"});
  }
}

NetworkStateUtils.checkDefaultNetwork();

{"mode":"full","isActive":false}