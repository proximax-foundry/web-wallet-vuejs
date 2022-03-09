<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="acc.address" class="mb-10" />
      <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address: acc.address}}" class= 'w-32 text-center '>{{$t('account.accountDetails')}}</router-link>
         <router-link :to="{name:'ViewAccountAssets', params: { name: acc.address}}" class= 'w-18 text-center'>{{$t('general.asset',2)}}</router-link>
        <router-link :to="{name:'ViewMultisigHome', params: { name: acc.name}}" class= 'w-18 text-center'>{{$t('general.multisig')}}</router-link>
        <router-link v-if="isMultiSig" :to="{name:'ViewMultisigScheme', params: { address: acc.address}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
        <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>{{$t('general.swap')}}</div>
        <MoreAccountOptions :address="acc.address"/>
      </div>
      <div class='my-7 font-semibold'>{{$t('nis1.nis1Swap')}}</div>
      <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
      <div v-if="!boolNIS1Enabled">
        <div class="text-xs">{{$t('nis1.enableSwap')}}</div>
        <SwapAccountModal :address="address" @enable-nis1-swap="enableNis1" />
      </div>
      <div v-else>
        <div class="text-xs">{{$t('nis1.disableSwap')}}</div>
        <div class="text-xs mt-2">{{$t('nis1.nis1Address')}} <span>{{ nis1Address }}</span></div>
        <div class="bg-gray-200 text-black text-xs px-5 py-2 rounded cursor-pointer mt-5 inline-block" @click="disableNIS1Swap">{{$t('general.disable')}}</div>
      </div>
    </div>
</div>
</template>

<script >
import {getXPXcurrencyPrice } from '@/util/functions';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { watch, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import TextInput from "@/components/TextInput.vue";
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { walletState } from "@/state/walletState";
import { Helper } from "@/util/typeHelper";
import { networkState } from "@/state/networkState";
import { WalletUtils } from "@/util/walletUtils";
import { useI18n } from 'vue-i18n';
import { pdfWalletPaperImg } from '@/modules/account/pdfPaperWalletBackground';
import jsPDF from 'jspdf';
import qrcode from 'qrcode-generator';
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';
import SwapAccountModal from '@/modules/account/components/SwapAccountModal.vue'
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
export default {
  name: "ViewAccountSwap",
  components: {
    AccountComponent,
    SwapAccountModal,
    MoreAccountOptions
  },
  props: {
    address: String,
  },
  setup(p) {
    const {t} = useI18n();
    const toast = useToast();
    const router = useRouter();
    const err = ref('');

    var acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == p.address);
    if(!acc){
      acc = walletState.currentLoggedInWallet.others.find((add) => add.address == p.address);
    }

    const nis1Address = computed(() => {
      return acc.nis1Account.address;
    });

    const enableNis1 = () => {
      console.log('Enabled')
    }

    const boolNIS1Enabled = computed(() => {
      if(acc.nis1Account){
        return true;
      }else{
        return false;
      }
    });

    const isMultiSig = computed(() => {
      let isMulti = acc.getDirectParentMultisig().length? true: false
      return isMulti;
    });

    const disableNIS1Swap = () => {
      acc.nis1Account = null;
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
    }

    return {
      err,
      acc,
      enableNis1,
      nis1Address,
      boolNIS1Enabled,
      disableNIS1Swap,
      isMultiSig,
    };
  }
};
</script>
<style scoped>

</style>