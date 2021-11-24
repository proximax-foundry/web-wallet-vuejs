<template>
  <div class="flex justify-between text-xs sm:text-sm" v-cloak>
    <div><span class="text-gray-400">{{$t('NavigationMenu.Accounts')}} ></span> <span class="text-blue-primary font-bold">{{$t('delegate.delegate')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">{{$t('accounts.viewall')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>    
    <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3" >
      <div class="text-center w-full" >
          <p class="text-sm" v-if="delegateValue == true">{{$t('delegate.linkmessage2')}}</p>
      <!-- </div>
    </div> -->
    <!-- <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3" v-if="delegateValue == false">
      <div class="text-center w-full" > -->
          <p v-cloak class="text-sm" v-if="delegateValue == false">{{$t('delegate.linkwarning')}}</p>
      </div>
    </div>
    <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-7 items-center">
      <div class="text-left w-full relative">
        <div v-if="delegateValue" class="text-xs font-bold mb-1">{{$t('delegate.delegatepublic')}}</div>
        <div v-if="delegateValue == false" class="text-xs font-bold mb-1">{{$t('delegate.linkingaccount')}}</div>
        <div v-if="delegateValue" id="delegatePublicKey" :copyValue="delegateAcc" copySubject="Delegate Public Key" class="text-xs w-full outline-none bg-gray-100 z-10" >{{delegateAcc}}</div>
        <div v-if="delegateValue == false && newAcc">{{$t('delegate.newaccount')}}</div>
        <div v-else-if="delegateValue == false && newAccPK">{{$t('createwallet.fromprivatekey')}}</div>
        <div v-if="delegateValue == false && !newAcc&& !newAccPK">{{$t('delegate.noneselected')}}</div>
      </div>
      <font-awesome-icon icon="copy" @click="copy('delegatePublicKey')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block mr-2" v-if="delegateValue"></font-awesome-icon>
      <div class="inline-block ml-2" v-if="delegateValue == false">
        <SelectAccountTypeModal />
      </div>
    </div>
    <PasswordInput :placeholder="$t('signin.enterpassword')" :errorMessage="$t('scriptvalues.enterpassword',{name: walletName })" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
    <div class="mt-10">
      <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="createDelegate" v-if="delegateValue" :disabled="disableLinkBtn">{{$t('delegate.unlinkaccount')}}</button>
      <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="createDelegate" v-if="delegateValue == false" :disabled="disableLinkBtn">{{$t('delegate.linkaccount')}}</button>
    </div>
  </div>
</template>
<script>

import { ref, computed, getCurrentInstance,watch } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectAccountTypeModal from '@/modules/account/submodule/delegate/components/SelectAccountTypeModal.vue';
import { walletState } from '@/state/walletState';
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
//import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { ChainUtils } from "@/util/chainUtils"
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
//import { BuildTransactions } from "@/util/buildTransactions";
import { LinkAction } from "tsjs-xpx-chain-sdk";
import { useI18n } from 'vue-i18n';
import { accountUtils } from "@/util/accountUtils";
//import { AsyncComputed } from 'vue-async-computed';
//import AsyncComputed from '@vue3-async-computed';
//import useAsyncComputed from './use-async-computed';

export default {
  name: 'ViewAccountDelegate',
  components: {
    PasswordInput,
    SelectAccountTypeModal,
  },
  props: {
    address: String,
  },
  setup(p) {
    const { t } = useI18n();
    const walletPassword = ref("");
    const showPasswdError = ref(false);
    const err = ref(false);
    const newAcc = ref(false);
    //const delegateValue = ref(false);
    const newAccPK = ref(false);
    const delegateAcc = ref('');
    const AccPublicKey = ref("");
    const AccPrivateKey = ref("")
    const router = useRouter();
    const toast = useToast();
    const accAddress = ref(p.address);
    const passwdPattern = "^[^ ]{8,}$";
    const internalInstance = getCurrentInstance();
    const chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
    const emitter = internalInstance.appContext.config.globalProperties.emitter;    
    const walletName = walletState.currentLoggedInWallet.name;
    const disableLinkBtn = computed(() => !(walletPassword.value.match(passwdPattern)));
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };

    const verifyDelegateAcc = async() => {
      const accountDetail = walletState.currentLoggedInWallet.accounts.find(account => account.address == accAddress.value);       
      //delegateAccountKey;
      if (accountDetail) {
        const publicAccount = Helper.createPublicAccount(accountDetail.publicKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type)); 
        console.log(walletState.currentLoggedInWallet.others);
        console.log(walletState.currentLoggedInWallet.accounts);
        const accountInfo = await chainAPICall.accountAPI.getAccountInfo(publicAccount.address);
        console.log(accountInfo);
        // if(accountInfo.linkedAccountKey !== "0".repeat(64)){
       // let delegateAccountKey = accountInfo.linkedAccountKey;
        // } 
        delegateAcc.value = accountInfo.linkedAccountKey;
      }
      //return delegateAccountKey;
    };

    // watch(delegateAcc,(latest,prev)=>{          
    //   if(latest!=prev){
    //     delegateAcc.value = latest;
    //   } 
    // });
    console.log(verifyDelegateAcc);
    verifyDelegateAcc();

// const delegateValue = AsyncComputed(verifyDelegateAcc());
    const delegateValue = computed(()=>{
      let delegateBoolean;
      console.log(delegateAcc.value)
      if(delegateAcc.value!=''){
        if(delegateAcc.value === "0".repeat(64)){
          delegateBoolean = false;
        }else if(delegateAcc.value !== "0".repeat(64)){
          delegateBoolean = true;
        }
      }
      console.log(delegateBoolean);
      return delegateBoolean;
    });

    const createDelegate = () => {
      if (WalletUtils.verifyWalletPassword(walletName,networkState.chainNetworkName,walletPassword.value)) {
        if (delegateAcc.value !== "0".repeat(64)) {
          const indexOtherAcc = walletState.currentLoggedInWallet.others.findIndex((other)=> other.publicKey === delegateAcc.value)
          if (indexOtherAcc > -1) {
            accountUtils.createDelegatTransaction(accAddress.value, walletPassword.value, delegateAcc.value, LinkAction.Unlink);

            toast.add({severity:'success', summary: 'Notification', detail: 'Unlink Successfully', group: 'br', life: 5000});            
            router.push({ name: "ViewAccountDisplayAll" });
          } else {
            err.value = t('delegate.linkerror2');
          }
        } else if (!AccPublicKey.value == "" && !AccPrivateKey.value == "") {
          accountUtils.createDelegatTransaction(accAddress.value, walletPassword.value, AccPublicKey.value, LinkAction.Link);

          toast.add({severity:'success', summary: 'Notification', detail: 'Link Successfully', group: 'br', life: 5000});            
          router.push({ name: "ViewAccountCreated", params: { name: '' ,publicKey: AccPublicKey.value, privateKey: AccPrivateKey.value }});
        } else {
          err.value = "Linking account not selected.";
        }
      } else {
        err.value = t('scriptvalues.walletpasswordvalidation',{name : walletName});
      }
    };
    
    emitter.on('NEW ACCOUNT', newAccPublicKey => {
      if(newAccPublicKey){
        AccPublicKey.value = newAccPublicKey.publicKey;
        AccPrivateKey.value = newAccPublicKey.privateKey;
        newAcc.value = true;
        newAccPK.value = false;

      }
    })

    emitter.on('FROM PRIVATE KEY', existingPublicKey => {
      if(existingPublicKey){
        AccPublicKey.value = existingPublicKey.publicKey;
        AccPrivateKey.value = existingPublicKey.privateKey;
        newAccPK.value = true;
        newAcc.value = false;

      }
    })

    return {
      walletPassword,
      showPasswdError,
      walletState,
      createDelegate,
      verifyDelegateAcc,
      delegateAcc,
      newAccPK,
      newAcc,
      AccPublicKey,
      AccPrivateKey,
      disableLinkBtn,
      copy,
      err,
      walletName,
      delegateValue
    };
  },
}
</script>
<style> 
    [v-cloak] {
        display: none;
    }
</style>