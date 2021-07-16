<template>
  <div class="container mx-auto text-center">
    <form
      v-if="!newWallet"
      @submit.prevent="createWallet"
    >
      <h1 class="font-bold big-title">{{$t('createwallet.createwallet')}}</h1>
      <div class="mx-auto page-title-gray-line pt-15">
        <p>{{$t('createprivatekeywallet.title')}}</p>
        <div class="w-10/12 lg:w-8/12 self-center inline-block">
          <div class="error error_box" v-if="err!=''">{{ err }}</div>
          <div class="text-left text-tsm my-4 ml-4 text-gray-600"><b>{{$t('createwallet.network')}}</b>: {{ selectedNetworkName }}</div>
          <PasswordInput :placeholder="$t('createprivatekeywallet.privatekey')" :errorMessage="$t('createprivatekeywallet.invalidprivatekey')" icon="key" v-model="privateKeyInput" class="ml-1" />
          <label class="inline-flex items-center mb-5">
              <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="nis1Swap">
            <span class="ml-2 cursor-pointer">{{$t('createprivatekeywallet.swaptitle')}}</span>
          </label>
          <TextInput :placeholder="$t('createwallet.walletname')" :errorMessage="$t('createwallet.inputwalletname')"  v-model="walletName" icon="wallet" />
          <div class="grid xs:grid-cols-1 md:grid-cols-2">
            <PasswordInput :placeholder="$t('createwallet.inputpassword')" :errorMessage="$t('createwallet.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="passwd" class="mr-1" />
            <PasswordInput  :placeholder="$t('createwallet.confirmpassword')" :errorMessage="$t('createwallet.confirmpassword')" :showError="showConfirmPasswdError" icon="lock" v-model="confirmPasswd" class="ml-1" />
          </div>
          <div class="mt-10">
            <button type="button" class="default-btn mr-5" @click="clearInput();">{{$t('signin.clear')}}</button>
            <button type="submit" class="default-btn disabled:opacity-50" :disabled="disableCreate">{{$t('welcome.create')}}</button>
          </div>
        </div>
      </div>
    </form>
    <div v-else>
      <h1 class="font-bold big-title">{{$t('createsuccessful.congratz')}}</h1>
      <p class="mt-2">{{$t('createsuccessful.congratztext')}}</p>
      <div class="mx-auto page-title-gray-line pt-5 lg:px-20">
        <div class="text-xl mb-5">{{ newWallet.name }}</div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('createsuccessful.address')}}:</div>
            <div
              id="address"
              class="text-sm w-full outline-none bg-gray-100 z-10 break-all" :copyValue="newWallet.address" copySubject="Address"
            >{{ newWallet.address }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('address', addressLabel)" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('accounts.publickey')}}:</div>
            <div
              id="public"
              class="text-sm w-full outline-none bg-gray-100 z-10 break-all" :copyValue="newWallet.publicKey" copySubject="Public Key"
            >{{ newWallet.publicKey }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('public')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center" v-if="showPK">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('createprivatekeywallet.privatekey')}}:</div>
            <div
              id="private"
              class="text-sm w-full outline-none bg-gray-100 z-10 break-all" :copyValue="privateKey" copySubject="Private Key"
            >{{ privateKey }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('private')" class="w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4">
          <div class="text-center w-full">
            <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4 relative">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block absolute" style="left: 12px; top: 6px;"></font-awesome-icon>
            </div>
            <p>{{$t('createsuccessful.warningtext1')}}.</p>
            <p>{{$t('createsuccessful.warningtext2')}}.</p>
          </div>
        </div>
        <div class="inline-block mt-10 w-full">
          <div class="grid xs:grid-cols-1 md:grid-cols-3">
            <div class="px-5 self-center">
              <a class="block big-default-btn my-3 self-center w-full" @click="showPK = !showPK">{{ showPK?'Hide':'Show' }} {{$t('createprivatekeywallet.privatekey')}}</a>
            </div>
            <div class="px-5">
              <a class="block big-default-btn my-3 self-center w-full">{{$t('createsuccessful.savewalletpaper')}}</a>
            </div>
            <div class="px-5 self-center"><router-link :to="{name: 'Home'}" class="block big-default-btn my-3 self-center">{{$t('createsuccessful.continue')}}</router-link></div>
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

export default defineComponent({
  name: 'ViewWalletCreatePrivateKey',
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
    const toast = useToast();
    const selectedNetwork = computed(()=> ChainUtils.getNetworkType(networkState.chainNetwork));
    const selectedNetworkType = computed(()=> ChainUtils.getNetworkType(networkState.currentNetworkProfile.network.type));
    const selectedNetworkName = computed(()=> networkState.chainNetworkName );
    const err = ref("");
    const newWallet = ref<unknown>("");
    const walletName = ref("");
    const passwd = ref("");
    const privateKey = ref("");
    const confirmPasswd = ref("");
    const nis1Swap = ref(false);
    const privateKeyInput = ref("");
    const showPasswdError = ref(false);
    const privKeyPattern = "^(0x|0X)?[a-fA-F0-9].{63,65}$";
    const passwdPattern = "^[^ ]{8,}$";
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
          confirmPasswd.value === passwd.value &&
          privateKeyInput.value.match(privKeyPattern)
      )
    );

    // true to show error
    const showConfirmPasswdError = computed(
      () => (confirmPasswd.value != passwd.value && confirmPasswd.value != '')
    );

    const createWallet = () => {
      err.value = "";
      let result = 0;
      let wallets = new Wallets();

      if(wallets.filterByNetworkNameAndName(selectedNetworkName.value, walletName.value)){
        err.value = "Wallet name is already taken";
      }else{
        let password = WalletUtils.createPassword(passwd.value);

        const walletAccount = WalletUtils.addNewWalletWithPrivateKey(walletState.wallets, privateKeyInput.value, password, walletName.value, selectedNetworkName.value, selectedNetworkType.value);

        privateKey.value = privateKeyInput.value;
        newWallet.value = walletAccount;
      }
    };

    const clearInput = () => {
      walletName.value = '';
      passwd.value = "";
      confirmPasswd.value = "";
      privateKeyInput.value = "";
      nis1Swap.value = false;
    };

    return {
      err,
      newWallet,
      selectedNetwork,
      selectedNetworkName,
      walletName,
      passwd,
      confirmPasswd,
      nis1Swap,
      privateKeyInput,
      privateKey,
      showPasswdError,
      showConfirmPasswdError,
      passwdPattern,
      privKeyPattern,
      createWallet,
      disableCreate,
      clearInput,
      copy
    };
  },
});
</script>
