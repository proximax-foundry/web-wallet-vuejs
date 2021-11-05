<template>
 <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 ">
    <IntroTextComponent />
    <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
      <router-link v-if="!newWallet" :to="{ name: 'ViewWalletCreateSelection' }" class="text-xs m-2 text-blue-link items-center flex"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">Back</router-link>
       <form
      v-if="!newWallet"
      @submit.prevent="createWallet"
    >
      <div class="text-sm text-center mt-20">Create Wallet</div>
      <div class="text-xs text-center text-blue-link mb-5">FROM A PRIVATE KEY</div>
        <p class = 'w-9/12 ml-auto mr-auto text-xs text-center'>Restore your existing ProximaX Sirius Wallet, import a private key from another service or create a new wallet.</p>
      <div class="mt-4 w-7/12 ml-auto mr-auto">
          <div class="error error_box" v-if="err!=''">{{ err }}</div>
          <PasswordInput :placeholder="$t('createprivatekeywallet.privatekey')" :errorMessage="$t('createprivatekeywallet.invalidprivatekey')" icon="key" v-model="privateKeyInput"  />
          <!-- <label class="inline-flex items-center mb-5">
              <input type="checkbox" class="h-5 w-5 bg-blue-primary" v-model="nis1Swap">
            <span class="ml-2 cursor-pointer">{{$t('createprivatekeywallet.swaptitle')}}</span>
          </label> -->
          <TextInput :placeholder="$t('createwallet.walletname')" :errorMessage="$t('createwallet.inputwalletname')"  v-model="walletName" icon="wallet" />
          
          <PasswordInput :placeholder="$t('createwallet.inputpassword')" :errorMessage="$t('createwallet.passwordvalidation')" :showError="showPasswdError" icon="lock" v-model="passwd"  />
          <PasswordInput  :placeholder="$t('createwallet.confirmpassword')" :errorMessage="$t('createwallet.confirmpassword')" :showError="showConfirmPasswdError" icon="lock" v-model="confirmPasswd" />
          <div class = 'text-center text-xs'>Current Network: </div>
          <div class = 'text-center'>{{networkState.chainNetworkName}}</div>
        </div>
        <button type="submit" class="text-center mt-5 font-bold default-btn block ml-auto mr-auto w-7/12 disabled:opacity-50" :disabled="disableCreate">{{$t('welcome.create')}}</button>
        <div class ='mt-12 text-center text-xs mt-6 mb-1'>Already have Sirius wallet account?</div>
        <div class ="text-center  text-xs text-blue-link"><router-link :to="{ name: 'Home' }">Sign in here ></router-link></div>
        <div class = 'h-20'></div>
    </form>
      <div v-else>
      <h1 class="text-sm mb-2 mt-8 text-center">{{$t('createsuccessful.congratz')}}</h1>
      <p class="text-xs text-center mb-1">{{$t('createsuccessful.congratztext')}}.</p>
        <div class="text-base mb-5 text-center">{{ walletName }}</div>
        <div class="flex w-9/12 mr-auto ml-auto justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('createsuccessful.address')}}:</div>
            <div
              id="address"
              class="text-xs w-full outline-none bg-gray-100 z-10 break-all" :copyValue="newWallet.address" copySubject="Address"
            >{{ newWallet.address }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('address', addressLabel)" class="pl-1 w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex w-9/12 mr-auto ml-auto justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('accounts.publickey')}}:</div>
            <div
              id="public"
              class="text-xs w-full outline-none bg-gray-100 z-10 break-all" :copyValue="newWallet.publicKey" copySubject="Public Key"
            >{{ newWallet.publicKey }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('public')" class="pl-1 w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
        <div class="flex w-9/12 mr-auto ml-auto justify-between p-4 rounded-xl bg-gray-100 mb-4 items-center" v-if="showPK">
          <div class="text-left w-full relative">
            <div class="absolute z-20 w-full h-full"></div>
            <div class="text-xs font-bold mb-1">{{$t('createprivatekeywallet.privatekey')}}:</div>
            <div
              id="private"
              class="text-xs w-full outline-none bg-gray-100 z-10 break-all" :copyValue="privateKey" copySubject="Private Key"
            >{{ privateKey }}</div>
          </div>
          <font-awesome-icon icon="copy" @click="copy('private')" class="pl-1 w-5 h-5 text-gray-500 cursor-pointer inline-block"></font-awesome-icon>
        </div>
         <div class="flex w-9/12 mr-auto ml-auto justify-between p-4 rounded-xl bg-yellow-100 mb-4">
          <div class="text-center w-full">
            <!-- <div class="border border-yellow-600 rounded-full w-8 h-8 inline-block mb-4 relative">
              <font-awesome-icon icon="exclamation" class="w-5 h-5 text-yellow-600 inline-block absolute" style="left: 12px; top: 6px;"></font-awesome-icon>
            </div> -->
            <p class = 'text-xs'>{{$t('createsuccessful.warningtext1')}}</p>
            <p class = 'text-xs'>{{$t('createsuccessful.warningtext2')}}</p>
          </div>
        </div>
         <a class="mt-5 font-bold text-center default-secondary-btn block ml-auto mr-auto w-9/12" @click="showPK = !showPK">{{ showPK? $t('createsuccessful.hide'):$t('createsuccessful.show') }} {{$t('createprivatekeywallet.privatekey')}}</a>
        <a class="mt-3 font-bold text-center default-secondary-btn block ml-auto mr-auto w-9/12">{{$t('createsuccessful.savewalletpaper')}}</a>
        <router-link :to="{name: 'Home'}" class="mt-3 font-bold text-center default-btn block ml-auto mr-auto w-9/12">{{$t('createsuccessful.continue')}}</router-link>
        <div class = 'h-10'></div>
       <!--  <div class="inline-block mt-10 w-full">
          <div class="grid xs:grid-cols-1 md:grid-cols-3">
            <div class="px-5 self-center">
              <a class="block big-default-btn my-3 self-center w-full" @click="showPK = !showPK">{{ showPK? $t('createsuccessful.hide'):$t('createsuccessful.show') }} {{$t('createprivatekeywallet.privatekey')}}</a>
            </div>
            <div class="px-5">
              <a class="block big-default-btn my-3 self-center w-full">{{$t('createsuccessful.savewalletpaper')}}</a>
            </div>
            <div class="px-5 self-center"><router-link :to="{name: 'Home'}" class="block big-default-btn my-3 self-center">{{$t('createsuccessful.continue')}}</router-link></div>
          </div>
        </div> -->
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
  name: 'ViewWalletCreatePrivateKey',
  components: {
    TextInput,
    PasswordInput,
    IntroTextComponent
  },
  data() {
    return {
      showPK: false,
    };
  },

  setup(){
    const {t} = useI18n();
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
        err.value = t('scriptvalues.walletnametaken');
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
    };

    return {
      networkState,
      err,
      newWallet,
      selectedNetwork,
      selectedNetworkName,
      walletName,
      passwd,
      confirmPasswd,
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
