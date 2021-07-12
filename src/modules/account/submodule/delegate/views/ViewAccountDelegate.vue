<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Accounts ></span> <span class="text-blue-primary font-bold">Delegate</span></div>
    <div>
      <router-link :to="{name: 'ViewAccountDisplayAll'}" class="font-bold" active-class="accounts">View all accounts</router-link>
    </div>
  </div>

  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>    
    <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
    <div class="flex justify-between p-4 rounded-xl bg-white border-yellow-500 border-2 mb-8 mt-3">
    <div class="text-center w-full">
        <p class="text-sm" v-if="verifyDelegateAcc() && !otherAccValue==''">Your account is linked to a delegated account </p>
        <p class="text-sm" v-else>Your account is not linked to a delegated account</p>
    </div>
    </div>
    <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-7 items-center">
      <div class="text-left w-full relative">
        <div v-if="verifyDelegateAcc() && !otherAccValue==''" class="text-xs font-bold mb-1">Public key of the delegated account</div>
        <div v-else class="text-xs font-bold mb-1">Linking Account:</div>
        <div id="delegatePublicKey" v-if="verifyDelegateAcc() && !otherAccValue==''" :copyValue="otherAccValue" copySubject="Delegate Public Key" class="text-xs w-full outline-none bg-gray-100 z-10" >{{otherAccValue}}</div>
        <div v-else>None selected</div>
      </div>
      <font-awesome-icon icon="copy" @click="copy('delegatePublicKey')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block mr-2" v-if="verifyDelegateAcc() && !otherAccValue==''"></font-awesome-icon>
      <div v-else class="inline-block ml-2">
        <SelectAccountTypeModal/>
      </div>
    </div>
    <PasswordInput placeholder="Enter Wallet Password" :errorMessage="'Please enter wallet ' + walletState.currentLoggedInWallet.name + '\'s password'" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
    <div class="mt-10">
       <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="verifyWalletPw()" v-if="verifyDelegateAcc() && !otherAccValue==''" :disabled="disableLinkBtn">Unlink Linked Account</button>
        <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" @click="verifyWalletPw()" v-else :disabled="disableLinkBtn">Link New Account</button>
    </div>
  </div>
</template>
<script>

import { ref,computed } from "vue";
import PasswordInput from '@/components/PasswordInput.vue';
import SelectAccountTypeModal from '@/modules/account/submodule/delegate/components/SelectAccountTypeModal.vue';
import { walletState } from '@/state/walletState';
import { WalletUtils } from "@/util/walletUtils";
import { networkState } from "@/state/networkState";
import { ChainAPICall } from "@/models/REST/chainAPICall"
import { ChainUtils } from "@/util/chainUtils"
import { Helper } from "@/util/typeHelper";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

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
    const walletPassword = ref('');
    const showPasswdError = ref(false);
    const err = ref(false);
    const otherAccValue = ref('');
    const router = useRouter();
    const toast = useToast();
    const copy = (id) =>{
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };
    const passwdPattern = "^[^ ]{8,}$";
    const disableLinkBtn = computed(
      () => !(
        walletPassword.value.match(passwdPattern)
      )
    );

    const verifyDelegateAcc = async() => {
      let chainAPICall = new ChainAPICall(ChainUtils.buildAPIEndpoint(networkState.selectedAPIEndpoint, networkState.currentNetworkProfile.httpPort));
      const accountAddress = walletState.currentLoggedInWallet.accounts.find(element => element.address === p.address)
      if(accountAddress) {
        let publicAccount = Helper.createPublicAccount(accountAddress.publicKey, ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type)) 
        const accountInfo = await chainAPICall.accountAPI.getAccountInfo(publicAccount.address);
        const indexOtherAcc = walletState.currentLoggedInWallet.others.findIndex((other)=> other.publicKey === accountInfo.linkedAccountKey)
        if(indexOtherAcc > -1) {
          otherAccValue.value = walletState.currentLoggedInWallet.others[indexOtherAcc].publicKey; 
        } else {
          otherAccValue.value = "";
        }
      } else {
        otherAccValue.value = "";
      }
    };


    const verifyWalletPw = async() => {
      if (!walletPassword.value == "") {
        if (WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName,walletPassword.value)) {
          if(!otherAccValue.value == '') {
            const indexOtherAcc = walletState.currentLoggedInWallet.others.findIndex((other)=> other.publicKey === otherAccValue.value)
            if(indexOtherAcc > -1) {
              walletPassword.value = "";
              walletState.currentLoggedInWallet.others.splice(indexOtherAcc,1);
              walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet); 
              toast.add({severity:'success', summary: 'Notification', detail: 'Unlink Successfully', group: 'br', life: 5000});            
              err.value = "";
              } else {

              }
            }
          } else {
            err.value = "Wallet password is incorrect";
          }
      }
    };
    return {
      walletPassword,
      showPasswdError,
      walletState,
      verifyWalletPw,
      verifyDelegateAcc,
      otherAccValue,
      disableLinkBtn,
      copy,
      err
    };
  },
}
</script>
