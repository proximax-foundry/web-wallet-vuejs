<template>
<div>
  <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40  gap-4">
      <IntroTextComponent />
      <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
        <router-link v-if="!newWallet" :to="{ name: 'ViewWalletCreateSelection' }" class="text-xs m-2 text-blue-link items-center flex"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">Back</router-link>
        <form
        @submit.prevent="createWallet"
        >
        <div class="text-sm text-center mt-20 mb-6 font-semibold">Create Wallet</div>
        <div class='w-8/12 ml-auto mr-auto'>
          <div class="error error_box " v-if="err!=''">{{ err }}</div>
        </div>
        <SelectNetworkInput />
        <div class="w-8/12 ml-auto mr-auto mt-3">
          <TextInput  placeholder="Name your wallet" :errorMessage="$t('createwallet.inputwalletname')" v-model="walletName" icon="wallet" />
          <PasswordInput class="mt-3" placeholder="Password" :errorMessage="$t('createwallet.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="passwd"  />
          <PasswordInput  class="mt-3" placeholder="Confirm Password" :errorMessage="$t('createwallet.doesntmatch')" :showError="showConfirmPasswdError" icon="lock" v-model="confirmPasswd"  />
        </div>
        <button type="submit" class="text-center mt-3 font-bold blue-btn py-3 block ml-auto mr-auto w-8/12 disabled:opacity-50" :disabled="disableCreate">Create Wallet</button>
        
          <div class ='mt-12 text-center text-xs  mb-1 '>Already have Sirius wallet account?</div>
          <div class ="text-center  text-xs text-blue-link font-semibold"><router-link :to="{ name: 'Home' }">Sign in here ></router-link></div>
        <div class = 'h-20'></div>
        </form>
        <div v-if='showModal' >
          <transition
            enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutUp"
          >
            <div class="popup-outer-create-wallet absolute flex z-50">
              <div class="modal-popup-box ">
                <img src='@/assets/img/icon-blue-tick.svg' class='h-5 w-5 ml-auto mr-auto mb-3'>
                <div class= 'text-center mt-2 text-xs font-semibold'>Account Creation Successful</div>
                <div class ='text-gray-500 text-center text-xs mt-2'>Should you wish to get testnet {{ currentNativeTokenName }} amount, you can top up every 24 hours in your account.</div>
                <div class='flex flex-wrap content-center'>
                  <router-link :to="{name:'Home'}" class= ' mt-4 w-4/12 ml-auto mr-auto text-center  blue-btn cursor-pointer font-semibold text-xs py-2 px-2 mt-2 font-semibold mb-3' >Close</router-link>
                </div>
              </div>
            </div>
          </transition>
          <div class="fixed inset-0 bg-opacity-60 z-10 bg-gray-100"></div>
        </div>
      </div>
    </div>
 </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useToast } from "primevue/usetoast";
import TextInput from '@/components/TextInput.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { copyToClipboard } from '@/util/functions';
import { Wallet } from "@/models/wallet";
import { Wallets } from "@/models/wallets";
import { WalletAccount } from "@/models/walletAccount";
import { WalletUtils } from '@/util/walletUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import {useI18n} from 'vue-i18n'
import IntroTextComponent from '@/components/IntroTextComponent.vue'
import SelectNetworkInput from '@/components/SelectNetworkInput.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'ViewWalletCreate',
  components: {
    IntroTextComponent,
    TextInput,
    PasswordInput,
    SelectNetworkInput
  },
  data() {
    return {
      showPK: false,
    };
  },
  setup(){
    const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
    const {t} = useI18n();
    const router = useRouter();
    const toast = useToast();
    const selectedNetwork = computed(()=> networkState.chainNetwork);
    const selectedNetworkType = computed(()=> ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    const selectedNetworkName = computed(()=> networkState.chainNetworkName );
    const err = ref<string>("");
    const newWallet = ref<unknown>();
    const walletName = ref<string>("");
    const passwd = ref<string>("");
    const confirmPasswd = ref<string>("");
    const privateKey = ref<string>("");
    const showPasswdError = ref<boolean>(false);
    const passwdPattern: string  = "^[^ ]{8,}$";
    const showModal = ref(false)
    const copy = (id :string) =>{ 
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
      toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
    };
    const disableCreate = computed(
      () => !(
        walletName.value !== "" &&
          passwd.value.match(passwdPattern) &&
          confirmPasswd.value === passwd.value
      )
    );

    // true to show error
    const showConfirmPasswdError = computed(
      () => (confirmPasswd.value != passwd.value && confirmPasswd.value != '')
    );

    const createWallet = () => {
      err.value = "";
      let result = 0;

      if(walletState.wallets.filterByNetworkNameAndName(selectedNetworkName.value, walletName.value)){
        err.value = t('scriptvalues.walletnametaken');
      }else{
        let password = WalletUtils.createPassword(passwd.value);
        
        const data = WalletUtils.addNewWallet(walletState.wallets, password, walletName.value, selectedNetworkName.value, selectedNetworkType.value);
        /* router.push({ name: "Home"}); */
        newWallet.value = data.wallet;
        privateKey.value = data.privateKey;
        showModal.value=true
      }
    };

    const clearInput = () => {
      walletName.value = '';
      passwd.value = "";
      confirmPasswd.value = "";
    };

    return {
      showModal,
      networkState,
      err,
      newWallet,
      selectedNetwork,
      selectedNetworkName,
      walletName,
      passwd,
      privateKey,
      confirmPasswd,
      showPasswdError,
      showConfirmPasswdError,
      passwdPattern,
      createWallet,
      disableCreate,
      clearInput,
      copy,
      currentNativeTokenName,
    };
  },

});
</script>
<style scoped>
.popup-outer-create-wallet{
  
  top: 40px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 400px;

}
</style>