<template>
<div>
  <div class='flex cursor-pointer'>
    <img src='@/assets/img/chevron_left.svg'>
    <router-link :to='{name:"ViewAccountCreateSelectType"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
  </div>
  <div class='border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg'>
    <div class='text-lg text-center font-bold mt-10'>{{$t('general.createNewAcc')}}</div>
    <div class="error error_box mb-2 w-8/12 ml-auto mr-auto" v-if="err!=''">{{ err }}</div>
    <div class="w-8/12 ml-auto mr-auto mt-3">
      <TextInput :placeholder="$t('account.namePlaceholder')" :errorMessage="$t('account.enterAccountName')" v-model="accountName" icon="wallet" />
      <PasswordInput class="mt-3" :placeholder="$t('general.enterPassword')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" icon="lock" v-model="walletPassword"  />
    </div>
    <div class="flex justify-center">
      <button type="submit" class="mt-3 blue-btn py-2 px-8 disabled:opacity-50" @click='create()' :disabled="disableCreate">{{$t('general.create')}}</button>
    </div>
    <div class='mt-10'></div>   
  </div>
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

    const walletName = walletState.currentLoggedInWallet.name
    const create = () => {
    const verifyExistingAccountName = walletState.currentLoggedInWallet.accounts.find((element) => element.name == accountName.value);
      if(!verifyExistingAccountName){
        var result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword.value);
        if (result == -1) {
          err.value = t('account.failCreate');
        } else if (result == 0) {
          err.value = t('general.walletPasswordInvalid',{name : walletName});
        } else { 
          // create account
          let password = WalletUtils.createPassword(walletPassword.value);
          const account = WalletUtils.generateNewAccount(ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
          const wallet = WalletUtils.createAccountSimpleFromPrivateKey(accountName.value, password, account.privateKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
          let walletAccount = new WalletAccount(accountName.value, account.publicKey, account.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
          walletState.currentLoggedInWallet.accounts.push(walletAccount);
          walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
          router.push({ name: "ViewAccountDetails", params: {address: account.address.address,accountCreated: true}});

        }
      }else{
        err.value =  t('account.nameTaken');
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
