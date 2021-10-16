<template>
<div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 ">
    <IntroTextComponent />
    <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
      <router-link :to="{ name: 'Home' }" class="text-xs m-2 text-blue-link items-center flex"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">Back</router-link>
       <form
      v-if="!newWallet"
      @submit.prevent="createWallet"
      >
      <div class="text-sm text-center mt-20 mb-6">Create Wallet</div>
      <div class="w-7/12 ml-auto mr-auto">
        <div class="error error_box" v-if="err!=''">{{ err }}</div>
        <TextInput  placeholder="Name your wallet" :errorMessage="$t('createwallet.inputwalletname')" v-model="walletName" icon="wallet" />
        <PasswordInput placeholder="Password" :errorMessage="$t('createwallet.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="passwd"  />
        <PasswordInput placeholder="Confirm Password" :errorMessage="$t('createwallet.doesntmatch')" :showError="showConfirmPasswdError" icon="lock" v-model="confirmPasswd"  />
        <div class = 'mt-6 text-center text-xs'>Current Network: </div>
        <div class = 'text-center'>{{networkState.chainNetworkName}}</div>
      </div>
      <button type="submit" class="text-center mt-5 font-bold default-btn block ml-auto mr-auto w-7/12 disabled:opacity-50" :disabled="disableCreate">{{$t('welcome.create')}}</button>
       
        <div class ='mt-12 text-center text-xs mt-6 mb-1'>Already have Sirius wallet account?</div>
        <div class ="text-center  text-xs text-blue-link"><router-link :to="{ name: 'Home' }">Sign in here ></router-link></div>
      <div class = 'h-20'></div>
      </form>
      <div v-else>
      <h1 class="font-bold big-title">{{$t('createsuccessful.congratz')}}!</h1>
      <p class="mt-2">{{$t('createsuccessful.congratztext')}}</p>
      <div class="mx-auto page-title-gray-line pt-5 lg:px-20">
        <div class="text-xl mb-5">{{ walletName }}</div>
        <div class="flex justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('createsuccessful.address')}}:</div>
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
            <div class="text-xs font-bold mb-1">{{$t('accounts.publickey')}}:</div>
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
            <div class="text-xs font-bold mb-1">{{$t('createprivatekeywallet.privatekey')}}:</div>
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
            <p>{{$t('createsuccessful.warningtext1')}}</p>
            <p>{{$t('createsuccessful.warningtext2')}}</p>
          </div>
        </div>
        <div class="inline-block mt-10 w-full">
          <div class="grid xs:grid-cols-1 md:grid-cols-3">
            <div class="px-5 self-center">
              <a class="block big-default-btn my-3 self-center w-full" @click="showPK = !showPK">{{ showPK? $t('createsuccessful.hide'):$t('createsuccessful.show') }} {{$t('createprivatekeywallet.privatekey')}}</a>
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

export default defineComponent({
  name: 'ViewWalletCreate',
  components: {
    IntroTextComponent,
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
      copy
    };
  },

});
</script>
