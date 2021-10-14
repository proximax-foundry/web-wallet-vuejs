<template>
  <div>
    <a @click="toggleModal = !toggleModal" class="w-16 text-center inline-block"><img src="@/assets/img/globe.svg" class="h-4 w-4 inline-block relative mr-2" style="top: -1px">{{ $i18n.locale.toUpperCase() }}</a>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-show="toggleModal" class="popup-outer absolute flex z-40">
        <div class="modal-popup-box m-2">
          <div class="delete-position mt-2 mr-1 cursor-pointer" @click="toggleModal = false">
            <img src="@/assets/img/delete.svg" class="w-5 inline-block">
          </div>
          <div class="w-104">
            <h1 class="default-title my-3 sm:my-5">Select language</h1>
          </div>
          <div class="lang-option">
            <div v-for="(lang, item) in options" :key="item" class="flex justify-between border-gray-300 border-b py-3">
              <div class="text-gray-800 text-xs">{{ lang.label }}</div><span v-if="lang.value == selected" class="text-gray-400 text-txs items-center flex">CURRENT</span><a href="#" class="items-center flex text-blue-300" @click="changeLang(lang.value)" v-else>SELECT</a>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-white z-10"></div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from "vue-router";
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { WalletUtils } from '@/util/walletUtils';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';
import {useI18n} from "vue-i18n"
export default defineComponent({
  name: 'selectLanguageModal',

  setup(){
    const toggleModal = ref(false);
    const {t, locale } = useI18n();
    const router = useRouter();
    const selected = ref(locale.value);

    // const i18n = VueI18n({
    //   legacy: false,
    //   locale: selected.value, // set locale
    //   fallbackLocale: 'EN'
    // });

    const options = [
      { value: 'en', label: 'English', selected: 'EN', icon: 'gb' },
      { value: 'zh', label: '中文'   , selected: 'CH',icon: 'cn' },
      { value: 'ru', label: 'русский', selected: 'RU',icon: 'ru' },
      { value: 'es', label: 'Español', selected: 'ES',icon:'es'}
    ];

    const changeLang = (lng) => {
      locale.value = lng;
      selected.value = lng;
      toggleModal.value = !toggleModal.value;

    }

    return{
      networkState,
      options,
      selected,
      changeLang,
      toggleModal,
    };
  },

  components: {
  }
});
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/multiselect.scss";
#langSelector ::v-deep {
  top: 7px;
  position: absolute;
  .multiselect-input{
    border-bottom: 0px !important;
  }
  .multiselect{
    width: 90px;
  }
  .multiselect-options{
    overflow-y: hidden !important;
  }
  .multiselect-single-label{
    font-size: 13px;
  }
  .multiselect-option{
    padding: 5px !important;
    min-height: 30px !important;
    font-size: 13px;
  }
}

#app .lang-option a{
  @apply text-txs;
}

</style>