<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Accounts ></span> <span class="text-blue-primary font-bold">Create Account</span></div>
    <div>
      <router-link :to="{name: 'SelectTypeCreateAccount'}" class="font-bold">Back</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <TextInput placeholder="Account Name" errorMessage="Account name is required" v-model="accountName" icon="wallet" />
        <PasswordInput placeholder="Enter Your Wallet Password" :errorMessage="'Please enter your wallet ' + appStore.state.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">Create</button>
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
    const accountName = ref("");
    const walletPassword = ref("");
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const router = useRouter();
    const disableCreate = computed(
      () => !(
        walletPassword.value.match(passwdPattern) &&
        accountName.value.length != ''
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
        const networkType = appStore.getAccountByWallet(appStore.state.currentLoggedInWallet.name).network;
        const account = siriusStore.createNewAccount(appStore.state.currentLoggedInWallet.name, networkType);
        // update to state
        appStore.updateAccountState(account, networkType, accountName.value);
        router.push({ name: "createdAccount", params: {publicKey: account.publicKey, privateKey: account.privateKey, address: appStore.pretty(account.address.address), name: accountName.value }});
      }
    };
    return{
      appStore,
      err,
      create,
      accountName,
      walletPassword,
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
