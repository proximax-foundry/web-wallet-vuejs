<template>
<div class="flex justify-between text-sm">
  <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">Details</span></div>
  <div>
    <router-link :to="{name : 'ViewDisplayAllAccounts'}" class="font-bold" active-class="accounts">View All Accounts</router-link>
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
          <input
            id="address"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            type="text"
            :value="acc.pretty"
          />
        </div>
        <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
      </div>
      <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
        <div class="text-left w-full relative">
          <div class="absolute z-20 w-full h-full"></div>
          <div class="text-xs font-bold mb-1">Public Key:</div>
          <input
            id="public"
            class="text-sm w-full outline-none bg-gray-100 z-10"
            type="text"
            :value="acc.publicAccount.publicKey"
          />
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
            <input
              id="private"
              class="text-sm w-full outline-none bg-gray-100 z-10"
              type="text"
              :value="privateKey"
              v-if="showPK"
            />
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
import { ref, inject } from 'vue';
import { useRouter } from "vue-router";
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { copyKeyFunc } from '../util/functions.js';

export default {
  name: 'ViewAccountDetails',
  components: {
    FontAwesomeIcon, TextInput, PasswordInput
  },
  props: {
    address: String,
  },

  setup(p){
    const appStore = inject("appStore");
    const router = useRouter();

    // get account details
    const acc = appStore.getAccDetailsByAddress(p.address);
    console.log(acc)
    if(acc === -1){
      router.push({ name: "ViewDisplayAllAccounts"});
    }
    acc.pretty = appStore.pretty(acc.address);

    const err = ref(false);
    const accountName = ref(acc.name);
    const accountNameDisplay = ref(acc.name);
    const showName = ref(true);
    const showPwPK = ref(false);
    const showPK = ref(false);
    const privateKey = ref('');
    const showPasswdError = ref(false);
    const walletPasswd = ref("");
    const walletPasswdSwap = ref("");
    const showPwSwap = ref(false);
    const copy = (id) => copyKeyFunc(id);

    const editName = () => {
      showName.value = !showName.value;
    };

    const changeName = () => {
      if(accountName.value.trim()){
        let status = appStore.updateAccountName(accountName.value, acc.address);
        console.log(status);
        if(status==1){
          showName.value = true;
          accountNameDisplay.value = accountName.value;
          err.value = '';
        }else if(status==2){
          err.value = "Account name is already taken";
        }else{
          err.value = "Fail to change account name";
        }
      }else{
        err.value = "Please insert account name";
      }
    };

    const showPasswordPanel = () => {
      showPwPK.value = !showPwPK.value;
    };

    const hidePanel = () => {
      accountName.value = acc.name;
      showName.value = !showName.value;
      err.value = '';
    }

    const verifyWalletPwPk = () => {
      if(walletPasswd.value == ''){
        err.value = "Please insert wallet password to show Private Key";
        showPK.value = false;
        showPwPK.value = false;
      }else{
        if(appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPasswd.value)){
          // pw is correct
          privateKey.value = appStore.getAccountPassword(acc.name, walletPasswd.value);
          showPK.value = true;
          err.value = '';
        }else{
          showPK.value = false;
          err.value = "Wallet password is incorrect";
        }
      }
    }

    const verifyWalletPwSwap = () => {
      if(walletPasswdSwap.value == ''){
        err.value = "Please insert wallet password to show Private Key";
        showPwSwap.value = false;
      }else{
        err.value="";
      }
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
    };
  },
}
</script>