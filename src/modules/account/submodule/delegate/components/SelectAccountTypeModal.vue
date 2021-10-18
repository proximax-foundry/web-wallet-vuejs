<template>
  <div>
    <font-awesome-icon icon="edit" class="w-5 h-5 text-gray-500 cursor-pointer inline-block" @click="toggleModal = !toggleModal"></font-awesome-icon>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal; naviPrivateKey = !naviPrivateKey;"></font-awesome-icon>
          </div>
          <div class="w-104" v-if="!naviPrivateKey">
            <h1 class="default-title font-bold my-5">{{$t('delegate.selectacctype')}}</h1>
            <div class="page-title-gray-line grid grid-cols-1 md:grid-cols-2 pt-20">
              <div class="px-5 self-center text-center my-10">
                <img src="@/modules/wallet/img/icon-add-new.svg" class="w-12 inline-block">
                <p class="mt-3">{{$t('delegate.newaccount')}}</p>
                <button class="max-w-xs sm:max-w-sm inline-block default-btn my-3 self-center" @click="linkNewAcc()">{{$t('delegate.select')}}</button></div>
              <div class="px-5 self-center text-center my-10">
                <img src="@/modules/wallet/img/icon-private-key.svg" class="w-12 inline-block"><p class="mt-3">{{$t('createwallet.fromprivatekey')}}</p>
                <button class="max-w-xs sm:max-w-sm inline-block default-btn my-3 self-center" @click="naviPrivateKey = !naviPrivateKey">{{$t('delegate.select')}}</button>
              </div>
            </div>
          </div>
          <div class="w-104" v-else>
            <h1 class="default-title font-bold my-5">{{$t('createwallet.fromprivatekey')}}</h1>            
            <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
            <div class="page-title-gray-line pt-20">
              <div class="my-5">{{$t('delegate.linkmessage')}}</div>
              <PasswordInput :placeholder="$t('createprivatekeywallet.privatekey')" :errorMessage="$t('delegate.entervalidpk')" :showError="showPrivateKeyError" v-model="privateKey" icon="lock" :disabled="disabledPrivateKey" />
              <div class="mt-10">
                <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput">{{$t('signin.clear')}}</button>
                <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" :disabled="disableConfirm" @click="linkPrivateKey()">{{$t('delegate.confirm')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal; naviPrivateKey = !naviPrivateKey" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, computed, unref } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Account } from "tsjs-xpx-chain-sdk";
import { networkState } from "@/state/networkState";
import { ChainUtils } from "@/util/chainUtils"
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from 'vue-i18n'
import { accountUtils } from '@/util/accountUtils';

export default{
  name: 'SelectAccountTypeModal',

  setup(){
    const { t } = useI18n();
    const privateKey = ref('');
    const toggleModal = ref(false);
    const err = ref('');
    const showPrivateKeyError = ref(false);
    const naviPrivateKey = ref(false);
    const disabledPrivateKey = ref(false);
    const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$";    
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const disableConfirm = computed(
      () => !(
        privateKey.value.match(privKeyPattern)
      )
    );

    const clearInput = () => {
      privateKey.value = '';
      err.value = '';
    };

    const linkNewAcc = () =>{
      const account = WalletUtils.generateNewAccount(ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
      emitter.emit('NEW ACCOUNT', account);
      toggleModal.value = !toggleModal.value;
    };
  
    const linkPrivateKey = async() =>{
      const networkType = networkState.currentNetworkProfile.network.type;
      const accountDetail = Account.createFromPrivateKey(privateKey.value, networkType);
      console.log(accountDetail.address.address);
      const accountAPIResponse = await accountUtils.getValidAccount(accountDetail.address.address);
      if(accountAPIResponse == true){        
        emitter.emit('FROM PRIVATE KEY', accountDetail);          
        toggleModal.value = !toggleModal.value;
      } else {          
        err.value = t('delegate.linkerror')
      }          
    };

    return{
      privateKey,
      showPrivateKeyError,
      disabledPrivateKey,
      disableConfirm,
      linkNewAcc,
      err,
      linkPrivateKey,
      naviPrivateKey,
      toggleModal,
      clearInput  
    };
  },

  components: {
    PasswordInput,
  }
}
</script>
