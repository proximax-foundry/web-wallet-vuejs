<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div v-if='showModal' >
        <transition
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__fadeOutUp"
        >
          <div class="popup-outer-create-wallet absolute flex z-50">
            <div class="modal-popup-box ">
              <img src='@/assets/img/icon-blue-tick.svg' class='h-5 w-5 ml-auto mr-auto mb-3'>
              <div class= 'text-center mt-2 text-xs font-semibold'>Account Creation Successful</div>
              <div class ='text-gray-500 text-center text-xs mt-2'>Should you wish to get testnet {{currentNativeTokenName}} amount, you can top up every 24 hours in your account.</div>
              <div class='flex flex-wrap content-center'>
                <div @click="showModal=false" class= ' mt-4 w-4/12 ml-auto mr-auto text-center  blue-btn cursor-pointer font-semibold text-xs py-2 px-2 mt-2 font-semibold mb-3' >Close</div>
              </div>
            </div>
          </div>
        </transition>
        <div class="fixed inset-0 bg-opacity-60 z-10 bg-gray-100"></div>
      </div>
    <div class='w-9/12 ml-auto mr-auto '>
      <div class = 'flex text-xs font-semibold border-b-2'>
        <div class= 'w-18 text-center border-b-4 pb-3 border-yellow-500'>Details</div>
        <router-link :to="{name:'ViewMultisigHome', params: { name: acc.name}}" class= 'w-18 text-center'>Multisig</router-link>
      </div>
      <div class='my-7 font-semibold'>Account Details</div>
      <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
      <div class='border-2'>
        <div class='flex'>
          <div v-html='svgString'></div>
          <div class='flex flex-col justify-center'>
            <div class='flex '>
              <div class = ' ml-4 font-semibold text-md' v-if='showName'>{{ accountNameDisplay }}</div>
              <input class='outline-none ml-4 font-semibold text-md'  v-model='accountName' v-if='!showName'/>
              <img src="@/modules/account/img/edit-icon.svg"  v-if='showName' @click='showName=!showName' title='Edit Account Name' class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" >
              <img src="@/modules/account/img/edit-icon.svg"  v-if='!showName'  @click="changeName()" title='Confirm Account Name' class="w-4 h-4 text-black cursor-pointer mt-1 ml-1" >
            </div>
            <div class='flex'> 
              <div  v-if='isDefault' class = 'ml-3 px-1 py-0.5 flex mt-0.5 bg-blue-primary rounded-sm'>
                <img src="@/modules/account/img/icon-pin.svg" class = 'h-4 w-4 ' title='This is your default account everytime you login'>
                <p class = 'font-semibold text-white text-xxs pt-px cursor-default' title='This is your default account everytime you login' >DEFAULT</p>
              </div>
              <div v-if='isMultiSig' class = 'ml-1.5 px-1 py-0.5 flex mt-0.5 bg-orange-primary rounded-sm '>
                <img v-if='isMultiSig' src="@/assets/img/icon-key.svg" class = 'h-4 w-4 mr-1' title='This is your default account everytime you login'>
                <p v-if='isMultiSig' class = 'font-semibold text-white text-xxs pt-px cursor-default' title='This is a multisig account' >MULTISIG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='border-2 mt-3 pb-6 px-6 pt-2'>
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
            <div class='flex cursor-pointer'>
              <img src="@/modules/dashboard/img/icon-send-xpx.svg" class="w-5 h-5 mt-0.5  cursor-pointer mr-1">
              <div class='text-xs mt-1 font-semibold '>Transfer {{currentNativeTokenName}}</div>
            </div>
            <div class='flex cursor-pointer'>
              <img src="@/modules/dashboard/img/icon-send-xpx.svg" class="w-5 h-5 mt-0.5  cursor-pointer mr-1">
              <div class='text-xs mt-1 font-semibold'>Request {{currentNativeTokenName}}</div>
            </div>
            <div class='flex bg-navy-primary rounded-md py-0.5 px-3 cursor-pointer'>
              <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5  cursor-pointer '>
              <div class='text-xs mt-0.5 font-semibold text-white'>Top up {{currentNativeTokenName}}</div>
            </div>
          </div>
        </div>
        <div class = 'text-txs text-gray-400 '>Estimate US$ {{currencyConvert}}</div>
        <div class='my-6 gray-line'></div>
        <div class = 'text-xxs text-blue-primary mt-2 font-semibold'>WALLET ADDRESS</div>
        <div class= 'flex'>
          <div id="address" :copyValue="prettyAddress" copySubject="Address" class = 'text-xs font-semibold mt-1'>{{prettyAddress}} </div>
          <font-awesome-icon icon="copy" title='Copy' @click="copy('address')" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
        </div>
        <div class='my-6 gray-line'></div>
        <div class = 'text-xxs text-blue-primary mt-2 font-semibold'>PUBLIC KEY</div>
        <div class= 'flex'>
          <div id="public" class="text-xs font-semibold mt-1 break-all" :copyValue="acc.publicKey" copySubject="Public Key">{{acc.publicKey}}</div>
          <font-awesome-icon icon="copy" @click="copy('public')" title='Copy' class="ml-2 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
        </div>
        <div class='my-6 gray-line'></div>
        <div v-if='!other_acc' >
          <div class = 'text-xxs text-blue-primary mt-0.5 font-semibold'>PRIVATE KEY</div>
          <div class='flex '>
            <div v-if="!showPwPK && !showPK" class='break-all font-semibold'>****************************************************************</div>
            <PkPasswordModal v-if="!showPwPK && !showPK" :account = 'acc' />
          </div>
          <div class='flex'>
            <div id="private" class="text-xs mt-1 font-semibold w-full break-all" type="text" :copyValue="privateKey" copySubject="Private Key" v-if="showPK">{{privateKey}}</div>
            <font-awesome-icon title='Copy' icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link cursor-pointer " v-if="showPK"></font-awesome-icon>
            <font-awesome-icon icon="eye-slash" title='Hide Private Key' class="text-blue-link relative cursor-pointer ml-1" @click="showPwPK = false; showPK = false" v-if="showPK"></font-awesome-icon>
          </div>
          <p class = 'text-txs mt-2 text-gray-400'>{{$t('createsuccessful.warningtext1')}} {{$t('createsuccessful.warningtext2')}}</p>
      </div>
      <div class='my-6 gray-line' v-if='!other_acc'></div>
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
import { ApplicationConfig } from '@/models/stores/applicationConfig';

