<template>
  <div>
    <a @click="toggleModal = !toggleModal" class="block big-default-btn my-3 self-center w-full">Sign In</a>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-show="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104">
            <h1 class="default-title font-bold my-10">Sign in to {{networkState.chainNetworkName}} Wallet</h1>
            <form @submit.prevent="login">
              <fieldset class="w-full">
                <div class="error error_box" v-if="err!=''">{{ err }}</div>
                <SelectInputPlugin placeholder="Select a Wallet" errorMessage="Select a Wallet" v-model="selectedWallet" :options="wallets" @default-selected="selectedWallet=0" @clear-selection="clearWalletOption" />
                <PasswordInput placeholder="Enter Wallet Password" errorMessage="Password Required" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
                <div class="mt-10">
                  <button type="button" class="default-btn mr-5 focus:outline-none" @click="clearInput();">Clear</button>
                  <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSignin">Sign In</button>
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
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import { useRouter } from "vue-router";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { WalletUtils } from '@/util/walletUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';

export default defineComponent({
  name: 'SignInModal',
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const router = useRouter();
    const err = ref("");
    const walletPassword = ref("");
    const selectedWallet = ref("");
    const showPasswdError = ref(false);
    const passwdPattern = "^[^ ]{8,}$";
    const disableSignin = computed(
      () => !(
        walletPassword.value.match(passwdPattern) &&
        selectedWallet.value != ''
      )
    );

    const clearWalletOption = () => {
      selectedWallet.value = '';
    }

    const clearInput = () => {
      selectedWallet.value = '';
      walletPassword.value = "";
      emitter.emit("CLEAR_SELECT", selectedWallet.value);
      emitter.emit("CLEAR_PASSWORD", walletPassword.value);
    };

    const wallets = computed(
      () =>{
        var w = [];
        walletState.wallets.filterByNetworkName(networkState.chainNetworkName).forEach((wallet)=>{
          w.push({
            value: wallet.name,
            label: wallet.name,
          });
        });
        w.sort((a, b) => {
          if (a.label > b.label) return 1;
          if (a.label < b.label) return -1;
          return 0;
        });
        return w;
      }
    );

    const login = () => {
      var result = WalletUtils.verifyWalletPassword(selectedWallet.value, networkState.chainNetworkName, walletPassword.value);
      if (result == -1) {
        err.value = "Invalid wallet name";
      } else if (result == 0) {
        err.value = "Invalid password";
      } else {
        // let wallets = new Wallets();
        let wallet = walletState.wallets.filterByNetworkNameAndName(networkState.chainNetworkName, selectedWallet.value);
        WalletStateUtils.updateLoggedIn(wallet);
        router.push({ path: "/dashboard"});
        // router.push({ path: "/create-transfer"});
      }
    };

    return{
      networkState,
      err,
      wallets,
      walletPassword,
      selectedWallet,
      showPasswdError,
      disableSignin,
      login,
      clearWalletOption,
      clearInput,
    };
  },

  components: {
    SelectInputPlugin,
    PasswordInput
  }
});
</script>