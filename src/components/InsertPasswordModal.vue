<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104">
            <h1 class="default-title font-bold my-10">Please insert password to proceed</h1>
            <form @submit.prevent="login">
              <fieldset class="w-full">
                <div class="error error_box" v-if="err!=''">{{ err }}</div>
                <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
                <div class="mt-10">
                  <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">Cancel</button>
                  <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableConfirm">Confirm</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { inject, ref } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue'

export default{
  name: 'SignInModal',
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const walletPassword = ref("");
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";

    const disableConfirm = computed(
      () => !(
        walletPassword.value.match(passwdPattern) &&
        selectedWallet.value != '0'
      )
    );

    const login = () => {
      var result = appStore.loginToWallet(selectedWallet.value, walletPassword.value, siriusStore);
      if (result == -1) {
        err.value = "Invalid wallet name";
      } else if (result == 0) {
        err.value = "Invalid password";
      } else {
        router.push({ path: "/dashboard"});
      }
    };

    return{
      err,
      disableConfirm,
      walletPassword,
      showPasswdError,
      login,
    };
  },

  components: {
    PasswordInput
  }
}
</script>
