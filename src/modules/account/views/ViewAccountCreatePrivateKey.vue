<template>
  <div>
    <div class='border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg'>
      <div class='text-lg text-center font-bold mt-10'>Create New Account</div>
      <div class='text-blue-primary text-xs text-center font-bold'>From Private Key</div>
      <div class="error error_box mb-2 w-8/12 ml-auto mr-auto" v-if="err!=''">{{ err }}</div>
      <div class="w-8/12 ml-auto mr-auto mt-3">
        <PasswordInput :placeholder="$t('createprivatekeywallet.privatekey')" :errorMessage="$t('createprivatekeywallet.invalidprivatekey')" icon="key" :showError="showPkError" v-model="privKey"  />
        <TextInput class="mt-3" placeholder="Name your account" :errorMessage="$t('createwallet.inputwalletname')" v-model="accountName" icon="wallet" />
        <PasswordInput class="mt-3" placeholder="Enter Wallet Password" :errorMessage="$t('createwallet.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="walletPassword"  />
      </div>
      <div class="flex justify-center mt-3">
        <button type="submit" class="blue-btn py-2 px-8 disabled:opacity-50" @click='create()' :disabled="disableCreate">{{$t('welcome.create')}}</button>
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
import { WalletAccount } from "@/models/walletAccount"
import { Helper } from "@/util/typeHelper";
import { Account, Address, MosaicId, UInt64 } from "tsjs-xpx-chain-sdk";
import {useI18n} from 'vue-i18n'
import { Asset } from '@/models/asset';
import { Reconstruct } from '@/models/wallets';



export default {
  name: 'ViewAccountCreatePrivateKey',
  components: {
    TextInput,
    PasswordInput
  },
  setup(){
    const {t} = useI18n();
    const err = ref(false);
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
    const showPkError = computed(
      () => !privKey.value.match(privKeyPattern) && privKey.value!=""
    );

    const walletName = walletState.currentLoggedInWallet.name
    /* let recreateAsset = (tempAsset) =>{
        let newAsset = new Asset(tempAsset.idHex, tempAsset.divisibility, tempAsset.supplyMutable, tempAsset.transferable, tempAsset.owner);
        newAsset.amount = tempAsset.amount ? tempAsset.amount : 0;
        newAsset.duration = tempAsset.duration ? tempAsset.duration : null;
        newAsset.expirationBlock = tempAsset.expirationBlock ? tempAsset.expirationBlock : null;
        newAsset.namespaceId = tempAsset.namespaceId ? tempAsset.namespaceId : [];
        newAsset.owner = tempAsset.owner ? tempAsset.owner : null;
        newAsset.supply = tempAsset.supply ? tempAsset.supply : 0;

        return newAsset;
    } */
    const create = async() => {
    const verifyExistingAccountName = walletState.currentLoggedInWallet.accounts.find((element) => element.name == accountName.value);
      if(!verifyExistingAccountName) {
        var result = WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPassword.value);
        if (result == -1) {
          err.value = t('scriptvalues.createaccountfail');
        } else if (result == 0) {
          err.value = t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name}) ;
        } else {    
          // create account
          const account = Account.createFromPrivateKey(privKey.value,ChainUtils.getNetworkType(AppState.networkType));
          const verifyExistingAccount = walletState.currentLoggedInWallet.accounts.find((element) => element.publicKey == account.publicKey);
          if (verifyExistingAccount) {
            err.value = t('scriptvalues.privatekeyexists');
          } else {          
            let password = WalletUtils.createPassword(walletPassword.value);
            const wallet = WalletUtils.createAccountSimpleFromPrivateKey(accountName.value, password, privKey.value, ChainUtils.getNetworkType(AppState.networkType));
            let walletAccount = new WalletAccount(accountName.value, account.publicKey, account.address.plain(), "pass:bip32", wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
            // code for NIS 1 checking
            // if(nis1Swap.value == true){
            //   const Nis1 = WalletUtils.createNis1AccountWithPrivateKey(privKey.value);
            //   walletAccount.nis1Account = new nis1Account(Nis1.address, Nis1.publicKey);
            // }  
            
            walletState.currentLoggedInWallet.accounts.push(walletAccount);
            await WalletUtils.refreshAllAccountDetails(walletState.currentLoggedInWallet, networkState.currentNetworkProfile);
            walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet),
            
            router.push({ name: "ViewAccountDetails", params: {address: account.address.address, accountCreated: true }})
          }
        } 
      } else {
        err.value = t('scriptvalues.accountnametaken');
      }
    };
    return{
      showPkError,
      walletState,
      err,
      create,
      accountName,
      walletPassword,
      privKey,
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
