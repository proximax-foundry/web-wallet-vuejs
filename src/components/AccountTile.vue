<template>
  <div class='p-3'>
    <div class="rounded-2xl flex justify-between py-3 border border-gray-200" :class="account.default?'bg-white':'bg-gray-100'">
      <div class="ml-5 text-left text-sm w-full">
        <div class="font-bold mb-1">{{ account.name }} <span v-if="account.default" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-yellow-200">Default</span> <span v-if="isMultiSig" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200">Multisig</span></div>
        <div class="flex justify-between pr-4 rounded-xl mb-4 items-center" :class="account.default?'bg-white':'bg-gray-100'">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <input
              :id="account.address"
              class="text-sm w-full outline-none z-10"
              :class="account.default?'bg-white':'bg-gray-100'"
              type="text"
              :value="appStore.pretty(account.address)"
            />
          </div>
          <font-awesome-icon icon="copy" @click="copy(account.address)" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between">
          <div class="inline-block mr-4"><img src="../assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"><span class="text-xs">{{ account.balance }} XPX</span></div>
          <div class="inline-block mr-4" v-if="mosaicNum>0" :title="`Other mosaic${(mosaicNum>1)?'s':''}: ${mosaicNum}`"><img src="../assets/img/icon-mosaics-green-16h.svg" class="w-5 inline mr-1"><span class="text-xs">{{ mosaicNum }}</span></div>

          <div class="relative inline-block text-left" @mouseover="hoverOverMenu" @mouseout="hoverOutMenu">
            <div>
              <button type="button" @click="showHideMenu();" class="justify-center px-4 py-2 text-gray-700 focus:outline-none" id="options-menu" aria-expanded="true" aria-haspopup="true">
                <font-awesome-icon icon="caret-down" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
              </button>
            </div>
            <div :class="showMenuCall?'':'hidden'" class="absolute right-0 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div class="py-1" role="none">
                <router-link :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">Details</router-link>
                <a v-if="!account.default" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" @click="setAsDefaultAccount(account.address)">Make Default</a>
                <div v-else class="block px-2 py-1 text-xs text-gray-300">Make Default</div>
                <a class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" @click="exportWallet()">Export</a>
                <router-link :to="{ name: 'ViewDeleteAccount', params: { name: account.name}}" v-if="!account.default" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">Delete</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300">Delete</div>
                <router-link :to="{ name: isMultiSig ? 'ViewEditAccountMultisig' : 'ViewConvertAccountMultisig', params: { name: account.name}}" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">MultiSig</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, getCurrentInstance } from "vue";
import CryptoJS from 'crypto-js';
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import { copyKeyFunc } from '../util/functions.js';
import { useToast } from "primevue/usetoast";

export default{
  components: { FontAwesomeIcon },
  name: 'AccountTile',
  props: ['account', 'showMenuCall', 'i'],
  setup(p){
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const copy = (id) => copyKeyFunc(id, toast);
    const mosaicNum = computed(() => {
      return (p.account.mosaic!=undefined)?p.account.mosaic.length:0;
    });

    const isMultiSig = computed(() => {
      let isMulti = false;
      if(p.account.isMultisign != undefined){
        if(p.account.isMultisign != '' || p.account.isMultisign != null){
          if(p.account.isMultisign.cosignatories != undefined){
            if(p.account.isMultisign.cosignatories.length > 0){
              isMulti = true;
            }
          }
        }
      }
      return isMulti;
    });

    const setAsDefaultAccount = (add) => {
      if(appStore.setAccountDefault(add)){
        emitter.emit("CLOSE_MENU_TRIGGER", p.i);
      }
    };

    const exportWallet = () => {
      const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
      let wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(wallet));
      let file = CryptoJS.enc.Base64.stringify(wordArray);
      const now = Date.now()
      const date = new Date(now);
      const year = date.getFullYear();
      const month = ((date.getMonth() + 1) < 10) ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
      const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();

      const blob = new Blob([file], { type: '' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      let networkTypeName = siriusStore.getNetworkByType(appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network).name;
      networkTypeName = (networkTypeName.includes(' ')) ? networkTypeName.split(' ').join('') : networkTypeName;
      a.download = `${wallet.name}_${networkTypeName}_${year}-${month}-${day}.wlt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const showHideMenu = () => {
      // show.value = !show.value;
      emitter.emit("CLOSE_ALL_MENU_TRIGGER");
      if(p.showMenuCall){
        emitter.emit("CLOSE_MENU_TRIGGER", p.i);
      }else{
        emitter.emit("SHOW_MENU_TRIGGER", p.i);
      }
    };

    const hoverOverMenu = () => {
      emitter.emit("HOVER_OVER_MENU_TRIGGER", p.i);
    };

    const hoverOutMenu = () => {
      emitter.emit("HOVER_OUT_MENU_TRIGGER");
    };

    return {
      copy,
      appStore,
      showHideMenu,
      hoverOverMenu,
      hoverOutMenu,
      setAsDefaultAccount,
      exportWallet,
      mosaicNum,
      isMultiSig,
    }
  },
}
</script>