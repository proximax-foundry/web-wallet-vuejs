<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">{{$t('NavigationMenu.Accounts')}} ></span> <span class="text-blue-primary font-bold">{{$t('accounts.createaccount')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountCreateSelectType'}" class="font-bold">{{$t('accounts.back')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <form @submit.prevent="create" class="mt-10">
      <fieldset class="w-full">
        <div class="error error_box mb-2" v-if="err!=''">{{ err }}</div>
        <TextInput :placeholder="$t('accounts.name')" :errorMessage="$t('accounts.namevalidation')" v-model="accountName" icon="wallet" />
        <PasswordInput :placeholder="$t('signin.enterpassword')" :errorMessage="$t('scriptvalues.enterpassword',{name: walletName })" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        <div class="mt-10">
          <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">{{$t('signin.clear')}}</button>
          <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableCreate">{{$t('welcome.create')}}</button>
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
import { Helper } from '@/util/typeHelper';
import { WalletAccount } from "@/models/walletAccount"
import {useI18n} from 'vue-i18n'

export default {
  name: 'ViewAccountCreate',
  components: {
    TextInput,
    PasswordInput
  },
  setup(){
    const {t} = useI18n();
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
    const walletName = computed(()=>walletState.currentLoggedInWallet.name)
    const create = () => {
    const verifyExistingAccountName = walletState.currentLoggedInWallet.accounts.find((element) => element.name == accountName.value);
      if(!verifyExistingAccountName){
        var result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword.value);
        if (result == -1) {
          err.value = t('scriptvalues.createaccountfail');
        } else if (result == 0) {
          err.value = t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name});
        } else { 
          // create account
          let password = WalletUtils.createPassword(walletPassword.value);
          const account = WalletUtils.generateNewAccount(ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
          const wallet = WalletUtils.createAccountSimpleFromPrivateKey(accountName.value, password, account.privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
          let walletAccount = new WalletAccount(accountName.value, account.publicKey, wallet.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
          walletState.currentLoggedInWallet.accounts.push(walletAccount);

          const address = Helper.createAddress(account.address.address).pretty();
          walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);

          router.push({ name: "ViewAccountCreated", params: {publicKey: account.publicKey, privateKey: account.privateKey, address: address, name: accountName.value }});

        }
      }else{
        err.value =  t('scriptvalues.accountnametaken');
        console.log(verifyExistingAccountName);
      }
    };

    const clearInput = () => {
      accountName.value = "";
      walletPassword.value = "";
    };

    return{
      walletState,
      err,
      create,
      accountName,
      walletPassword,
      showPasswdError,
      disableCreate,
      clearInput,
      walletName
    }
  },

}
</script>
