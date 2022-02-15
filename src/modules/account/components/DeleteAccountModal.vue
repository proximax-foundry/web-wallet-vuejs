<template>
  <div @click=" toggleModal = !toggleModal" class='flex ml-auto' >
    <img src='@/modules/account/img/delete-icon.svg' class='mt-3  w-3 h-3 cursor-pointer'>
    <div class = 'pt-2.5 text-xs text-red-500 cursor-pointer ml-1 font-semibold'>Delete This Account</div>
  </div>
  <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
  >
  <div v-if='toggleModal' class="popup-outer fixed flex z-50 text-black mt-10">
    <div class="modal-popup-box">
      <div class="error error_box mb-3 text-center" v-if="err!=''">{{ err }}</div>
        <div class ='text-center mt-2 text-md font-normal'>Account Deletion</div>
          <img src='@/modules/wallet/img/icon-delete-wallet.svg' class='ml-auto mr-auto'>
          <div class ='text-black text-center text-xs mt-2 font-normal'>This action will delete the account.</div>
          <div class ='font-bold text-center text-xs mt-2'>Are you sure you want to delete this account?</div>
          <div class="w-92">
            <div class= 'text-center'>
              <div class="mt-3">
                <PasswordInput class ='w-8/12 ml-auto mr-auto' placeholder="Password"  v-model="walletPasswd" icon="lock"/>
                <button @click="deleteAccount()" class='red-btn px-4 py-3 font-semibold cursor-pointer text-center ml-auto mt-3 mr-auto w-8/12 disabled:opacity-50 disabled:cursor-auto' :disabled="disableDelete">Confirm Account Deletion</button>
                <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-3' @click="toggleModal = !toggleModal;walletPasswd='';err=''">Cancel</div>
              </div>
            </div> 
        </div>
      </div>
  </div>
  </transition>
  <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 z-20 bg-gray-100"></div>
</template>
<script>
import PasswordInput from '@/components/PasswordInput.vue';
import { walletState } from '@/state/walletState';
import { networkState } from '@/state/networkState';
import { WalletUtils } from '@/util/walletUtils';
import { Account } from '@/models/account';
import {  ref,computed} from "vue";
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
      const passwdPattern = "^[^ ]{8,}$";
      const disableDelete = computed(() => !(walletPasswd.value.match(passwdPattern)));
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
      walletPasswd,
      disableDelete
    }
    }
}
</script>
