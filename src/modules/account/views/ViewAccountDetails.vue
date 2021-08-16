<template>
<div class="flex justify-between text-xs sm:text-sm">
  <div><span class="text-gray-400">{{$t('NavigationMenu.Accounts')}} ></span> <span class="text-blue-primary font-bold">{{$t('accounts.details')}}</span></div>
  <div>
    <router-link :to="{name : 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">{{$t('accounts.viewall')}}</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">{{$t('accounts.name')}}:</div>
          <div v-if="showName">{{ accountNameDisplay }}</div>
          <div v-else>
            <TextInput :placeholder="$t('swap.accountname')" :errorMessage="$t('accounts.namevalidation')" v-model="accountName" icon="wallet" />
          </div>
        </div>
        <div class="inline-block ml-2">
          <font-awesome-icon icon="edit" @click="editName()" class="w-5 h-5 text-gray-500 cursor-pointer inline-block" v-if="showName"></font-awesome-icon>
          <div v-else>
            <font-awesome-icon icon="check-circle" @click="changeName()" class="w-5 h-5 text-gray-500 cursor-pointer inline-block mb-1"></font-awesome-icon>
            <font-awesome-icon @click="hidePanel()" icon="times-circle" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
          </div>
        </div>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">{{$t('createsuccessful.address')}}:</div>
          <div id="address" class="text-sm w-full outline-none bg-gray-100 z-10" :copyValue="prettyAddress" copySubject="Address">{{prettyAddress}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">{{$t('accounts.publickey')}}:</div>
          <div id="public" class="text-sm w-full outline-none bg-gray-100 z-10" :copyValue="acc.publicKey" copySubject="Public Key">{{acc.publicKey}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('public')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div v-if="acc.encrypted != undefined && acc.encrypted != ''">
        <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
          <div class="text-center w-full">
            <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block mt-1"></font-awesome-icon>
            </div>
            <p>{{$t('createsuccessful.warningtext1')}}</p>
            <p>{{$t('createsuccessful.warningtext2')}}</p>
          </div>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="text-xs font-bold mr-2"><div class="mb-2 inline-block">{{$t('createprivatekeywallet.privatekey')}}:</div><div v-if="!showPwPK && !showPK">**************</div><PasswordInput v-if="showPwPK && !showPK" :placeholder="$t('accounts.inputpassword')" :errorMessage="$t('accounts.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="walletPasswd" /></div>
            <div class="absolute z-20 w-full h-full" v-if="showPK"></div>
            <div id="private" class="text-sm w-full outline-none bg-gray-100 z-10" type="text" :copyValue="privateKey" copySubject="Private Key" v-if="showPK">{{privateKey}}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block mr-2" v-if="showPK"></font-awesome-icon>
          <button class="default-btn w-36" @click="showPwPK = !showPwPK" v-if="!showPwPK && !showPK">{{$t('createsuccessful.show')}}</button>
          <button class="default-btn w-36" @click="verifyWalletPwPk()" v-if="showPwPK && !showPK">{{$t('accounts.submit')}}</button>
          <button class="default-btn w-36" @click="showPwPK = false; showPK = false" v-if="showPK">{{$t('createsuccessful.hide')}}</button>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="text-xs font-bold mr-2">
              <div class="text-sm font-bold mb-1">{{$t('accounts.swap')}}</div>
              <PasswordInput v-if="showPwSwap" :placeholder="$t('accounts.inputpassword')" :errorMessage="$t('accounts.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="walletPasswdSwap" />
            </div>
          </div>
          <button class="default-btn w-36" @click="showPwSwap = !showPwSwap" v-if="!showPwSwap">{{$t('accounts.enable')}}</button>
          <button class="default-btn w-36" @click="verifyWalletPwSwap()" v-if="showPwSwap">{{$t('accounts.submit')}}</button>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="text-xs font-bold mr-2">
              <div class="text-sm font-bold mb-1">{{$t('createsuccessful.savewalletpaper')}}</div>
              <PasswordInput v-if="showWalletPaperPw && !showSavePaperWallet" :placeholder="$t('accounts.inputpassword')" :errorMessage="$t('accounts.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="walletPasswdWalletPaper" />
            </div>
          </div>
          <button class="default-btn w-36" @click="showWalletPaperPw = !showWalletPaperPw" v-if="!showWalletPaperPw">{{$t('accounts.save')}}</button>
          <button class="default-btn w-36" @click="verifyWalletPwWalletPaper()" v-if="showWalletPaperPw && !showSavePaperWallet">{{$t('accounts.submit')}}</button>
          <button class="default-btn w-36" @click="saveWalletPaper()" v-if="showSavePaperWallet">{{$t('accounts.save')}}</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {ref, computed} from "vue";
import {useRouter} from "vue-router";
import TextInput from "@/components/TextInput.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import {copyToClipboard } from '@/util/functions';
import {useToast} from "primevue/usetoast";
import {walletState} from "@/state/walletState";
import {Helper} from "@/util/typeHelper";
import {networkState} from "@/state/networkState";
import {WalletUtils} from "@/util/walletUtils";
import {useI18n} from 'vue-i18n';
import { pdfWalletPaperImg } from '@/modules/account/pdfPaperWalletBackground';
import jsPDF from 'jspdf';
import qrcode from 'qrcode-generator';

export default {
  name: "ViewAccountDetails",
  components: {
    TextInput,
    PasswordInput
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

    if (acc === -1) {
      router.push({name: "ViewAccountDisplayAll"});
    }
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

    const saveWalletPaper = () => {
      const doc = new jsPDF({
        unit: 'px'
      });
      doc.addImage(pdfWalletPaperImg, 'JPEG', 120, 60, 205, 132);

      // QR Code Address
      const passwordInstance = WalletUtils.createPassword(walletPasswdWalletPaper.value);
      const walletPrivateKey = WalletUtils.decryptPrivateKey(passwordInstance,acc.encrypted,acc.iv);
      let privateKey = walletPrivateKey.toUpperCase();
      doc.addImage(generateQR(privateKey, 1, 0), 151.5, 105);

      // Addres number
      doc.setFontSize(8);
      doc.setTextColor('#000000');
      doc.text(prettyAddress, 146, 164, { maxWidth: 132 });
      doc.save('Your_Paper_Wallet');
    }

    return {
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
