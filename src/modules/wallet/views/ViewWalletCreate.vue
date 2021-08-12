<template>
  <div class="container mx-auto text-center">
    <form
      v-if="!newWallet"
      @submit.prevent="createWallet"
    >
      <h1 class="font-bold big-title">{{$t('wallets.createWallet')}}</h1>
      <div class="mx-auto page-title-gray-line pt-5">
        <div class="w-10/12 lg:w-8/12 self-center inline-block">
          <div class="error error_box" v-if="err!=''">{{ err }}</div>
          <div class="text-left text-tsm my-4 ml-4 text-gray-600"><b>{{$t('common.network')}}</b>: {{ selectedNetworkName }}</div>
          <TextInput :placeholder="$t('wallets.walletName')" :errorMessage="$t('wallets.enterWalletName')" v-model="walletName" icon="wallet" />
          <div class="grid xs:grid-cols-1 md:grid-cols-2">
            <PasswordInput :placeholder="$t('wallets.enterPassword')" :errorMessage="$t('wallets.passwordValidation')" :showError="showPasswdError" icon="lock" v-model="passwd" class="mr-1" />
            <PasswordInput :placeholder="$t('wallets.confirmPassword')" :errorMessage="$t('wallets.doesntMatch')" :showError="showConfirmPasswdError" icon="lock" v-model="confirmPasswd" class="ml-1" />
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5" @click="clearInput();">{{$t('common.clear')}}</button>
            <button type="submit" class="default-btn disabled:opacity-50" :disabled="disableCreate">{{$t('common.create')}}</button>
          </div>
        </div>
      </div>
    </form>
    <div v-else>
      <h1 class="font-bold big-title">{{$t('common.congratz')}}!</h1>
      <p class="mt-2">{{$t('wallets.congratzText')}}</p>
      <div class="mx-auto page-title-gray-line pt-5 lg:px-20">
        <div class="text-xl mb-5">{{ walletName }}</div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('common.address')}}:</div>
            <div
              id="address" :copyValue="newWallet.address" copySubject="Address"
              class="text-sm w-full outline-none bg-gray-100 z-10 break-all"
            >{{ newWallet.address }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('address', addressLabel)" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('common.publicKey')}}:</div>
            <div
              id="public" :copyValue="newWallet.publicKey" copySubject="Public Key"
              class="text-sm w-full outline-none bg-gray-100 z-10 break-all"
            >{{ newWallet.publicKey }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('public')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center" v-if="showPK">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('common.privateKey')}}:</div>
            <div
              id="private" :copyValue="privateKey" copySubject="Private Key"
              class="text-sm w-full outline-none bg-gray-100 z-10 break-all" 
            >{{ privateKey }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
          <div class="text-center w-full">
            <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4 relative">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block absolute" style="left: 12px; top: 6px;"></font-awesome-icon>
            </div>
            <p>{{$t('common.warningText1')}}.</p>
            <p>{{$t('common.warningText2')}}.</p>
          </div>
        </div>
        <div class="inline-block mt-10 w-full">
          <div class="grid xs:grid-cols-1 md:grid-cols-3">
            <div class="px-5 self-center">
              <a class="block big-default-btn my-3 self-center w-full" @click="showPK = !showPK">{{ showPK? $t('common.hide'):$t('common.show') }} {{$t('common.privateKey')}}</a>
            </div>
            <div class="px-5">
              <a class="block big-default-btn my-3 self-center w-full">{{$t('common.saveWalletPaper')}}</a>
            </div>
            <div class="px-5 self-center"><router-link :to="{name: 'Home'}" class="block big-default-btn my-3 self-center">{{$t('common.continue')}}</router-link></div>
          </div>
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

export default defineComponent({
  name: 'ViewWalletCreate',
  components: {
    TextInput,
    PasswordInput
  },
  data() {
    return {
      showPK: false,
    };
  },
  setup(){
    const {t} = useI18n();
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
    const copy = (id :string) =>{ 
      let stringToCopy = document.getElementById(id).getAttribute("copyValue");
      let copySubject = document.getElementById(id).getAttribute("copySubject");
      copyToClipboard(stringToCopy);
     if (copySubject === "Private Key"){
        toast.add({severity:'info', detail: t('common.privateKey') + ' ' + t('common.copied'), group: 'br', life: 3000});
      }else if (copySubject === "Address"){
        toast.add({severity:'info', detail:  t('common.address') + ' ' + t('common.copied'), group: 'br', life: 3000});
      }else{
        toast.add({severity:'info', detail:  t('common.publicKey') + ' ' + t('common.copied'), group: 'br', life: 3000});
      }
    
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
        err.value = t('wallets.walletNameTaken');
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
