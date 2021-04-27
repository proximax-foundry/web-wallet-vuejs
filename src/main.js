import "./main.scss";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'animate.css';
import VuePassword from 'vue-password';
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import { ChainProfileStore, chainProfilesNameStore, ChainProfileConfigStore } from './store/main'
import { ChainProfile } from './store/storeClasses'
import { siriusStore } from './store/sirius'
import axios from 'axios'

// Import Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App);

const emitter = mitt();

// import { appStore } from "./store/app";
// import { siriusStore } from "./store/sirius";

library.add(faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt, faCaretDown, faEdit, faTimesCircle, faCheckCircle, faTrashAlt, faIdCardAlt, faDownload, faCoins, faComment, faBell, faCircle, faChevronUp, faChevronDown);

app.config.globalProperties.emitter = emitter;
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(router);

app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.mount('#app');

// app.provide(appStore);
// app.provide(siriusStore);


// Use Components
app.component('font-awesome-icon', FontAwesomeIcon);
app.component(VuePassword);

const chainProfileIntegration = async () => {
    try {
      let configInfo = await axios.get('./chainProfile.json', {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma' : 'no-cache'
        }
      })

      var chainProfilesData = configInfo.data;
      var chainProfileNames = Object.keys(configInfo.data);

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

          var endpoint = siriusStore.buildAPIEndpointURL(newChainProfile.apiNodes[0], newChainProfile.httpPort);

          var chainConfigHttp = siriusStore.buildChainConfigHttp(endpoint);
          var chainHttp = siriusStore.buildChainHttp(endpoint);

          var chainHeight = await siriusStore.getChainHeight(chainHttp)

          var config = await siriusStore.getChainConfig(chainHeight, chainConfigHttp)
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