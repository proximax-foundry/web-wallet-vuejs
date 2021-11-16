<template>
  <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40">
    <IntroTextComponent />
    <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
      <router-link :to="{ name: 'Home' }" class="text-xs m-2 text-blue-link items-center flex"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">Back</router-link>
      <div class="text-center p-5 md:p-10 text-gray-700 text-tsm">
        <div class="text-lg font-semibold">Sign in with SiriusID</div>
        <div class="md:w-64 inline-block my-5">{{$t('siriusid.qr')}}</div>
        <div class="block my-5 w-full text-center">
          <img src="@/modules/home/img/download.gif" class="w-40 inline-block">
        </div>
        <div class="md:w-64 inline-block my-5">You will be automatically signed in after scanning the QR code from your SiriusID app.</div>
        <div>{{$t('siriusid.install')}}</div>
        <div class="flex justify-center my-3">
          <a href="https://apps.apple.com/us/app/proximax-siriusid/id1496615202" target=_new class="inline-block mr-2"><img src="@/modules/home/img/app-store.png" class="w-32"></a>
          <a href="https://play.google.com/store/apps/details?id=io.proximax.siriusID" target=_new class="inline-block ml-2"><img src="@/modules/home/img/google-play.png" class="w-32"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import { useToast } from "primevue/usetoast";
import { copyToClipboard } from '@/util/functions';
import { Wallet } from "@/models/wallet";
import { Wallets } from "@/models/wallets";
import { WalletAccount } from "@/models/walletAccount";
import { WalletUtils } from '@/util/walletUtils';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';
import { ChainUtils } from '@/util/chainUtils';
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import IntroTextComponent from "@/components/IntroTextComponent";
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'ViewHomeSignInSiriusID',
  data() {
    return {
      showPK: false,
    };
  },
  components: {
    IntroTextComponent
  },
  setup(){
    const {t} = useI18n();
    const toast = useToast();
    const selectedNetwork = computed(()=> networkState.chainNetwork);
    const selectedNetworkType = computed(()=> ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    const selectedNetworkName = computed(()=> networkState.chainNetworkName );
    const err = ref("");
    const newWallet = ref();
    const walletName = ref("");
    const passwd = ref("");
    const confirmPasswd = ref("");
    const privateKey = ref("");
    const showPasswdError = ref(false);
    const passwdPattern  = "^[^ ]{8,}$";
    const copy = (id) =>{ 
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

        newWallet.value = data.wallet;
        privateKey.value = data.privateKey;
      }
    };

    const clearInput = () => {
      walletName.value = '';
      passwd.value = "";
      confirmPasswd.value = "";
    };

    return {
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
      copy
    };
  },

});
</script>
