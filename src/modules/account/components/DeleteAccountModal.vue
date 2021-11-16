<template>
    <div @click=" toggleModal = !toggleModal" class='flex ml-auto' >
      <img src='@/modules/account/img/delete-icon.svg' class='mt-3  w-3 h-3 cursor-pointer'>
      <div class = 'pt-2.5 text-xs text-red-500 cursor-pointer ml-1 font-semibold'>Delete This Account</div>
    </div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang absolute flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class= 'ml-auto mr-auto mt-2 text-xs  font-semibold' style='width:62%'>Are you sure you want to delete this account?</div>
            <div class ='text-red-700  text-center text-txs mt-2'>For security purpose, this is required before completely deleting your account.</div>
            <PasswordInput class = 'mt-3' v-model= 'walletPasswd' :placeholder="'Password'"/>
            <div @click="deleteAccount()"  class = 'rounded-md bg-red-700 cursor-pointer text-xs text-white font-semibold py-2 text-center ml-auto mr-auto w-7/12'>Confirm Deletion</div>
            <div class= 'text-center cursor-pointer font-semibold text-xs text-blue-link mt-2' @click="toggleModal = !toggleModal">Cancel</div>
            <!-- <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div class="mt-10 mb-5"><div class="font-bold text-xl text-gray-900">{{ name }}</div> <span class="text-lg text-gray-700">{{$t('deletewallet.deletemessage')}}</span></div>
            <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
              <div class="text-center w-full">
                <div class="border border-gray-600 rounded-full w-8 h-8 inline-block relative">
                  <font-awesome-icon icon="exclamation" class="w-5 h-5 text-gray-600 inline-block absolute" style="top:5px; left: 12px"></font-awesome-icon>
                </div>
                <div class="font-bold text-sm">{{$t('deletewallet.warning')}}</div>
                <p class="text-sm mt-3">{{$t('deletewallet.warningmessage')}}</p>
              </div>
            </div>
            <fieldset class="w-full">
              <label class="inline-flex items-center mb-10">
                <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="readCheck">
                <span class="ml-2 cursor-pointer text-xs">{{$t('deletewallet.deleteconsent')}}</span>
              </label>
              <div>
                <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">{{$t('deletewallet.cancel')}}</button>
                <button type="submit" class="default-btn py-1 disabled:opacity-50" @click="deleteAccount();" :disabled="disableDelete">{{$t('deletewallet.delete')}}</button>
              </div>
            </fieldset> -->
          </div>
        
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>
<script>
import PasswordInput from '@/components/PasswordInput.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from '@/util/walletUtils';
import { Account } from '@/models/account';
import {  ref} from "vue";
import {useI18n} from 'vue-i18n'
import { useRouter } from "vue-router";
export default {
    name: 'DeleteAccountModal',
    components:{
        PasswordInput
    }, 
    props:{
        account: Account
    },
    setup(p){
      const {t} = useI18n();
      const router = useRouter();
      let toggleModal = ref(false)
      let walletPasswd = ref('')
      let err = ref('')
      const deleteAccount = () => {
      const accountIndex = walletState.currentLoggedInWallet.accounts.findIndex((element) => element.name == p.account.name);
      if(WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)){
        if(accountIndex > -1){
            walletState.currentLoggedInWallet.removeAccount(p.account.name);
            walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
            router.push({ name: 'ViewAccountDisplayAll', params: {deleteAccount: 'success' } });
        }else{
            err.value = t('scriptvalues.removeaccount');
        }
      }else{
          err.value = "Wallet password is incorrect";
      }
      
    };
    return{
      deleteAccount,
      toggleModal,
      err,
      walletPasswd
    }
    }
}
</script>
