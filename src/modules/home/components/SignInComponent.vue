<template>
  <div>
    <form @submit.prevent="login">
      <fieldset>
        <div class="w-8/12 text-center mr-auto ml-auto error error_box" v-if="err!=''">{{ err }}</div>
        <SelectNetworkInput />
        <div class='mt-3'></div>
        <SelectWalletInput />
        <div class='mt-3'></div>
        <div class= 'text-center'>
          <PasswordInput class = 'w-8/12 block ml-auto mr-auto' placeholder="Password" :errorMessage="$t('signin.passwordrequired')" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        </div>
        <div class=" text-center mt-2">
          <button type="submit" class=" blue-btn bg-gray-primary py-2.5 w-8/12 disabled:opacity-50" :disabled="disableSignin">{{$t('welcome.signin')}}</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import SelectNetworkInput from '@/components/SelectNetworkInput.vue';
import SelectWalletInput from '@/components/SelectWalletInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { WalletUtils } from '@/util/walletUtils';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';
import {useI18n} from 'vue-i18n'
import Dropdown from 'primevue/dropdown';
export default defineComponent({
  name: 'SignInComponent',
  data() {
    return {
      toggleModal: false,
    };
  },

  setup(){
    const {t} = useI18n();
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
    const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});
    emitter.on('select-wallet',(wallet)=>{
      selectedWallet.value=wallet
    })
    const login = () => {
      var result = WalletUtils.verifyWalletPassword(selectedWallet.value, networkState.chainNetworkName, walletPassword.value);
      if (result == -1) {
        err.value = "Invalid wallet name";
      } else if (result == 0) {
        err.value = t('signin.invalidpassword');
      } else {
        // let wallets = new Wallets();
        let wallet = walletState.wallets.filterByNetworkNameAndName(networkState.chainNetworkName, selectedWallet.value);
        //WalletUtils.refreshAllAccountDetails(wallet, networkState.currentNetworkProfile);
        WalletStateUtils.updateLoggedIn(wallet);
        NetworkStateUtils.updateLastAccessNetworkName(networkState.chainNetworkName);
        router.push({ name: "ViewDashboard"});
        // router.push({ path: "/create-transfer"});
      }
    };

    return{
      networkState,
      err,
      walletPassword,
      selectedWallet,
      showPasswdError,
      disableSignin,
      login,
      selectedNetwork,
    };
  },

  components: {
    PasswordInput,
    SelectNetworkInput,
    SelectWalletInput
   /*  Dropdown */
  }
});
</script>