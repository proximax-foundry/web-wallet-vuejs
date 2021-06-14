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
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import VWave from 'v-wave';
import VueTippy, { TippyComponent } from "vue-tippy";

import { appStore } from './store/app';
import { chainNetwork, siriusStore } from './store/sirius';
import { ChainProfile, ChainProfileNames, ChainProfileConfig } from './store/storeClasses'

// Import Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore, faCloudUploadAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown, faTrashRestore, faCloudUploadAlt, faCreditCard );
const app = createApp(App);
const emitter = mitt();

app.config.globalProperties.emitter = emitter;
app.use(router);
app.use(PrimeVue);
app.use(VWave);
app.use(ConfirmationService);
app.use(ToastService);
app.use(VueTippy);

// Use Components
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component(VuePassword);
app.component("tippy", TippyComponent);

app.mount('#app');

const chainProfileIntegration = async () => {
  try {
    let networksInfo = await fetch('./chainProfile.json', {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma' : 'no-cache'
      }
    }).then((res) => res.json()).then((networksInfo) => { return networksInfo });

    var chainProfilesData = networksInfo;
    var chainProfileNames = Object.keys(networksInfo);

    var chainProfileNamesStore = ChainProfileNames.createDefault();

    var namesUpdate = 0;

    switch (chainProfileNames.length) {
      case 2:
        namesUpdate = chainProfileNamesStore.replaceFirst2Names(chainProfileNames);
        break;
      case 3:
        namesUpdate = chainProfileNamesStore.replaceFirst3Names(chainProfileNames);
        break;
      default:
        break;
    }
    chainProfileNamesStore.saveToLocalStorage();

    for(const chainProfileName of chainProfileNames){
      var chainProfileStore = new ChainProfile(chainProfileName);

      chainProfileStore.init();
      var chainProfileData = chainProfilesData[chainProfileName];

      if(chainProfileStore.getVersion() !== chainProfileData['version']){

        chainProfileStore.version = chainProfileData['version'];
        chainProfileStore.apiNodes = chainProfileData['apiNodes'];
        chainProfileStore.chainExplorer = chainProfileData['chainExplorer'];
        chainProfileStore.generationHash = chainProfileData['generationHash'];
        chainProfileStore.httpPort = chainProfileData['httpPort'];
        chainProfileStore.network = chainProfileData['network'];

        chainProfileStore.saveToLocalStorage();

        var endpoint = chainNetwork.buildAPIEndpointURL(chainProfileStore.apiNodes[0], chainProfileStore.httpPort);

        var chainConfigHttp = chainNetwork.buildChainConfigHttp(endpoint);
        var chainHttp = chainNetwork.buildChainHttp(endpoint);

        var chainHeight = await chainNetwork.getChainHeight(chainHttp)

        var config = await chainNetwork.getChainConfig(chainHeight, chainConfigHttp)
        var chainProfileConfigStore = new ChainProfileConfig(chainProfileName+"_config");

        chainProfileConfigStore.init()

        chainProfileConfigStore.chainHeight = chainHeight;
        chainProfileConfigStore.updateConfig(config);
        chainProfileConfigStore.saveToLocalStorage();
      }
    }

    if(namesUpdate){
      chainNetwork.refreshAvailableNetwork();
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
    router.push({ name: "Home"});
  }
}

// set default if session storage for network is not available
if(!siriusStore.getSelectedNetworkSessionStorage()){
  siriusStore.updateNetworkSessionStorage('0');
}

