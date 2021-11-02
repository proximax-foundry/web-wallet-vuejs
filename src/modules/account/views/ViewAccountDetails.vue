<template>
<div>
<div class = 'flex text-xs font-semibold'>
  <div class= 'w-18 text-center border-b-4 pb-3 border-yellow-500'>Details</div>
  <router-link :to="{ name: isMultiSig ? 'ViewMultisigEditAccount' : 'ViewMultisigConvertAccount', params: { name: acc.name}}" class= 'w-18 text-center'>Multisig</router-link>
  <div class= 'w-18 text-center'>Backup</div>
</div>
<div class=' py-3 gray-line'>
  <div class = 'mt-2 text-md font-semibold'>Account Details</div>
  <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
    <div class= 'flex'>
      <div class = 'mt-5 h-12 w-12 bg-gray-300 rounded-lg '></div>
      <div class= 'flex flex-col mt-4'>
        <div class = 'flex'>
          <img v-if='isDefault' src="@/modules/account/img/info-icon.svg" class = 'ml-3 h-4 w-4 bg-gray-200' title='This is your default account everytime you login'>
          <p v-if='isDefault' class = 'text-txs pt-px bg-gray-200 text-blue-link cursor-default' title='This is your default account everytime you login' >DEFAULT ACCOUNT</p>
          <img v-if='isMultiSig' src="@/modules/account/img/info-icon.svg" class = 'ml-3 h-4 w-4 bg-gray-200' title='This is your default account everytime you login'>
          <p v-if='isMultiSig' class = 'text-txs pt-px bg-gray-200 text-blue-link cursor-default' title='This is a multisig account' >MULTISIG ACCOUNT</p>
        </div>
        <div class = 'flex'>
          <div class = ' ml-4 font-semibold text-md' v-if="showName">{{ accountNameDisplay }}</div>
          <div v-else>
            <TextInput class = 'mt-1 ml-4' :placeholder="$t('swap.accountname')" :errorMessage="$t('accounts.namevalidation')" v-model="accountName" icon="wallet" />
          </div>
          <img src="@/modules/account/img/edit-icon.svg" title='Edit Account Name' @click="editName()" class="w-5 h-5 text-black cursor-pointer mt-0.5 ml-1" v-if="showName">
          <div v-else class = 'flex flex-col'>
            <font-awesome-icon icon="check-circle" @click="changeName()" class="w-5 h-5 text-gray-500 cursor-pointer  mt-1.5 ml-3 mb-1"></font-awesome-icon>
            <font-awesome-icon @click="hidePanel()" icon="times-circle" class="w-5 h-5 text-gray-500 cursor-pointer ml-3"></font-awesome-icon>
          </div>
        </div>
      </div>
    </div>
    <div class = 'text-txs text-gray-400 mt-2 ml-16'>CURRENT BALANCE</div>
    <div class= 'flex'>
      <div class = 'text-md font-semibold ml-16'>{{splitBalance.left}} </div>
      <div class = 'text-md font-semibold' v-if='splitBalance.right!=null'>.</div>
      <div class='text-xs mt-1.5 font-light'>{{splitBalance.right}}</div>
      <div class = 'ml-1 font-bold'>{{currentNativeTokenName}}</div>
      <img src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
      <img src="@/modules/account/img/dots-icon.svg" class='h-4 w-5 mt-1'>
    </div>
    <div class = 'text-txs text-gray-400  ml-16'>Estimate US$ {{currencyConvert}}</div>
    <div class = 'text-txs text-gray-400 mt-5 ml-16'>WALLET ADDRESS</div>
    <div class= 'flex'>
      <div id="address" :copyValue="prettyAddress" copySubject="Address" class = 'text-xs font-bold ml-16 mt-1'>{{prettyAddress}} </div>
      <font-awesome-icon icon="copy" title='Copy' @click="copy('address')" class="ml-2 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
      <PdfPasswordModal v-if='!other_acc' />
    </div>
    <div class = 'w-7/12  h-28 border rounded-xl ml-16 mt-5 pl-4 pt-3 pr-4'>
      <div class= 'flex'>
        <div class = 'text-xs font-semibold'>Public Key</div>
         <font-awesome-icon icon="copy" @click="copy('public')" title='Copy' class="ml-2 pb-1 w-5 h-5 text-blue-link cursor-pointer "></font-awesome-icon>
      </div>
      <div id="public" class="text-xs text-gray-400 w-full break-all" :copyValue="acc.publicKey" copySubject="Public Key">{{acc.publicKey}}</div>
    </div>
    <div v-if='!other_acc' class = 'w-7/12  h-28 border rounded-xl ml-16 mt-5 pl-4 pt-3 pr-4'>
      <div class= 'flex'>
        <div class = 'text-xs font-semibold'>Private Key</div>
          <font-awesome-icon title='Copy' icon="copy" @click="copy('private')" class="ml-2 pb-1 w-5 h-5 text-blue-link cursor-pointer " v-if="showPK"></font-awesome-icon>
           <PkPasswordModal v-if="!showPwPK && !showPK" :account = 'acc' />
          <font-awesome-icon icon="eye-slash" title='Hide Private Key' class="text-blue-link relative cursor-pointer ml-1" @click="showPwPK = false; showPK = false" v-if="showPK"></font-awesome-icon>
          <img src='@/modules/account/img/swap-icon.svg' title='Swap with this private key' class='w-5 h-4 ml-auto  '>
          <!-- <button class="default-btn w-36" @click="showPwSwap = !showPwSwap" v-if="!showPwSwap">{{$t('accounts.enable')}}</button>
          <button class="default-btn w-36" @click="verifyWalletPwSwap()" v-if="showPwSwap" >{{$t('accounts.submit')}}</button> -->
      </div>
      <div v-if="!showPwPK && !showPK">**************</div>
      <div id="private" class="text-xs text-gray-400 w-full break-all" type="text" :copyValue="privateKey" copySubject="Private Key" v-if="showPK">{{privateKey}}</div>
      <p class = 'text-txs mt-2 text-gray-400'>{{$t('createsuccessful.warningtext1')}}</p>
      <p class = 'text-txs text-gray-400'>{{$t('createsuccessful.warningtext2')}}</p>
    </div>
    <div v-if="!isDefault && !other_acc " class= 'border-b-2 mt-10'></div> 
    <div v-if="!isDefault && !other_acc  " class= 'mt-7 text-sm font-semibold'>Delete Account</div>
    <DeleteAccountModal v-if="!isDefault && !other_acc " :account ='acc'/>
</div>
</div>
</template>

<script>
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
export default {
  name: "ViewAccountDetails",
  components: {
    TextInput,
    PkPasswordModal,
    PdfPasswordModal,
    DeleteAccountModal
  },
  props: {
    address: String
  },
  setup(p) {
    const {t} = useI18n();
    const toast = useToast();
    const router = useRouter();

    // get account details
    var acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address);
    const other_acc = walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
   
    if(!acc){
      if(other_acc)
      {
        acc = other_acc;
      }
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

    const editName = () => {
      showName.value = !showName.value;
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

    const showPasswordPanel = () => {
      showPwPK.value = !showPwPK.value;
    };

    const hidePanel = () => {
      accountName.value = acc.name;
      showName.value = !showName.value;
      err.value = "";
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
      showPasswordPanel,
      verifyWalletPwPk,
      walletPasswd,
      walletPasswdSwap,
      showPwSwap,
      showName,
      editName,
      changeName,
      accountName,
      acc,
      verifyWalletPwSwap,
      copy,
      privateKey,
      hidePanel,
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
