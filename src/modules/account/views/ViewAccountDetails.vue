<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-10"/>
       <div v-if="showModal" class="mb-8">
        <div class="border border-green-300 pl-6 pb-3 bg-green-50">
          <div class="flex items-center gap-3">
            <img src='@/assets/img/icon-green-tick.svg' class='h-10 w-10 pt-3 mr-2 '>
            <div class="flex flex-col w-full">
              <div class="flex">
                <div class="text-xs text-green-500 font-semibold pt-3">{{$t('general.congratz')}}</div>
                <img  @click="showModal=false" src="@/assets/img/delete.svg" class="w-5 ml-auto mr-1 cursor-pointer">
              </div>
              <div class="text-xxs mt-1">{{$t('account.accountCreated')}}{{$t('general.pkWarning')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <div class= 'w-32 text-center border-b-2 pb-3 border-yellow-500'>{{$t('account.accountDetails')}}</div>
        <router-link v-if="!isDelegate()" :to="{name:'ViewAccountAssets', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.asset',2)}}</router-link>
        <router-link v-if="!isDelegate()" :to="{name:'ViewMultisigHome', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.multisig')}}</router-link>
        <router-link v-if="isMultiSig" :to="{name:'ViewMultisigScheme', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
        <router-link :to="{name:'ViewAccountSwap', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.swap')}}</router-link>
        <MoreAccountOptions :address="address"/>
      </div>
      <div class='border-2 border-t-0 pb-6 px-6 pt-2'>
        <div class = 'mt-4 text-xxs text-blue-primary font-semibold uppercase'>{{$t('general.currentBalance')}}</div>
        <div class='flex my-1'>
          <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
          <div v-if="networkType ==168 " class='flex ml-auto gap-6 '>
            <a  :href="topUpUrl" target="_blank" class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
              <div class='text-xs mt-0.5 font-semibold text-white'>{{$t('general.topUp',{tokenName: currentNativeTokenName})}}</div>
              <img src="@/modules/dashboard/img/icon-link-new-white.svg" class='h-5 w-5  cursor-pointer '>
            </a>
          </div>
        </div>
        <div class = 'text-txs text-gray-400 '>{{$t('general.estimateUSD')}} {{currencyConvert}}</div>
        <div class='my-6 gray-line'></div>
        <div class = 'text-xxs text-blue-primary mt-2 font-semibold uppercase'>{{$t('general.publicKey')}}</div>
        <div class= 'flex'>
          <div id="public" class="text-xs font-semibold mt-1 break-all" :copyValue="acc?acc.publicKey:''" :copySubject="$t('general.publicKey')">{{acc?acc.publicKey:''}}</div>
          <font-awesome-icon icon="copy" @click="copy('public')" :title="$t('general.copy')" class="ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
        </div>
        <div v-if='!other_acc' class='my-6 gray-line'></div>
        <div v-if='!other_acc' >
          <div class = 'text-xxs text-blue-primary mt-0.5 font-semibold uppercase'>{{$t('general.privateKey')}}</div>
          <div class='flex '>
            <div v-if="!showPwPK && !showPK" class='break-all font-semibold'>****************************************************************</div>
            <PkPasswordModal v-if="!showPwPK && !showPK" :account = 'acc' />
          </div>
          <div class='flex'>
            <div id="private" class="text-xs mt-1 font-semibold break-all" type="text" :copyValue="privateKey" :copySubject="$t('general.privateKey')" v-if="showPK">{{privateKey}}</div>
            <font-awesome-icon :title="$t('general.copy')" icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer " v-if="showPK"></font-awesome-icon>
            <font-awesome-icon icon="eye-slash" title='Hide Private Key' class="text-blue-link relative cursor-pointer mt-0.5 ml-1" @click="showPwPK = false; showPK = false" v-if="showPK"></font-awesome-icon>
          </div>
          <div class = 'text-txs mt-2 text-red-400 border px-1.5 py-2 border-red-400 rounded-md'>{{$t('general.pkWarning')}}</div>
      </div>
      <div class='my-6 gray-line' v-if="!other_acc "></div>
      <div class='flex'>
        <PdfPasswordModal v-if='!other_acc' />
        <DeleteAccountModal v-if="!isDefault && !other_acc " :account ='acc' />
      </div>
      </div>
    </div>
</div>
</template>

<script >
import {getXPXcurrencyPrice } from '@/util/functions';
import { watch, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import TextInput from "@/components/TextInput.vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from 'vue-i18n';
import { pdfWalletPaperImg } from '@/modules/account/pdfPaperWalletBackground';
import jsPDF from 'jspdf';
import qrcode from 'qrcode-generator';
import PkPasswordModal from '@/modules/account/components/PkPasswordModal.vue'
import PdfPasswordModal from '@/modules/account/components/PdfPasswordModal.vue'
import DeleteAccountModal from '@/modules/account/components/DeleteAccountModal.vue'
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import { AppState } from '@/state/appState';

export default {
  name: "ViewAccountDetails",
  components: {
    /* TextInput, */
    PkPasswordModal,
    PdfPasswordModal,
    DeleteAccountModal,
    AccountComponent,
    MoreAccountOptions
  },
  props: {
    address: String,
    accountCreated: Boolean
  },
  setup(p) {
    const {t} = useI18n();
    const toast = useToast();
    const router = useRouter();
    const showModal = ref(false)
    // get account details
    

    let isDelegate = ()=>{
      if(!walletState.currentLoggedInWallet){
        return false
      }
      let account = walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
      if(account){
        return account.type=="DELEGATE"?true:false
      }else{
        return false
      }
    }
    const acc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
      let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
      if(!acc){
        return null
      }
      return acc
    })
   const other_acc = computed(()=>{
      if(!walletState.currentLoggedInWallet){
        return null
      }
     return walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
   })
    
    if(p.accountCreated){
      showModal.value= true
    }
    const isDefault = computed(()=> {
      if(!acc.value){
        return false
      }
      return acc.value.default?true: false
    })
    
    
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    var prettyAddress = ''
    try {
      prettyAddress = Helper.createAddress(acc.value?acc.value.address:'').pretty();
    } catch (error) {
      
    } 
    const err = ref(false);
    
    
    const showPwPK = ref(false);
    const showPK = ref(false);
    const privateKey = ref("");
    const showPasswdError = ref(false);
    const walletPasswd = ref("");
    const walletPasswdSwap = ref("");
    const walletPasswdWalletPaper  = ref("");
    const showPwSwap = ref(false);
    const showWalletPaperPw = ref(false);
    const showSavePaperWallet = ref(false);
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);

      toast.add({severity:'info', detail: copySubject +' ' + t('general.copied'), group: 'br', life: 3000});
    };

    
    const isMultiSig = computed(() => {
      if(!acc.value){
        return false
      }
      let isMulti = acc.value.getDirectParentMultisig().length? true: false
      return isMulti;
    });  

   

    const verifyWalletPwSwap = () => {
      if (walletPasswdSwap.value == "") {
        err.value = "Please insert wallet password to swap";
        showPwSwap.value = false;
      } else {
        err.value = "";
      }
    };
    
    const currencyConvert = ref('');
     const getCurrencyPrice = () => {
      if(!acc.value){
        return 
      }
      let balance = acc.value.balance;
      getXPXcurrencyPrice(balance).then((total) => {
        currencyConvert.value = Helper.toCurrencyFormat(total, AppState.nativeToken.divisibility);
      });
    };
     
    const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
    const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);

    const accountBalance = computed(
      () => {          
        if(!acc.value){
          return "0"
        }
        return Helper.toCurrencyFormat(acc.value.balance, currentNativeTokenDivisibility.value);
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

    if(AppState.nativeToken.label=== "XPX"){
      getCurrencyPrice();

      watch(accountBalance, () => {
        getCurrencyPrice();
      });
    }


    const generateQR = (url, size = 2, margin = 0) => {
      const qr = qrcode(10, 'H');
      qr.addData(url);
      qr.make();
      return qr.createDataURL(size, margin);
    }

    const saveWalletPaper = (password) => {
      const doc = new jsPDF({
        unit: 'px'
      });
      doc.addImage(pdfWalletPaperImg, 'JPEG', 120, 60, 205, 132);

      // QR Code Address
      const passwordInstance = WalletUtils.createPassword(password);
      const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.value.encrypted,acc.value.iv);
      let privateKey = walletPrivateKey.toUpperCase();
      doc.addImage(generateQR(privateKey, 1, 0), 151.5, 105);

      // Addres number
      doc.setFontSize(8);
      doc.setTextColor('#000000');
      doc.text(prettyAddress, 146, 164, { maxWidth: 132 });
      doc.save('Your_Paper_Wallet');
    }

    const networkType = computed(()=>{
    return AppState.networkType
    })
    const topUpUrl = computed(()=>{
      if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 1'){
        return 'https://bctestnetfaucet.xpxsirius.io/#/'
      }else if (networkType.value == 168 && networkState.chainNetworkName=='Sirius Testnet 2'){
        return 'https://bctestnet2faucet.xpxsirius.io/#/'
      }else{
        return ''
      }
    }) 

    emitter.on("revealPK", (e) => {
      showPK.value = e;
    });
    emitter.on("pkValue", (e) => {
      privateKey.value = e
    });
    emitter.on("unlockWalletPaper", (e) => {
      saveWalletPaper(e)
    });
   

    return {
      topUpUrl,
      networkState,
      showModal,
      splitBalance,
      other_acc,
      currencyConvert,
      isMultiSig,
      currentNativeTokenName,
      isDefault,
      err,
      showPK,
      showPwPK,
      showPasswdError,
      walletPasswd,
      walletPasswdSwap,
      showPwSwap,
      isDelegate,
      acc,
      verifyWalletPwSwap,
      copy,
      privateKey,
      prettyAddress,
      showWalletPaperPw,
      showSavePaperWallet,
      walletPasswdWalletPaper,
      saveWalletPaper,
      networkType
    };
  }
};
</script>
<style scoped>
.popup-outer-create-wallet{
  
  top: 40px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 400px;

}
</style>