export default {
  name: "ViewAccountDetails",
  components: {
    /* TextInput, */
    PkPasswordModal,
    PdfPasswordModal,
    DeleteAccountModal
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

    let jdenticon = new ApplicationConfig('applicationConfig');
    jdenticon.init();

    const svgString = ref(toSvg(acc.address, 100, jdenticon.jdenticonConfig));

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
    const accountName = ref(acc.name);
    const accountNameDisplay = ref(acc.name);
    const showName = ref(true);
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

    const changeName = () => {
      if (accountName.value.trim()) {
        const exist_account = walletState.currentLoggedInWallet.accounts.find((accName) => accName.name == accountName.value.trim());
        const exist_other_account = walletState.currentLoggedInWallet.others.find((accName) => accName.name == accountName.value.trim());

        if (!exist_account && !exist_other_account) {
          const acc_index = walletState.currentLoggedInWallet.accounts.findIndex((accAdd) => accAdd.address === p.address);
          if(acc_index == -1){
            const other_acc_index = walletState.currentLoggedInWallet.others.findIndex((accAdd) => accAdd.address === p.address);
            walletState.currentLoggedInWallet.others[other_acc_index].name = accountName.value;
          }
          else{
            walletState.currentLoggedInWallet.accounts[acc_index].name = accountName.value;
          }
          walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
          showName.value = true;
          accountNameDisplay.value = accountName.value;
          err.value = "";
        } else if (exist_account || exist_other_account) {
          err.value = t('scriptvalues.accountnametaken');
        } else {
          err.value = t('scriptvalues.accountnamevalidation');
        }
      } else {
        err.value = t('scriptvalues.inputaccountname');
      }
    };

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
      showModal,
      svgString,
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
      accountNameDisplay,
      verifyWalletPwPk,
      walletPasswd,
      walletPasswdSwap,
      showPwSwap,
      showName,
      changeName,
      accountName,
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