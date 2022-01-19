<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="acc.address" class="mb-10"/>
       <div v-if="showModal" class="mb-8">
        <div class="border border-green-300 pl-6 pb-3 bg-green-50">
          <div class="flex items-center gap-3">
            <img src='@/assets/img/icon-green-tick.svg' class='h-10 w-10 pt-3 mr-2 '>
            <div class="flex flex-col w-full">
              <div class="flex">
                <div class="text-xs text-green-500 font-semibold pt-3">Congratulations!</div>
                <img  @click="showModal=false" src="@/assets/img/delete.svg" class="w-5 ml-auto mr-1 cursor-pointer">
              </div>
              <div class="text-xxs mt-1">Your wallet has been successfully created. Make sure you store your private key in a safe place. Access to your digital assets cannot be recovered without it.</div>
            </div>
          </div>
        </div>
      </div>
      <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <div class= 'w-32 text-center border-b-2 pb-3 border-yellow-500'>Account Details</div>
        <router-link v-if="!isDelegate()" :to="{name:'ViewMultisigHome', params: { name: acc.name}}" class= 'w-18 text-center'>Multisig</router-link>
        <router-link v-if="isMultiSig" :to="{name:'ViewMultisigScheme', params: { address: acc.address}}" class= 'w-18 text-center'>Scheme</router-link>
        <router-link :to="{name:'ViewAccountSwap', params: { address: acc.address}}" class= 'w-18 text-center'>Swap</router-link>
        <MoreAccountOptions :address="acc.address"/>
      </div>
      <div class='border-2 border-t-0 pb-6 px-6 pt-2'>
        <img src="@/modules/account/img/icon-info.svg" class='h-4 w-4 ml-auto' 
        :title="'Top up your account balance to a maximum of 100,000 test-' + currentNativeTokenName + ' every 24 hours.'">
        <div class = 'text-xxs text-blue-primary font-semibold'>CURRENT BALANCE</div>
        <div class='flex my-1'>
          <div class = 'text-md font-bold '>{{splitBalance.left}} </div>
          <div class = 'text-md font-bold' v-if='splitBalance.right!=null'>.</div>
          <div class='text-xs mt-1.5 font-bold'>{{splitBalance.right}}</div>
          <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
          <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
          <div class='flex ml-auto gap-6 '>
            <router-link :to='{name:"ViewTransferCreate"}' class='flex cursor-pointer'>
              <img src="@/assets/img/icon-transfer.svg" class=" w-5 h-5 mt-0.5  cursor-pointer mr-1">
              <div class='text-xs mt-1 font-semibold '>Transfer {{currentNativeTokenName}}</div>
            </router-link>
            <!-- <a v-if="networkState.chainNetwork == 0" href="https://www.proximax.io/en/xpx" target="_blank" class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
              <div class='text-xs mt-0.5 font-semibold text-white'>Top up {{currentNativeTokenName}}</div>
              <img src="@/modules/dashboard/img/icon-link-new-white.svg" class='h-5 w-5  cursor-pointer '>
            </a> -->
            <a v-if="networkState.chainNetwork == 0" href="https://bctestnetfaucet.xpxsirius.io/#/" target="_blank" class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
              <div class='text-xs mt-0.5 font-semibold text-white'>Top up {{currentNativeTokenName}}</div>
              <img src="@/modules/dashboard/img/icon-link-new-white.svg" class='h-3 w-3 mt-1 ml-1 cursor-pointer '>
            </a>
            <a v-if="networkState.chainNetwork == 1" href="https://bctestnet2faucet.xpxsirius.io/#/" target="_blank" class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
              <div class='text-xs mt-0.5 font-semibold text-white'>Top up {{currentNativeTokenName}}</div>
              <img src="@/modules/dashboard/img/icon-link-new-white.svg" class='h-3 w-3 mt-1 ml-1 cursor-pointer '>
            </a>
          </div>
        </div>
        <div class = 'text-txs text-gray-400 '>Estimate US$ {{currencyConvert}}</div>
        <div class='my-6 gray-line'></div>
        <div class = 'text-xxs text-blue-primary mt-2 font-semibold'>PUBLIC KEY</div>
        <div class= 'flex'>
          <div id="public" class="text-xs font-semibold mt-1 break-all" :copyValue="acc.publicKey" copySubject="Public Key">{{acc.publicKey}}</div>
          <font-awesome-icon icon="copy" @click="copy('public')" title='Copy' class="ml-2 mt-0.5 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
        </div>
        <div v-if='!other_acc' class='my-6 gray-line'></div>
        <div v-if='!other_acc' >
          <div class = 'text-xxs text-blue-primary mt-0.5 font-semibold'>PRIVATE KEY</div>
          <div class='flex '>
            <div v-if="!showPwPK && !showPK" class='break-all font-semibold'>****************************************************************</div>
            <PkPasswordModal v-if="!showPwPK && !showPK" :account = 'acc' />
          </div>
          <div class='flex'>
            <div id="private" class="text-xs mt-1 font-semibold break-all" type="text" :copyValue="privateKey" copySubject="Private Key" v-if="showPK">{{privateKey}}</div>
            <font-awesome-icon title='Copy' icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link mt-0.5 cursor-pointer " v-if="showPK"></font-awesome-icon>
            <font-awesome-icon icon="eye-slash" title='Hide Private Key' class="text-blue-link relative cursor-pointer mt-0.5 ml-1" @click="showPwPK = false; showPK = false" v-if="showPK"></font-awesome-icon>
          </div>
          <p class = 'text-txs mt-2 text-gray-400'>{{$t('createsuccessful.warningtext1')}} {{$t('createsuccessful.warningtext2')}}</p>
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
    var acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address);
    const other_acc = walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);

    let isDelegate = ()=>{
      let account = walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
      if(account){
        return account.type=="DELEGATE"?true:false
      }else{
        return false
      }
    }
    
    if(!acc){
      if(other_acc)
      {
        acc = other_acc;
      }
    }
    
    if(p.accountCreated){
      showModal.value= true
    }
    const isDefault = (acc.default == true) ? true: false
    if (acc === -1) {
      router.push({name: "ViewAccountDisplayAll"});
    }
    
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const prettyAddress = Helper.createAddress(acc.address).pretty();
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

      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    
    const isMultiSig = computed(() => {
      let isMulti = acc.getDirectParentMultisig().length? true: false
      return isMulti;
    });  

   

    const verifyWalletPwPk = () => {
      if (walletPasswd.value == "") {
        err.value = "Please insert wallet password to show Private Key";
        showPK.value = false;
        showPwPK.value = false;
      } else{
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPasswd.value)) {
          // pw is correct
          const passwordInstance = WalletUtils.createPassword(walletPasswd.value);
          const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.encrypted,acc.iv);
          privateKey.value = walletPrivateKey.toUpperCase();
          showPK.value = true;
          err.value = "";
        } else {
          showPK.value = false;
          err.value = "Wallet password is incorrect";
        }
      }
    };

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
      let balance = acc.balance;
      getXPXcurrencyPrice(balance).then((total) => {
        currencyConvert.value = Helper.toCurrencyFormat(total, 6);
      });
    };
     
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);

    const accountBalance = computed(
      () => {          
        return Helper.toCurrencyFormat(acc.balance, currentNativeTokenDivisibility.value);
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

    if(networkState.currentNetworkProfile.network.currency.name === "XPX"){
      getCurrencyPrice();

      watch(accountBalance, () => {
        getCurrencyPrice();
      });
    }

    const verifyWalletPwWalletPaper = () => {
      if (walletPasswdWalletPaper.value == "") {
        err.value = "Please insert wallet password to save paper wallet";
        showWalletPaperPw.value = false;
      } else{
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswdWalletPaper.value)) {
          // pw is correct
          showSavePaperWallet.value = true;
          // walletPasswdWalletPaper.value = false;
        } else {
          err.value = "Wallet password is incorrect";
        }
      }
    };

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
      const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.encrypted,acc.iv);
      let privateKey = walletPrivateKey.toUpperCase();
      doc.addImage(generateQR(privateKey, 1, 0), 151.5, 105);

      // Addres number
      doc.setFontSize(8);
      doc.setTextColor('#000000');
      doc.text(prettyAddress, 146, 164, { maxWidth: 132 });
      doc.save('Your_Paper_Wallet');
    }
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
      verifyWalletPwPk,
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
      verifyWalletPwWalletPaper,
      saveWalletPaper,
    };
  }
};
</script>
<style scoped>
.popup-outer-create-wallet{
  
  top: 40px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 400px;

}
</style>