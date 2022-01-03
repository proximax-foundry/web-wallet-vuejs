<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address: acc.address}}" class= 'w-18 text-center '>Details</router-link>
        <router-link :to="{name:'ViewMultisigHome', params: { name: acc.name}}" class= 'w-18 text-center'>Multisig</router-link>
        <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>Swap</div>
      </div>
      <div class='my-7 font-semibold'>Swap this account</div>
      <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
    </div>
</div>
</template>

<script >
import {getXPXcurrencyPrice } from '@/util/functions';
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

export default {
  name: "ViewAccountSwap",
  components: {

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

    return {
      err,
      acc,
    };
  }
};
</script>
<style scoped>

</style>