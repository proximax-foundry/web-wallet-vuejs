<template>
  <div>
    <form @submit.prevent="login">
      <fieldset>
        <div class="w-8/12 text-center mr-auto ml-auto error error_box" v-if="err!=''">{{ err }}</div>
        <SelectNetworkInput/>
        <div class='mt-3'></div>
        <SelectWalletInput />
        <div class='mt-3'></div>
        <div class= 'text-center'>
          <PasswordInput class = 'w-8/12 block ml-auto mr-auto' :placeholder="$t('general.password')" :errorMessage="$t('general.passwordRequired')" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
        </div>
        <div class='text-center mt-3' v-if="needAPIKey">
          <HiddenInput class = 'w-8/12 block ml-auto mr-auto' placeholder="API key" :errorMessage="apikeyError" :showError="showAPIKeyError" v-model="apikeyInput" icon="lock" />
        </div>
        <div class="text-center mt-2">
          <button type="submit" class=" blue-btn bg-gray-primary py-2.5 w-8/12 disabled:opacity-50" :disabled="disableSignin || passwordCorrectPattern">{{$t('home.signIn')}}</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import SelectNetworkInput from '@/components/SelectNetworkInput.vue';
import SelectWalletInput from '@/components/SelectWalletInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import HiddenInput from '@/components/HiddenInput.vue';
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
    const showAPIKeyError = ref(false);
    const needAPIKey = computed(()=>{
      
      if(networkState.currentNetworkProfile){
        if(networkState.currentNetworkProfile.secured){
          if(showAPIKeyError.value){
            return true;
          }
          else if(!networkState.currentNetworkProfile.apikey){
            return true;
          }
        }
      }

      return false;
    });
    const apikeyInput = ref('');
    const apikeyError = ref('API key required'); 
    const disableSignin = ref(false); 
    const passwordCorrectPattern = computed(
      () => !(
        walletPassword.value.match(passwdPattern) &&
        selectedWallet.value != ''
      )
    );
    const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});
    emitter.on('select-wallet',(wallet)=>{
      selectedWallet.value=wallet
    })
    const login = async () => {
      let networkConfigUpdated = false;

      if(needAPIKey.value && apikeyInput.value === ""){
        showAPIKeyError.value = true;
        apikeyError.value = "API Key required";
        return;
      }
      else if(needAPIKey.value){
        let lockingTime = localStorage.getItem("locking_time");
        let currentTime = new Date().getTime();
        if(lockingTime){
          if(currentTime < parseInt(lockingTime) + (5 * 60 * 1000) ){
            showAPIKeyError.value = true;
            apikeyError.value = "too many failed attempt. Please try again in few minutes";
            return;
          }
          else{
            localStorage.removeItem("locking_time");
          }
        }

        let loginAttemptTime = localStorage.getItem("last_login_attempt");

        if(loginAttemptTime){
          if(currentTime > parseInt(loginAttemptTime) + (5 * 60 * 1000) ){
            localStorage.removeItem("login_locking_retry");
          }
        }

        localStorage.setItem("last_login_attempt", currentTime.toString());

        networkState.currentNetworkProfile.apikey = apikeyInput.value;
        disableSignin.value = true;

        let apiKeyOK = await NetworkStateUtils.updateNetworkConfig();

        disableSignin.value = false;

        if(apiKeyOK){
          networkConfigUpdated = true;
          sessionStorage.setItem("secured_auth", apikeyInput.value);
          if(localStorage.getItem("login_locking_retry")){
            localStorage.removeItem("login_locking_retry");
          }
        }
        else{
          showAPIKeyError.value = true;
          apikeyError.value = "API Key not valid";
          let tryCount = parseInt(localStorage.getItem("login_locking_retry") | "0");     
          tryCount = tryCount + 1;

          if(tryCount >= 3){
            localStorage.setItem("locking_time", new Date().getTime().toString())
            localStorage.removeItem("login_locking_retry");
          }
          else{
            localStorage.setItem("login_locking_retry", tryCount.toString());
          }
          
          return;
        } 
      }

      showAPIKeyError.value = false;

      var result = WalletUtils.verifyWalletPassword(selectedWallet.value, networkState.chainNetworkName, walletPassword.value);   
      
      if (!result) {
        err.value = t('general.walletPasswordInvalid',{name:selectedWallet.value});
      } else {
        // let wallets = new Wallets();
        if(!networkConfigUpdated){
          await NetworkStateUtils.updateNetworkConfig();
        }
        sessionStorage.setItem("soundSetting", "true");
        WalletUtils.checkLoadedDataUsable(networkState.chainNetworkName);
        let wallet = walletState.wallets.filterByNetworkNameAndName(networkState.chainNetworkName, selectedWallet.value);
        wallet.fixNonManagableAccounts();
        walletState.wallets.saveMyWalletOnlytoLocalStorage(wallet);
        WalletStateUtils.updateLoggedIn(wallet);
        NetworkStateUtils.updateLastAccessNetworkName(networkState.chainNetworkName);
        router.push({ name: "ViewDashboard"});
      }
    };

    return{
      networkState,
      err,
      walletPassword,
      selectedWallet,
      showPasswdError,
      disableSignin,
      passwordCorrectPattern,
      login,
      selectedNetwork,
      needAPIKey,
      apikeyInput,
      apikeyError,
      showAPIKeyError
    };
  },

  components: {
    PasswordInput,
    SelectNetworkInput,
    SelectWalletInput,
    HiddenInput
   /*  Dropdown */
  }
});
</script>