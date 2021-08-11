<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('NavigationMenu.Accounts')}} ></span> <span class="text-blue-primary font-bold">{{$t('delegate.delegate')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">{{$t('accounts.viewall')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>    
    <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3">
    <div class="text-center w-full">
        <p v-cloak class="text-sm" v-if="verifyDelegateAcc() && !delegateAcc==''">{{$t('delegate.linkmessage2')}}</p>
        <p v-cloak class="text-sm" v-else>{{$t('delegate.linkwarning')}}</p>
    </div>
    </div>
    <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-7 items-center">
      <div class="text-left w-full relative">
        <div v-cloak v-if="verifyDelegateAcc() && !delegateAcc==''" class="text-xs font-bold mb-1">{{$t('delegate.delegatepublic')}}</div>
        <div v-cloak v-else class="text-xs font-bold mb-1">{{$t('delegate.linkingaccount')}}</div>
        <div v-cloak v-if="verifyDelegateAcc() && !delegateAcc==''" id="delegatePublicKey" :copyValue="delegateAcc" copySubject="Delegate Public Key" class="text-xs w-full outline-none bg-gray-100 z-10" >{{delegateAcc}}</div>
        <div v-else-if="newAcc != ''">{{$t('delegate.newaccount')}}</div>
        <div v-else-if="newAccPK != ''">{{$t('createwallet.fromprivatekey')}}</div>
        <div v-else>{{$t('delegate.noneselected')}}</div>
      </div>
      <font-awesome-icon icon="copy" @click="copy('delegatePublicKey')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block mr-2" v-if="verifyDelegateAcc() && !delegateAcc==''"></font-awesome-icon>
      <div v-cloak v-else class="inline-block ml-2">
        <SelectAccountTypeModal />
      </div>
    </div>
    <PasswordInput :placeholder="$t('signin.enterpassword')" :errorMessage="$t('scriptvalues.enterpassword',{name: walletName })" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
    <div class="mt-10">
      <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="verifyWalletPw" v-if="verifyDelegateAcc() && !delegateAcc==''" :disabled="disableLinkBtn">{{$t('delegate.unlinkaccount')}}</button>
      <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="verifyWalletPw" v-else :disabled="disableLinkBtn">{{$t('delegate.linkaccount')}}</button>
    </div>
  </div>
</template>
<script>

import { ref, computed, getCurrentInstance } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectAccountTypeModal from '@/modules/account/submodule/delegate/components/SelectAccountTypeModal.vue';
import { walletState } from '@/state/walletState';
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { ChainUtils } from "@/util/chainUtils"
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { BuildTransactions } from '@/util/buildTransactions';
import { Account, LinkAction, TransactionHttp} from "tsjs-xpx-chain-sdk";
import {useI18n} from 'vue-i18n'
export default {
  name: 'ViewAccountDelegate',
  components: {
    PasswordInput,
    SelectAccountTypeModal,
  },
  props: [
    'address'
  ],
 
  setup(p) {
    const {t} = useI18n();
    const walletPassword = ref('');
    const showPasswdError = ref(false);
    const err = ref(false);
    const newAcc = ref('');
    const newAccPK = ref('');
    const delegateAcc = ref('');
    const AccPublicKey = ref('');
    const AccPrivateKey = ref('')
    const router = useRouter();
    const toast = useToast();
    const address = ref(p.address);
    const passwdPattern = "^[^ ]{8,}$";
    const internalInstance = getCurrentInstance();
    const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
    const networkType = networkState.currentNetworkProfile.network.type;
    const hash = networkState.currentNetworkProfile.generationHash;    
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const disableLinkBtn = computed(
      () => !(
        walletPassword.value.match(passwdPattern)
      )
    );
    const walletName = walletState.currentLoggedInWallet.name
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    const verifyDelegateAcc = async() => {

      const accountDetail = walletState.currentLoggedInWallet.accounts.find(element => element.address == address.value);
      if (accountDetail) {
        const publicAccount = Helper.createPublicAccount(accountDetail.publicKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type)); 
        const accountInfo = await chainAPICall.accountAPI.getAccountInfo(publicAccount.address);
        console.log(accountInfo)
        const indexOtherAcc = walletState.currentLoggedInWallet.others.findIndex((other)=> other.publicKey === accountInfo.linkedAccountKey);
        if (indexOtherAcc > -1) {
          delegateAcc.value = walletState.currentLoggedInWallet.others[indexOtherAcc].publicKey; 
        } else {
          delegateAcc.value = "";
        }
      } else if(!accountDetail) {
        delegateAcc.value = "";
      }
    };
    const createTransaction = (accPublicKey, delegateAction) =>{
      const accountDetail = walletState.currentLoggedInWallet.accounts.find(element => element.address == address.value);
      const transactionBuilder = new BuildTransactions(networkType, hash);
      const passwordInstance = WalletUtils.createPassword(walletPassword.value);
      const privateKey = WalletUtils.decryptPrivateKey(passwordInstance, accountDetail.encrypted, accountDetail.iv)
      const accountPrivateKey = Account.createFromPrivateKey(privateKey, networkType);
      const transferTransaction = transactionBuilder.accountLink(accPublicKey, delegateAction);              
      const signedTransaction = accountPrivateKey.sign(transferTransaction, hash);
      const transactionHttp = new TransactionHttp(NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint));
      transactionHttp
        .announce(signedTransaction)
        .subscribe(() => {
          return true;
      }, err => console.error(err));  
    };

    const verifyWalletPw = () => {
      if (!walletPassword.value == "") {
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)) {
          if (!delegateAcc.value == "") {
            const indexOtherAcc = walletState.currentLoggedInWallet.others.findIndex((other)=> other.publicKey === delegateAcc.value)
            if (indexOtherAcc > -1) {
              createTransaction(delegateAcc.value, LinkAction.Unlink);
              WalletUtils.confirmedTransactionRefresh(walletState.currentLoggedInWallet, networkState.currentNetworkProfile.network.currency.assetId);
              err.value = "";
              walletPassword.value = "";

              toast.add({severity:'success', summary: 'Notification', detail: 'Unlink Successfully', group: 'br', life: 5000});            
              router.push({ name: "ViewAccountDisplayAll" });
            } else {
              err.value = t('delegate.linkerror2');
            }
          } else if (!AccPublicKey.value == "" && !AccPrivateKey.value =="") {
              createTransaction(AccPublicKey.value, LinkAction.Link);

              router.push({ name: "ViewAccountCreated", params: { name: '' ,publicKey: AccPublicKey.value, privateKey: AccPrivateKey.value }});
            } else {
              err.value = t('delegate.linkerror2')
          }
        } else {
          err.value = t('scriptvalues.walletpasswordvalidation',{name : walletState.currentLoggedInWallet.name});
        }
      }
    };
    
    emitter.on('NEW ACCOUNT', newAccPublicKey => {
      if(newAccPublicKey){
        AccPublicKey.value = newAccPublicKey.publicKey;
        AccPrivateKey.value = newAccPublicKey.privateKey;
        newAcc.value = "true";
      }
    })

    emitter.on('FROM PRIVATE KEY', existingPublicKey => {
      if(existingPublicKey){
        AccPublicKey.value = existingPublicKey.publicKey;
        AccPrivateKey.value = existingPublicKey.privateKey;
        newAccPK.value = "true";
      }
    })

    return {
      walletPassword,
      showPasswdError,
      walletState,
      verifyWalletPw,
      verifyDelegateAcc,
      delegateAcc,
      newAccPK,
      newAcc,
      AccPublicKey,
      AccPrivateKey,
      disableLinkBtn,
      copy,
      err,
      walletName
    };
  },
}
</script>
<style> 
    [v-cloak] {
        display: none;
    }
</style>