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
        <div class='flex'> 
          <div  v-if='account.default' class = ' px-1 py-0.5 flex mt-0.5 bg-blue-primary rounded-sm' title='This is your default account everytime you login'>
            <img src="@/modules/account/img/icon-pin.svg" class = 'h-4 w-4 ' >
            <p class = 'font-semibold text-white text-xxs pt-px cursor-default' >DEFAULT</p>
          </div>
          <div v-if='isMultiSig' class = 'ml-1.5 px-1 py-0.5 flex mt-0.5 bg-green-500 rounded-sm ' title='This is a multisig account'>
            <img src="@/assets/img/icon-multisig.svg" class = 'h-3 w-3 mr-1' style= "transform: rotateY(180deg)" >
            <p  class = 'font-semibold text-white text-xxs pt-px cursor-default'  >MULTISIG</p>
          </div>
          <div v-if='isMultiSig && !otheraccount(account.address)' class = 'ml-1.5 px-1 py-0.5 flex mt-0.5 bg-purple-500 rounded-sm' title='You own this multisig account' >
            <img src="@/assets/img/icon-key.svg" class = 'h-4 w-4 mr-1' >
            <p  class = 'font-semibold text-white text-xxs pt-px cursor-default'  >OWNER</p>
          </div>
        </div>
      </div>
      <router-link class="ml-auto mt-auto mb-auto" :to="{ name: 'ViewAccountDetails', params: { address: account.address }}"><img src="@/assets/img/chevron_right.svg" class="w-5 h-5 "></router-link>
    </div>
  </div>
  <!-- <div class='p-3'>
    <div class="rounded-2xl flex justify-between py-3 border border-gray-200" :class="account.default?'bg-white':'bg-gray-100'">
      <div class="ml-5 text-left text-sm w-full">
        <div class="font-bold mb-1">{{ accountName }} <span v-if="account.type =='DELEGATE'" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200">{{$t('services.delegate')}}</span> <span v-if="account.default" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-yellow-200">{{$t('accounts.default')}}</span> <span v-if="isMultiSig || account.type =='MULTISIG'" class="text-xs font-normal ml-2 inline-block py-1 px-2 rounded bg-blue-200">{{$t('accounts.multisig')}}</span></div>
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
                <router-link :to="{ name: 'ViewAccountDetails', params: { address: account.address }}" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('accounts.details')}}</router-link>
                <a v-if="!account.default && !otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" @click="setAsDefaultAccount(account.address)">{{$t('accounts.makedefault')}}</a>
                <div v-else class="block px-2 py-1 text-xs text-gray-300">{{$t('accounts.makedefault')}}</div>
                <a v-if="!otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" @click="exportWallet()">{{$t('accounts.export')}}</a>
                <a v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" @click="exportWallet()">{{$t('accounts.export')}}</a>
                <router-link :to="{ name: 'ViewAccountDelete', params: { name: account.name }}" v-if="!account.default && !otheraccount(account.address) || account.type =='MULTISIG'" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('accounts.delete')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300">{{$t('accounts.delete')}}</div>
                <router-link :to="{ name:'ViewMultisigHome', params: { name: account.name}}" v-if="!otheraccount(account.address) || account.type =='MULTISIG'" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('accounts.multisig')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" >{{$t('accounts.multisig')}}</div>
                <div class="block px-2 py-1 text-xs text-gray-300">{{$t('services.restrictions')}}</div>
                <div class="block px-2 py-1 text-xs text-gray-300">{{$t('services.metadata')}}</div>
                <router-link :to="{ name: 'ViewAccountDelegate', params: { address: account.address }}" v-if="!otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem">{{$t('services.delegate')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" >{{$t('services.delegate')}}</div>
                <router-link :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: account.address}}" v-if="!otheraccount(account.address)" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" >{{$t('services.linktonamespace')}}</router-link>
                <router-link :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: multsig_add }}" v-else-if="otheraccount(account.address) && account.type =='MULTISIG'" class="block px-2 py-1 text-xs text-gray-700 hover:bg-blue-primary hover:text-white" role="menuitem" >{{$t('services.linktonamespace')}}</router-link>
                <div v-else class="block px-2 py-1 text-xs text-gray-300" role="menuitem" >{{$t('services.linktonamespace')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import { computed, getCurrentInstance, ref } from "vue";
import CryptoJS from 'crypto-js';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
//import { OtherAccount } from '@/models/otherAccount';
import {toSvg} from "jdenticon";
export default{
  name: 'AccountTile',
  props: ['account','showMenuCall', 'i'],
  setup(p){
    const toast = useToast();
    const multsig_add = ref("");
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
    let jdenticonconfig = {
      hues: [211],
      lightness: {
          color: [0.32, 0.80],
          grayscale: [0.17, 0.82]
      },
      saturation: {
          color: 1.00,
          grayscale: 0.00
      },
      backColor: "#fff"
    };
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
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

    const svgString = ref(toSvg(p.account.address, 50, jdenticonconfig));

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

    const otheraccount = (address) => {
      const other_account = walletState.currentLoggedInWallet.others.find(others => others.address == address);
      if(other_account != null && other_account.type == 'MULTISIG'){
        // let otheraccountname = walletState.currentLoggedInWallet.convertAddressToName(address);
        // if(otheraccountname == address){
        //   accountName.value = p.account.name;
        // }
        // else{
        //   accountName.value = otheraccountname;
        // }
        multsig_add.value = other_account.address;
      }
      // } else {
      //   accountName.value = p.account.name;
      // }
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
      currentNativeTokenName,
      splitBalance,
      svgString,
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
      accountName,
      multsig_add
    }
  },
}
</script>