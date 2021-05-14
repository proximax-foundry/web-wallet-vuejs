<template>
  <div class="container mx-auto text-center">
    <form
      v-if="!newWallet"
      @submit.prevent="createWallet"
    >
      <h1 class="font-bold big-title">Create Wallet</h1>
      <div class="mx-auto page-title-gray-line pt-15">
        <p>Restore your existing ProximaX Sirius Wallet, import a private key from another service or create a new wallet right now!</p>
        <div class="w-10/12 lg:w-8/12 self-center inline-block">
          <div class="error error_box" v-if="err!=''">{{ err }}</div>
          <div class="text-left text-tsm my-4 ml-4 text-gray-600"><b>Network</b>: {{ selectedNetworkName }}</div>
          <PasswordInput placeholder="Private Key" errorMessage="Invalid private key" icon="key" v-model="privKey" class="ml-1" />
          <label class="inline-flex items-center mb-5">
              <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="nis1Swap">
            <span class="ml-2 cursor-pointer">Check this box if you wish to swap with this private key.</span>
          </label>
          <TextInput placeholder="Wallet Name" errorMessage="Insert wallet name" v-model="walletName" icon="wallet" />
          <div class="grid xs:grid-cols-1 md:grid-cols-2">
            <PasswordInput placeholder="Enter a New Password" errorMessage="Min. length 8, max. length 30." :showError="showPasswdError" icon="lock" v-model="passwd" class="mr-1" />
            <PasswordInput placeholder="Confirm New Password" errorMessage="Password doesn't match." :showError="showConfirmPasswdError" icon="lock" v-model="confirmPasswd" class="ml-1" />
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5" @click="clearInput();">Clear</button>
            <button type="submit" class="default-btn disabled:opacity-50" :disabled="disableCreate">Create</button>
          </div>
        </div>
      </div>
    </form>
    <div v-else>
      <h1 class="font-bold big-title">Congratulations!</h1>
      <p class="mt-2">Your wallet has been successfully created</p>
      <div class="mx-auto page-title-gray-line pt-5 lg:px-20">
        <div class="text-xl mb-5">{{ newWallet.name }}</div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">Address:</div>
            <input
              id="address"
              class="text-sm w-full outline-none bg-gray-100 z-10"
              type="text"
              :value="newWallet.accounts[0].address"
            />
          </div>
          <font-awesome-icon icon="copy" @click="copy('address')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">Public:</div>
            <input
              id="public"
              class="text-sm w-full outline-none bg-gray-100 z-10"
              type="text"
              :value="newWallet.accounts[0].publicAccount.publicKey"
            />
          </div>
          <font-awesome-icon icon="copy" @click="copy('public')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center" v-if="showPK">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">Private:</div>
            <input
              id="private"
              class="text-sm w-full outline-none bg-gray-100 z-10"
              type="text"
              :value="privateKey"
            />
          </div>
          <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
          <div class="text-center w-full">
            <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block"></font-awesome-icon>
            </div>
            <p>Make sure you store your private key in a safe place.</p>
            <p>Access to your digital assets cannot be recovered without it.</p>
          </div>
        </div>
        <div class="inline-block mt-10 w-full">
          <div class="grid xs:grid-cols-1 md:grid-cols-3">
            <div class="px-5 self-center">
              <a href="#" class="block big-default-btn my-3 self-center w-full" @click="showPK = !showPK">{{ showPK?'Hide':'Show' }} Private Key</a>
            </div>
            <div class="px-5">
              <a href="#" class="block big-default-btn my-3 self-center w-full">Save Paper Wallet</a>
            </div>
            <div class="px-5 self-center"><router-link to="/" class="block big-default-btn my-3 self-center">Continue</router-link></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, getCurrentInstance } from 'vue';
import FontAwesomeIcon from '../../libs/FontAwesomeIcon.vue';
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { copyKeyFunc } from '../util/functions.js';

export default {
  name: 'ViewCreateNewWallet',
  components: {
    FontAwesomeIcon,
    TextInput,
    PasswordInput
  },
  data() {
    return {
      showPK: false,
    };
  },

  setup(){
    const internalInstance = getCurrentInstance();
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const chainNetwork = inject("chainNetwork");
    const selectedNetwork = computed(()=> chainNetwork.getNetworkType());
    const selectedNetworkName = computed(()=> siriusStore.state.chainNetworkName );
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const err = ref("");
    const newWallet = ref("");
    // const selectedNetwork = ref("168");
    // const networks = ref(siriusStore.state.network);
    const walletName = ref("");
    const passwd = ref("");
    const privateKey = ref("");
    const confirmPasswd = ref("");
    const nis1Swap = ref(false);
    const privKey = ref("");
    const showPasswdError = ref(false);
    const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$";
    const passwdPattern = "^[^ ]{8,}$";
    const copy = (id) => copyKeyFunc(id);
    const disableCreate = computed(
      () => !(
        walletName.value !== "" &&
          passwd.value.match(passwdPattern) &&
          confirmPasswd.value === passwd.value &&
          privKey.value.match(privKeyPattern)
      )
    );

    // true to show error
    const showConfirmPasswdError = computed(
      () => (confirmPasswd.value != passwd.value && confirmPasswd.value != '')
    );

    const createWallet = async () => {
      // loading.value = true;
      err.value = "";
      let result = 0;

      result = appStore.addNewWallet(
        siriusStore.state.chainNetworkName,
        walletName.value,
        passwd.value,
        selectedNetwork.value,
        privKey.value
      );
      if (result === -1) {
        err.value = "Wallet name is already taken";
      } else if (result === 0) {
        err.value =
          "Unable to create wallet. Your device storage might be full";
      } else {
        privateKey.value = result;
        newWallet.value =
          appStore.state.wallets[appStore.state.wallets.length - 1];
      }

      // loading.value = false;
    };

    const clearInput = () => {
      walletName.value = '';
      passwd.value = "";
      confirmPasswd.value = "";
      privKey.value = "";
      nis1Swap.value = false;
      emitter.emit("CLEAR_SELECT", 0);
      emitter.emit("CLEAR_TEXT", "");
      emitter.emit("CLEAR_PASSWORD", "");
    };

    return {
      err,
      newWallet,
      selectedNetwork,
      selectedNetworkName,
      // networks,
      walletName,
      passwd,
      confirmPasswd,
      nis1Swap,
      privKey,
      privateKey,
      showPasswdError,
      showConfirmPasswdError,
      passwdPattern,
      privKeyPattern,
      createWallet,
      disableCreate,
      clearInput,
      copy
    };
  },
}
</script>
