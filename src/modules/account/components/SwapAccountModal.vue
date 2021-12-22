<template>
    <button type="submit" class="default-btn focus:outline-none disabled:opacity-50 mt-5" @click="toggleModal = !toggleModal">Enable</button>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang absolute flex z-50">
        <div class="modal-popup-box ">
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class ='text-gray-700 text-center text-xs mt-2'>Please insert private key to enable NIS1 for this account.</div>
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
import { nis1SwapUtils } from '@/util/nis1SwapUtils';
import { Account } from '@/models/account';
import { ref} from "vue";
import {useI18n} from 'vue-i18n'
import { useRouter } from "vue-router";
export default {
    name: 'SwapAccountModal',
    components:{
        PasswordInput
    },
    emits:[
      'enable-nis1-swap'
    ],
    props:{
        address: String
    },
    setup(p, {emit}){
      const {t} = useI18n();
      const router = useRouter();
      let toggleModal = ref(false)
      let walletPasswd = ref('')
      let err = ref('')
      const enableNIS1Swap = () => {
      const account = walletState.currentLoggedInWallet.accounts.find((account) => account.address == p.address);
      if(!account){
        account = walletState.currentLoggedInWallet.others.find((account) => account.address == p.address);
      }

      if(WalletUtils.verifyWalletPassword(walletState.currentLoggedInWallet.name,networkState.chainNetworkName, walletPasswd.value)){
        if(account){
            let nis1 = nis1SwapUtils.createNIS1Account(walletPasswd.value, account);
            account.nis1Account = nis1;
            walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
            // router.push({ name: 'ViewAccountDisplayAll', params: {deleteAccount: 'success' } });
            toggleModal.value = !toggleModal.value;
            emit('enable-nis1-swap', p.address);
        }else{
            err.value = 'Unable to enable NIS1 swap for this account';
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
