import "./main.scss";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'animate.css';
import VuePassword from 'vue-password';
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import "primeicons/primeicons.css";
// import "primevue/resources/primevue.min.css";
// import "primevue/resources/themes/saga-blue/theme.css";
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { appStore } from './store/app';
import { chainNetwork, siriusStore } from './store/sirius';
import { ChainProfileStore, chainProfilesNameStore, ChainProfileConfigStore } from './store/main';
import { ChainProfile } from './store/storeClasses'

// Import Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore );
const app = createApp(App);
const emitter = mitt();

app.config.globalProperties.emitter = emitter;
app.use(router).mount('#app');
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

// Use Components
// app.component('ConfirmDialog', ConfirmDialog);
// app.component('Toast', Toast);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component(VuePassword);

const chainProfileIntegration = async () => {
  try {
    let configInfo = await fetch('./chainProfile.json', {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma' : 'no-cache'
      }
    }).then((res) => res.json()).then((configInfo) => { return configInfo });

    // console.log(configInfo);
    var chainProfilesData = configInfo;
    var chainProfileNames = Object.keys(configInfo);

    chainProfilesNameStore.init()
    chainProfilesNameStore.replaceFirst2Names(chainProfileNames);
    chainProfilesNameStore.saveToLocalStorage();

    for(const chainProfileName of chainProfileNames){
      var chainProfileStore = new ChainProfileStore(chainProfileName);

      chainProfileStore.init();
      var chainProfileData = chainProfilesData[chainProfileName];

      if(chainProfileStore.getVersion() !== chainProfileData['version']){
        var newChainProfile = new ChainProfile();

        newChainProfile.version = chainProfileData['version'];
        newChainProfile.apiNodes = chainProfileData['apiNodes'];
        newChainProfile.chainExplorer = chainProfileData['chainExplorer'];
        newChainProfile.generationHash = chainProfileData['generationHash'];
        newChainProfile.httpPort = chainProfileData['httpPort'];
        newChainProfile.network = chainProfileData['network'];

        chainProfileStore.state = newChainProfile;

        chainProfileStore.saveToLocalStorage();

        var endpoint = chainNetwork.buildAPIEndpointURL(newChainProfile.apiNodes[0], newChainProfile.httpPort);

        var chainConfigHttp = chainNetwork.buildChainConfigHttp(endpoint);
        var chainHttp = chainNetwork.buildChainHttp(endpoint);

        var chainHeight = await chainNetwork.getChainHeight(chainHttp)

        var config = await chainNetwork.getChainConfig(chainHeight, chainConfigHttp)
        var chainProfileConfigStore = new ChainProfileConfigStore(chainProfileName+"_config");

        chainProfileConfigStore.init()

        chainProfileConfigStore.state = config;
        chainProfileConfigStore.state.chainHeight = chainHeight;
        chainProfileConfigStore.saveToLocalStorage();
      }
    }
  } catch (e) {
    console.error(e);
  }
}

chainProfileIntegration();

// check from session when page refreshed
if (!appStore.state.currentLoggedInWallet) {
  // check sessionStorage
  if(!appStore.checkFromSession(siriusStore)){
    router.push({ name: "Welcome"});
  }
}

// set default if session storage for network is not available
if(!siriusStore.getSelectedNetworkSessionStorage()){
  siriusStore.updateNetworkSessionStorage('0');
}

