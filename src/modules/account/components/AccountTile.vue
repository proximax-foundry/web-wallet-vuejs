<template>
  <div class="border rounded-lg border-gray-200 p-3 filter shadow-lg">
    <div class="flex gap-2 ">
      <div class="mt-auto mb-auto" v-html="svgString"></div>
      <div class="flex flex-col  ">
        <div class="text-blue-primary font-bold text-xs mb-0.5">{{accountName}}</div>
        <div class="flex justify-around">
          <div :id="account.address" class="text-xs font-bold mt-0.5 mr-2" :copyValue="prettyAddress(account.address)" copySubject="Address">{{prettyAddress(account.address)}}</div>
          <font-awesome-icon icon="copy" @click="copy(account.address)" class="w-5 h-5 text-blue-primary cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex">
          <div class = 'text-xs font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-xs font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xxs mt-0.5 '>{{splitBalance.right}}</div>
          <div class = 'ml-1 text-xs  font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
        </div>
        <div class='flex gap-2 '> 
          <div  v-if='account.default' class = 'px-1 py-0.5 flex items-center bg-blue-primary rounded-sm' title='This is your default account everytime you login'>
            <img src="@/modules/account/img/icon-pin.svg" class = 'h-4 w-4 ' >
            <p class = 'font-semibold text-white text-xxs pt-px cursor-default' >DEFAULT</p>
          </div>
          <div v-if='isMultiSig' class = 'px-1 py-0.5 flex items-center bg-green-500 rounded-sm ' title='This is a multisig account'>
            <img src="@/assets/img/icon-multisig.svg" class = 'h-3 w-3 mr-1' style= "transform: rotateY(180deg)" >
            <p  class = 'font-semibold text-white text-xxs pt-px cursor-default'  >MULTISIG</p>
          </div>
          <div v-if='isMultiSig && !otherAccount(account.address)' class = 'px-1 py-0.5 flex items-center bg-purple-500 rounded-sm' title='You own this multisig account' >
            <img src="@/assets/img/icon-key.svg" class = 'h-4 w-4 mr-1' >
            <p  class = 'font-semibold text-white text-xxs pt-px cursor-default'  >OWNER</p>
          </div>
        </div>
      </div>
      <div class="ml-auto mt-auto mb-auto ">
        <img src="@/assets/img/navi/icon-default-account-drop-down.svg" class=" h-6 w-6 cursor-pointer" @mouseover="isHover = true" @mouseout="isHover = false"  @click="displayDefaultAccountMenu = true" >
        <div class="relative"  @mouseover="isHover = true" @mouseout="isHover = false">
          <div v-if="displayDefaultAccountMenu"  class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div role="none" class="my-2">
              <router-link :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">Details</router-link>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{name:'ViewAccountAssets', params: { address: account.address}}" class= 'block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs'>Assets</router-link>
              <div  v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">Assets</div>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{ name: 'ViewMultisigHome', params: { name: accountName}}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">Multisig</router-link>
              <div v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">Multisig</div>
              <router-link  :to="{ name: 'ViewMultisigScheme', params: { address: account.address}}" @click="displayDefaultAccountMenu = false" v-if="isMultiSig" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">Scheme</router-link>
              <div  v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">Scheme</div>
              <router-link :to="{ name: 'ViewAccountSwap', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">Swap</router-link>
              <router-link v-if="!otherAccount(account.address)" :to="{ name: 'ViewAccountDelegate', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">Delegate</router-link>
              <div v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">Delegate</div>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: account.address}}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">Namespace</router-link>
              <div v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">Namespace</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref } from "vue";
import CryptoJS from 'crypto-js';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import {toSvg} from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { AppState} from '@/state/appState';

export default{
  name: 'AccountTile',
  props: ['account','showMenuCall', 'i'],
  setup(p){
    const toast = useToast();
    const multisig_add = ref("");
    const displayDefaultAccountMenu = ref(false)
    // const accountName = ref(p.account.name);

    const accountName = computed(() => {
      // check if address is in adress book
      const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address == p.account.address);
      if(contact){
        return contact.name;
      }else{
        return p.account.name;
      }
    })


    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);
    const accountBalance = computed(
      () => {          
        return Helper.toCurrencyFormat(p.account.balance, currentNativeTokenDivisibility.value);
      }
    );
    const splitBalance = computed(()=>{
      let split = accountBalance.value.split(".")
      if (split[1]!=undefined){
        return {left:split[0],right:split[1]}
      }else{
        return {left:split[0], right:null}
      }
    })

    let themeConfig = new ThemeStyleConfig('ThemeStyleConfig');
    themeConfig.init();

    const svgString = ref(toSvg(p.account.address, 50, themeConfig.jdenticonConfig));

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };   
    
    const mosaicNum = computed(() => {
      return (p.account.mosaic!=undefined)?p.account.mosaic.length:0;
    });

    const isMultiSig = computed(() => {
      let isMulti = p.account.getDirectParentMultisig().length? true: false
      return isMulti;
    });

    const otherAccount = (address) => {
      const other_account = walletState.currentLoggedInWallet.others.find(others => others.address == address);
      if(other_account != null && other_account.type == 'MULTISIG'){
        multisig_add.value = other_account.address;
      }
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
    const isHover = ref(false)
    emitter.on('PAGE_CLICK', () => {
      if(!isHover.value && !displayDefaultAccountMenu.value){

      }else if(!isHover.value && displayDefaultAccountMenu.value){
        displayDefaultAccountMenu.value = false
      }
    });


    return {
      currentNativeTokenName,
      splitBalance,
      svgString,
      otherAccount,
      prettyAddress,
      copy,
      showHideMenu,
      hoverOverMenu,
      hoverOutMenu,
      setAsDefaultAccount,
      exportWallet,
      mosaicNum,
      isMultiSig,
      accountName,
      displayDefaultAccountMenu,
      multisig_add,
      isHover
    }
  },
}
</script>
<style scoped>
.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  right: 10px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left:1px solid #E4E4E4;
  border-top:1px solid #E4E4E4;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
}
</style>