<template>
  <div class='p-3'>
    <div class="rounded-2xl flex justify-between py-3 border border-gray-200" :class="account.default?'bg-white':'bg-gray-100'">
      <div class="ml-5 text-left text-sm w-full">
        <div class="font-bold mb-1">{{ account.name }} <span v-if="account.type =='DELEGATE'" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200">{{$t('common.delegate')}}</span> <span v-if="account.default" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-yellow-200">{{$t('common.default')}}</span> <span v-if="isMultiSig || account.type =='MULTISIG'" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200">{{$t('common.multisig')}}</span></div>
        <div class="flex justify-between pr-4 rounded-xl mb-4 items-center" :class="account.default?'bg-white':'bg-gray-100'">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div
              :id="account.address"
              class="text-sm w-full outline-none z-10"
              :class="account.default?'bg-white':'bg-gray-100'"
              :copyValue="prettyAddress(account.address)" copySubject="Address"
            >{{prettyAddress(account.address)}}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy(account.address)" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between">
          <div class="inline-block mr-4"><img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 inline mr-1"><span class="text-xs">{{ account.balance }} XPX</span></div>
          <div class="inline-block mr-4" v-if="mosaicNum>0" :title="`Other mosaic${(mosaicNum>1)?'s':''}: ${mosaicNum}`"><img src="@/modules/account/img/icon-mosaics-green-16h.svg" class="w-5 inline mr-1"><span class="text-xs">{{ mosaicNum }}</span></div>
          <div class="relative inline-block text-left" @mouseover="hoverOverMenu" @mouseout="hoverOutMenu">
            <div>
              <button type="button" @click="showHideMenu();" class="justify-center px-4 py-2 text-gray-700 focus:outline-none" id="options-menu" aria-expanded="true" aria-haspopup="true">
                <font-awesome-icon icon="caret-down" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
              </button>
            </div>
            <div :class="showMenuCall?'':'hidden'" class="absolute right-0 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div class="py-1" role="none">
                <router-link :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('common.details')}}</router-link>
                <!-- <router-link :to="{ name: 'ViewOtherAccountDetails', params: { address: account.address }}" v-else class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">Details</router-link> -->
                <a v-if="!account.default && !otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" @click="setAsDefaultAccount(account.address)">{{$t('accounts.makeDefault')}}</a>
                <div v-else class="block px-2 py-1 text-xs text-gray-300">{{$t('accounts.makeDefault')}}</div>
                <a v-if="!otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" @click="exportWallet()">{{$t('common.export')}}</a>
                <a v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" @click="exportWallet()">{{$t('common.export')}}</a>
                <router-link :to="{ name: 'ViewAccountDelete', params: { name: account.name }}" v-if="!account.default && !otheraccount(account.address) || account.type =='MULTISIG'" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('common.delete')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300">{{$t('common.delete')}}</div>
                <router-link :to="{ name: isMultiSig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { name: account.name}}" v-if="!otheraccount(account.address) || account.type =='MULTISIG'" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('common.multisig')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" >{{$t('common.multisig')}}</div>
                <div class="block px-2 py-1 text-xs text-gray-300">{{$t('common.restrictions')}}</div>
                <div class="block px-2 py-1 text-xs text-gray-300">{{$t('common.metadata')}}</div>
                <router-link :to="{ name: 'ViewAccountDelegate', params: { address: account.address }}" v-if="!otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('common.delegate')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" >{{$t('common.delegate')}}</div>
                <router-link :to="{ name: 'ViewAccountAliasAddressToNamespace',params: { address: account.address }}" v-if="!otheraccount(account.address) || account.type =='MULTISIG'" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" >{{$t('services.linkToNamespace')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" >{{$t('services.linkToNamespace')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from "vue";
import CryptoJS from 'crypto-js';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import { useI18n } from 'vue-i18n';

export default{
  name: 'AccountTile',
  props: ['account','showMenuCall', 'i'],
  setup(p){
    const {t} = useI18n();
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject =/*  document.getElementById(id).getAttribute("copySubject") */ t('common.address');
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' '+ t('common.copied'), group: 'br', life: 3000});
    };   
    
    const mosaicNum = computed(() => {
      return (p.account.mosaic!=undefined)?p.account.mosaic.length:0;
    });

    const isMultiSig = computed(() => {
      let isMulti = p.account.getDirectParentMultisig().length? true: false
      return isMulti;
    });

    const otheraccount = (address) => {
      const other_account = walletState.currentLoggedInWallet.others.find(element => element.address == address);
      return other_account;
    };

    const prettyAddress = (address) => {
      const prettierAddress = Helper.createAddress(address).pretty();
      return prettierAddress;    
    };

    const setAsDefaultAccount = (add) => {
        walletState.currentLoggedInWallet.setDefaultAccountByAddress(add);
        walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
        emitter.emit("CLOSE_MENU_TRIGGER", p.i);
    };

    const exportWallet = () => {
      const wallet = walletState.currentLoggedInWallet;
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
      let networkName = networkState.chainNetworkName;
      networkName = (networkName.includes(' ')) ? networkName.split(' ').join('') : networkName;
      console.log(networkName)

      a.download = `${wallet.name}_${networkName}_${year}-${month}-${day}.wlt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const showHideMenu = () => {
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
      otheraccount,
      prettyAddress,
      copy,
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