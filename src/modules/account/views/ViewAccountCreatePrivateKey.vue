<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">{{$t('NavigationMenu.Accounts')}} ></span> <span class="text-blue-primary font-bold">{{$t('accounts.importaccount')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountCreateSelectType'}" class="font-bold">{{$t('accounts.back')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box mb-2" v-if="err!=''">{{ err }}</div>
        <PasswordInput :placeholder="$t('createprivatekeywallet.privatekey')" :errorMessage="$t('createprivatekeywallet.invalidprivatekey')" icon="key" v-model="privKey" class="ml-1" />
        <label class="inline-flex items-center mb-5">
            <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="nis1Swap">
          <span class="ml-2 cursor-pointer">{{$t('createprivatekeywallet.swaptitle')}}</span>
        </label>
        <TextInput :placeholder="$t('swap.accountname')" :errorMessage="$t('accounts.namevalidation')" v-model="accountName" icon="wallet" />
        <PasswordInput :placeholder="$t('signin.enterpassword')" :errorMessage="$t('scriptvalues.enterpassword',{name: walletName })" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">{{$t('signin.clear')}}</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">{{$t('createwallet.import')}}</button>
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
import {useI18n} from 'vue-i18n'

export default {
  name: 'ViewAccountCreatePrivateKey',
  components: {
    TextInput,
    PasswordInput
  },
  setup(){
    const {t} = useI18n();
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
    const walletName = walletState.currentLoggedInWallet.name
    const create = () => {
    const verifyExistingAccountName = walletState.currentLoggedInWallet.accounts.find((element) => element.name == accountName.value);
      if(!verifyExistingAccountName) {
        var result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword.value);
        if (result == -1) {
          err.value = t('scriptvalues.createaccountfail');
        } else if (result == 0) {
          err.value = t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name}) ;
        } else {    
          // create account
          const account = Account.createFromPrivateKey(privKey.value,ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
          const verifyExistingAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.publicKey == account.publicKey);
          if (verifyExistingAccount) {
            err.value = t('scriptvalues.privatekeyexists');
          } else {          
            let password = WalletUtils.createPassword(walletPassword.value);
            const wallet = WalletUtils.createAccountSimpleFromPrivateKey(accountName.value, password, privKey.value, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
            let walletAccount = new WalletAccount(accountName.value, account.publicKey, wallet.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
            if(nis1Swap.value == true){
              const Nis1 = WalletUtils.createNis1AccountWithPrivateKey(privKey.value);
              walletAccount.nis1Account = new nis1Account(Nis1.address, Nis1.publicKey);
            } 
            walletState.currentLoggedInWallet.accounts.push(walletAccount);
            walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
            router.push({ name: "ViewAccountCreated", params: {publicKey: account.publicKey, privateKey: privKey.value, address: wallet.address.plain(), name: accountName.value }});
          }
        } 
      } else {
        err.value = $t('scriptvalues.accountnametaken');
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
      disableCreate,
      walletName
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
