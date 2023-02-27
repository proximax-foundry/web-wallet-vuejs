import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";
import "./assets/scss/main.scss";
import messages from "@intlify/unplugin-vue-i18n/messages";
import { vMaska } from "maska";
import Tooltip from "primevue/tooltip";
import Toast from "primevue/toast";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import mitt from "mitt";
import { vue3Debounce } from "vue-debounce";
import Tree from "primevue/tree";

const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages,
});

app.use(PrimeVue);
app.use(ToastService);
app.component("Toast", Toast);
app.component("Tree", Tree);

app.directive("tooltip", Tooltip);
app.directive("debounce", vue3Debounce({ lock: true }));

app.directive("maska", vMaska);
app.use(router);
app.use(i18n);
app.mount("#app");
