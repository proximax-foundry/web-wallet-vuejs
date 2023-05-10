import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale:'en',
    messages,
    globalInjection:true
});

export default i18n