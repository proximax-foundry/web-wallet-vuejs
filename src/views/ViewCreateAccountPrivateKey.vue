<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Accounts ></span> <span class="text-blue-primary font-bold">Import Account</span></div>
    <div>
      <router-link to="/select-type-creation-account" class="font-bold">Back</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <PasswordInput placeholder="Enter Private Key" errorMessage="Invalid private key" icon="key" v-model="privKey" class="ml-1" />
        <label class="inline-flex items-center mb-5">
            <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="nis1Swap">
          <span class="ml-2 cursor-pointer">Check this box if you wish to swap with this private key.</span>
        </label>
        <TextInput placeholder="Account Name" errorMessage="Account name is required" v-model="accountName" icon="wallet" />
        <PasswordInput placeholder="Enter Your Wallet Password" :errorMessage="'Please enter your wallet ' + appStore.state.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">Import</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
import { computed, inject, ref } from 'vue';
import { useRouter } from "vue-router";
import TextInput from '@/components/TextInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'

export default {
  name: 'ViewCreateAccount',
  components: {
    TextInput,
    PasswordInput
  },
  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const err = ref(false);
    const nis1Swap = ref(false);
    const privKey = ref("");
    const accountName = ref("");
    const walletPassword = ref("");
    const showPasswdError = ref(false);
    const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$";
    const passwdPattern = "^[^ ]{8,}$";
    const router = useRouter();
    const disableCreate = computed(
      () => !(
        walletPassword.value.match(passwdPattern) &&
        accountName.value.length != '' &&
        privKey.value.match(privKeyPattern)
      )
    );
    const create = () => {
      // if (disableLogin.value) {
      //   err.value = "Please enter a valid password";
      //   loading.value = false;
      //   return;
      // }

      var result = appStore.verifyWalletPassword(appStore.state.currentLoggedInWallet.name, walletPassword.value);
      if (result == -1) {
        err.value = "Fail to create new account";
      } else if (result == 0) {
        err.value = "Password for wallet <b>" + appStore.state.currentLoggedInWallet.name + "</b> is invalid" ;
      } else {
        // create account
        const acc = siriusStore.createNewAccountPrivateKey(privKey.value, appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network);
        router.push({ name: "createdAccount", params: {publicKey: acc.publicAccount.publicKey, privateKey: acc.private, address: appStore.pretty(acc.address), name: accountName.value }});
      }
    };
    return{
      appStore,
      err,
      create,
      accountName,
      walletPassword,
      privKey,
      nis1Swap,
      showPasswdError,
      disableCreate
    }
  },
  methods: {
    clearInput: function() {
      this.accountName = "";
      this.walletPassword = "";
    },
  },
}
</script>
