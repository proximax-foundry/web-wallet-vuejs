import "./main.scss";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'animate.css';
import VuePassword from 'vue-password'
import mitt from 'mitt'
import PrimeVue from 'primevue/config';
import "primeicons/primeicons.css";
// import Button from "primevue/button";

// Import Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTimes, faEye, faEyeSlash, faLock, faWallet, faKey, faCheck, faExclamation, faBars, faCopy, faSignOutAlt )
const app = createApp(App)
const emitter = mitt()
app.use(router).mount('#app')

// Use Components
app.component('font-awesome-icon', FontAwesomeIcon)
app.component(VuePassword)
app.config.globalProperties.emitter = emitter
app.use(PrimeVue);
// app.component("Button", Button);