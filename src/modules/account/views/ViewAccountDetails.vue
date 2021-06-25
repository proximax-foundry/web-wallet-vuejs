<template>
<div class="flex justify-between text-sm">
  <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">Details</span></div>
  <div>
    <router-link :to="{name : 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">View All Accounts</router-link>
  </div>
</div>
<div class='mt-2 py-3 gray-line'>
  <div class="container mx-auto text-center">
    <div class="mx-auto pt-5 lg:px-20">
      <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-8 items-center">
        <div class="text-left w-full relative">
          <div class="text-xs font-bold mb-1">Account Name:</div>
          <div v-if="showName">{{ accountNameDisplay }}</div>
          <div v-else>
            <TextInput placeholder="Account Name" errorMessage="Account name is required" v-model="accountName" icon="wallet" />
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
          <div class="text-xs font-bold mb-1">Address:</div>
          <div id="address" class="text-sm w-full outline-none bg-gray-100 z-10" :copyValue="acc.pretty" copySubject="address">{{acc.pretty}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">Public Key:</div>
          <div id="public" class="text-sm w-full outline-none bg-gray-100 z-10" :copyValue="acc.publicKey" copySubject="public">{{acc.publicKey}}</div>
        </div>
        <font-awesome-icon icon="copy" @click="copy('public')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div v-if="acc.encrypted != undefined && acc.encrypted != ''">
        <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
          <div class="text-center w-full">
            <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block"></font-awesome-icon>
            </div>
            <p>Make sure you store your private key in a safe place.</p>
            <p>Access to your digital assets cannot be recovered without it.</p>
          </div>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="text-xs font-bold mr-2"><div class="mb-2 inline-block">Private Key:</div><div v-if="!showPwPK && !showPK">**************</div><PasswordInput v-if="showPwPK && !showPK" placeholder="Insert wallet password" errorMessage="Wallet password required." :showError="showPasswdError" icon="lock" v-model="walletPasswd" /></div>
            <div class="absolute z-20 w-full h-full" v-if="showPK"></div>
            <div id="private" class="text-sm w-full outline-none bg-gray-100 z-10" type="text" :copyValue="privateKey" copySubject="private" v-if="showPK">{{privateKey}}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block mr-2" v-if="showPK"></font-awesome-icon>
          <button class="default-btn w-36" @click="showPwPK = !showPwPK" v-if="!showPwPK && !showPK">Show</button>
          <button class="default-btn w-36" @click="verifyWalletPwPk()" v-if="showPwPK && !showPK">Submit</button>
          <button class="default-btn w-36" @click="showPwPK = false; showPK = false" v-if="showPK">Hide</button>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="text-sm font-bold mb-1">Swap with this private key</div>
            <PasswordInput v-if="showPwSwap" placeholder="Insert wallet password" errorMessage="Wallet password required." :showError="showPasswdError" icon="lock" v-model="walletPasswdSwap" />
          </div>
          <button class="default-btn w-36" @click="showPwSwap = !showPwSwap" v-if="!showPwSwap">Enable</button>
          <button class="default-btn w-36" @click="verifyWalletPwSwap()" v-if="showPwSwap">Submit</button>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="text-sm font-bold mb-1">Save Paper Wallet</div>
          </div>
          <button class="default-btn w-36">Save</button>
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
    const toast = useToast();
    const router = useRouter();

    // get account details
    const acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address);
    if (acc === -1) {
      router.push({name: "ViewAccountDisplayAll"});
    }
    acc.pretty = Helper.createAddress(acc.address).pretty();

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
    const showPwSwap = ref(false);
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
        const acc_index = walletState.currentLoggedInWallet.accounts.findIndex((accAdd) => accAdd.address === p.address);
        walletState.currentLoggedInWallet.accounts[acc_index].name = accountName.value;

        if (!exist_account) {
          walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
          showName.value = true;
          accountNameDisplay.value = accountName.value;
          err.value = "";
        } else if (exist_account) {
          err.value = "Account name is already taken";
        } else {
          err.value = "Fail to change account name";
        }
      } else {
        err.value = "Please insert account name";
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
        err.value = "Please insert wallet password to show Private Key";
        showPwSwap.value = false;
      } else {
        err.value = "";
      }
    };

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
      hidePanel
    };
  }
};
</script>
