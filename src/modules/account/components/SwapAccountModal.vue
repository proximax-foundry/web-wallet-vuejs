<template>
    <button type="submit" class="default-btn focus:outline-none disabled:opacity-50 mt-5" @click="toggleModal = !toggleModal">Enable</button>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang absolute flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class ='text-gray-700 text-center text-xs mt-2'>Please key in private key to confirm enable NIS1 for this account.</div>
            <PasswordInput class = 'my-3' v-model= 'walletPasswd' :placeholder="'Password'"/>
            <div @click="enableNIS1Swap()"  class = 'rounded-md bg-blue-primary cursor-pointer text-xs text-white font-semibold py-2 text-center ml-auto mr-auto w-7/12'>Confirm</div>
            <div class= 'text-center cursor-pointer font-semibold text-xs mt-2' @click="toggleModal = !toggleModal; walletPasswd=''">Cancel</div>
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
import { ref} from "vue";
import {useI18n} from 'vue-i18n'
import { useRouter } from "vue-router";
export default {
    name: 'SwapAccountModal',
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
      const enableNIS1Swap = () => {
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
      enableNIS1Swap,
      toggleModal,
      err,
      walletPasswd
    }
    }
}
</script>
