<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Accounts ></span> <span class="text-blue-primary font-bold">Import Account</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountCreateSelectType'}" class="font-bold">Back</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box mb-2" v-if="err!=''">{{ err }}</div>
        <PasswordInput placeholder="Enter Private Key" errorMessage="Invalid private key" icon="key" v-model="privKey" class="ml-1" />
        <label class="inline-flex items-center mb-5">
            <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="nis1Swap">
          <span class="ml-2 cursor-pointer">Check this box if you wish to swap with this private key.</span>
        </label>
        <TextInput placeholder="Account Name" errorMessage="Account name is required" v-model="accountName" icon="wallet" />
        <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter your wallet ' + walletState.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">Import</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { useRouter } from "vue-router";
import TextInput from '@/components/TextInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { WalletUtils } from '@/util/walletUtils';
import { ChainUtils } from '@/util/chainUtils';
import { WalletAccount } from "@/models/walletAccount"
import { Helper } from "@/util/typeHelper";
import { Account } from "tsjs-xpx-chain-sdk";
import { nis1Account } from '@/models/nis1Account';

export default {
  name: 'ViewAccountCreatePrivateKey',
  components: {
    TextInput,
    PasswordInput
  },
  setup(){
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
    const verifyExistingAccountName = walletState.currentLoggedInWallet.accounts.find((element) => element.name == accountName.value);
      if(!verifyExistingAccountName) {
        var result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword.value);
        if (result == -1) {
          err.value = "Fail to create new account";
        } else if (result == 0) {
          err.value = "Password for wallet " + walletState.currentLoggedInWallet.name + " is invalid" ;
        } else {    
          // create account
          const pubkey = Account.createFromPrivateKey(privKey.value,ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
          const verifyExistingAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.publicKey == pubkey.publicKey);
          if (verifyExistingAccount) {
            err.value = "Account with this Private Key is already in the wallet";
          } else {          
            let password = WalletUtils.createPassword(walletPassword.value);
            const account = WalletUtils.generateNewAccount(ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
            const wallet = WalletUtils.createAccountSimpleFromPrivateKey(accountName.value, password, privKey.value, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
            let walletAccount = new WalletAccount(accountName.value, account.publicKey, wallet.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
            if(nis1Swap.value == true){
              const Nis1 = WalletUtils.createNis1AccountWithPrivateKey(privKey.value);
              walletAccount.nis1Account = new nis1Account(Nis1.address, Nis1.publicKey);
            } 
            walletState.currentLoggedInWallet.accounts.push(walletAccount);
            walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
            router.push({ name: "ViewAccountCreated", params: {publicKey: account.publicKey, privateKey: account.privateKey, address: account.address, name: accountName.value }});
          }
        } 
      } else {
        err.value = "Account name is already taken.";
      }
    };
    return{
      walletState,
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
      this.privKey = "";
    },
  },
}
</script>
