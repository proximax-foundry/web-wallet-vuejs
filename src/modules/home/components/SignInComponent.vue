<template>
  <div>
    <form @submit.prevent="login">
      <fieldset >
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
          <SelectInputPlugin class = 'block ml-auto mr-auto' placeholder="Select Wallet" :errorMessage="$t('signin.selectwallet')" v-model="selectedWallet" :options="wallets" @default-selected="selectedWallet=0" @clear-selection="clearWalletOption" />
          <div class= 'text-center'>
            <PasswordInput  class = 'w-8/12 block ml-auto mr-auto' placeholder="Password" :errorMessage="$t('signin.passwordrequired')" :showError="showPasswdError" v-model="walletPassword" icon="lock" />
          </div>
          <!-- <div class = 'text-center'>
            <Dropdown  selected v-model="selectedNetwork" name="selectedNetwork" :modelValue="networkState.chainNetwork" :options="chainsNetworkOption" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" @change="selectNetwork"></Dropdown>
          </div> -->
          <div class = 'text-center text-xs'>Current Network: </div>
          <div class = 'text-center'>{{networkState.chainNetworkName}}</div>
          <div class="mt-4 text-center">
            <button type="submit" class="default-btn bg-gray-primary py-2 w-8/12 disabled:opacity-50" :disabled="disableSignin">{{$t('welcome.signin')}}</button>
          </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
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
    
     NetworkStateUtils.changeNetworkByIndex(2)
    const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});
     const chainsNetworks = computed(()=> {

      let options = [];
      /* networkState.availableNetworks.forEach((network, index) => {
        options.push({ label: network, value: index });
      }); */
       options.push({ label: 'Sirius Testnet 2', value: 2});
      return options;
    });
    const chainsNetworkOption = computed(()=>{

      return [{
        label: t('Header.network'),
        items: chainsNetworks.value
      }];
    });
    const selectNetwork= (e) =>{
      // if(e.value.value !== 'customize'){
         selectedWallet.value = ''
        wallets.value = []
       
        NetworkStateUtils.changeNetworkByIndex(parseInt(e.value.value));
      //}
    }
    const clearWalletOption = () => {
      selectedWallet.value = '';
    }

    watch(()=> networkState.availableNetworks, (availableNetworks)=>{
      let options = [];

      console.log("Network List Updated");

      for(let i=0; i < availableNetworks.length; ++i){
        options.push({ label: availableNetworks[i], value: i });
      }
      chainsNetworks.value = options;
    }, true);

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
      wallets,
      walletPassword,
      selectedWallet,
      showPasswdError,
      disableSignin,
      login,
      clearWalletOption,
      clearInput,
      chainsNetworkOption,
      selectedNetwork,
      selectNetwork
    };
  },

  components: {
    SelectInputPlugin,
    PasswordInput,
   /*  Dropdown */
  }
});
</script>