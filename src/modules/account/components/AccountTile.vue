<template>
  <div class="border rounded-lg border-gray-200 p-3 filter shadow-lg">
    <div class="flex gap-2 ">
      <div class="mt-auto mb-auto" v-html="svgString"></div>
      <div class="flex flex-col  ">
        <div class="text-blue-primary font-bold text-xs mb-0.5">{{accountName}}</div>
        <div class="flex justify-around">
          <div :id="account.address" class="text-xs font-bold mt-0.5 mr-2" :copyValue="prettyAddress(account.address)" :copySubject="$t('general.address')">{{prettyAddress(account.address)}}</div>
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
          <div  v-if='account.default' class = 'px-1 py-0.5 flex items-center bg-blue-primary rounded-sm' :title="$t('general.defaultTitle')">
            <img src="@/modules/account/img/icon-pin.svg" class = 'h-4 w-4 ' >
            <p class = 'font-semibold text-white text-xxs pt-px cursor-default uppercase' >{{$t('general.default')}}</p>
          </div>
          <div v-if='isMultiSig' class = 'px-1 py-0.5 flex items-center bg-green-500 rounded-sm ' :title="$t('general.multisigTitle')">
            <img src="@/assets/img/icon-multisig.svg" class = 'h-3 w-3 mr-1' style= "transform: rotateY(180deg)" >
            <p  class = 'font-semibold text-white text-xxs pt-px cursor-default uppercase'  >{{$t('general.multisig')}}</p>
          </div>
          <div v-if='isMultiSig && !otherAccount(account.address)' class = 'px-1 py-0.5 flex items-center bg-purple-500 rounded-sm' :title="$t('general.ownerTitle')" >
            <img src="@/assets/img/icon-key.svg" class = 'h-4 w-4 mr-1' >
            <p  class = 'font-semibold text-white text-xxs pt-px cursor-default uppercase'  >{{$t('general.owner')}}</p>
          </div>
        </div>
      </div>
      <div class="ml-auto mt-auto mb-auto ">
        <img src="@/assets/img/navi/icon-default-account-drop-down.svg" class=" h-6 w-6 cursor-pointer" @mouseover="isHover = true" @mouseout="isHover = false"  @click="displayDefaultAccountMenu = true" >
        <div class="relative"  @mouseover="isHover = true" @mouseout="isHover = false">
          <div v-if="displayDefaultAccountMenu"  class="mt-1 pop-option absolute right-0 w-32 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div role="none" class="my-2">
              <router-link :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.details')}}</router-link>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{name:'ViewAccountAssets', params: { address: account.address}}" class= 'block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs'>{{$t('general.asset',2)}}</router-link>
              <div  v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">{{$t('general.asset',2)}}</div>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{ name: 'ViewMultisigHome', params: { address: account.address}}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.multisig')}}</router-link>
              <div v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">{{$t('general.multisig')}}</div>
              <router-link  :to="{ name: 'ViewMultisigScheme', params: { address: account.address}}" @click="displayDefaultAccountMenu = false" v-if="isMultiSig" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.scheme')}}</router-link>
              <div  v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">{{$t('general.scheme')}}</div>
              <router-link v-if="isNormalAcc" :to="{ name: 'ViewAccountSwap', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.swap')}}</router-link>
              <div  v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">{{$t('general.swap')}}</div>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{ name: 'ViewAccountDelegate', params: { address: account.address }}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.delegate')}}</router-link>
              <div v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">{{$t('general.delegate')}}</div>
              <router-link v-if="!otherAccount(account.address) ||( otherAccount(account.address) && multisig_add!='')" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: account.address}}" @click="displayDefaultAccountMenu = false" class="block hover:bg-gray-100 transition duration-200 p-2 z-20 text-xs">{{$t('general.namespace')}}</router-link>
              <div v-else class="block text-gray-300 transition duration-200 p-2 z-20 text-xs">{{$t('general.namespace')}}</div>
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
import { useI18n } from 'vue-i18n';

export default{
  name: 'AccountTile',
  props: ['account'],
  setup(p){
    const toast = useToast();
    const {t} = useI18n();
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

    const isNormalAcc = computed(()=>{
      let isNormal = false
      let findAcc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.name==p.account.name)
      if(findAcc){
        if(findAcc.getDirectParentMultisig().length==0){
          isNormal = true
        }
      }
      return isNormal
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

      toast.add({severity:'info', detail: copySubject + ' '+ t('general.copied'), group: 'br', life: 3000});
    };   

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
      isMultiSig,
      accountName,
      displayDefaultAccountMenu,
      multisig_add,
      isHover,
      isNormalAcc
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