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
                <img src="@/modules/wallet/img/icon-add-new-blue.svg" class="w-12 inline-block">
                <p class="mt-3">{{$t('delegate.newaccount')}}</p>
                <button class="max-w-xs sm:max-w-sm inline-block default-btn my-3 self-center">Select</button></div>
              <div class="px-5 self-center text-center my-10">
                <img src="@/modules/wallet/img/icon-private-key-blue.svg" class="w-12 inline-block"><p class="mt-3">{{$t('createwallet.fromprivatekey')}}</p>
                <button class="max-w-xs sm:max-w-sm inline-block default-btn my-3 self-center" @click="naviPrivateKey = !naviPrivateKey">{{$t('delegate.select')}}</button>
              </div>
            </div>
          </div>
          <div class="w-104" v-else>
            <h1 class="default-title font-bold my-5">{{$t('createwallet.fromprivatekey')}}</h1>
            <div class="page-title-gray-line pt-20">
              <div class="my-5">{{$t('delegate.linkmessage')}}</div>
              <PasswordInput placeholder="Private Key" errorMessage="Please key in a valid Private Key" :showError="showPrivateKeyError" v-model="privateKey" icon="lock" :disabled="disabledPrivateKey" />
              <div class="mt-10">
                <button type="button" class="default-btn mr-5 focus:outline-none">{{$t('signin.clear')}}</button>
                <button type="submit" class="default-btn py-1 disabled:opacity-50 disabled:cursor-auto" :disabled="disableConfirm">{{$t('delegate.confirm')}}</button>
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
import { ref } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';

export default{
  name: 'SelectAccountTypeModal',
  data() {
    return {
      toggleModal: false,
      naviPrivateKey: false,
    };
  },

  setup(){
    // const appStore = inject("appStore");
    const privateKey = ref('');
    const showPrivateKeyError = ref(false);
    const disabledPrivateKey = ref(false);
    const disableConfirm = ref(true);

    return{
      privateKey,
      showPrivateKeyError,
      disabledPrivateKey,
      disableConfirm,
    };
  },

  components: {
    PasswordInput,
  }
}
</script>
