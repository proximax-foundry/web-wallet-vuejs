<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewTransactionStatus", params: {hash: txnHash }}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='md:w-8/12 lg:w-10/12 xl:w-6/12 ml-2 mr-2 md:ml-auto md:mr-auto mt-5'>
      <div class='border-2'>
        <div class='w-full text-center border-b-2 border-gray-200 p-10'>
          <div class="text-xl">Action Required</div>
          <div class="mt-5 text-tsm">An account has added you as cosignatory account. Would you like to approve it?</div>
          <div class="mt-1 text-tsm font-bold">Deadline: 11/12/2021 23:19:54</div>
        </div>
        <div class='w-full text-center border-b-2 border-gray-200 lg:grid lg:grid-cols-3'>
          <div class="lg:h-28 lg:flex lg:items-center my-5 mb-10 lg:my-0 lg:mb-0">
            <div>
              <div class="uppercase text-blue-primary text-xs font-bold">MULTISIG-JLON</div>
              <div class="uppercase text-xs font-bold">VC5K6T-HMZXBB-XQWKLS-L4Q5BK-PXKV4H-UKJSJ2-JLON</div>
            </div>
          </div>
          <div class="lg:h-28 flex text-center justify-center">
            <div class="lg:grid lg:grid-cols-3 lg:items-center">
              <img src="@/modules/transaction/img/icon-line-sign.svg" class="rotate-90 transform mb-5 lg:mb-0 lg:-rotate-90 lg:transform-none">
              <img src="@/modules/transaction/img/icon-signature.svg" class="relative" style="top: -3px;">
              <img src="@/modules/transaction/img/icon-arrow-sign.svg" class="rotate-90 transform mt-3 lg:mt-0 lg:ml-2 lg:transform-none">
            </div>
          </div>
          <div class="lg:h-28 lg:flex lg:items-center my-5 lg:my-0">
            <div>
              <div class="inline-block uppercase text-blue-primary text-xs font-bold">My Personal Account</div>
              <div class="uppercase text-xs font-bold">VCPB4E-BOMKQA-F347JL-KE5QJQ-BQTSPV-OB6NJ7-QYGQ</div>
            </div>
          </div>
        </div>
        <div class="flex items-center h-14 lg:h-28 justify-center">
          <div class="text-gray-600 bg-white px-5 py-2 lg:px-10 lg:py-3 rounded-md text-xs lg:text-tsm inline-block border-2 border-gray-200 mr-5">Do this later</div>
          <div class="text-white bg-blue-primary px-7 py-2 lg:px-12 lg:py-3 rounded-md text-xs lg:text-tsm inline-block font-bold border-2 border-blue-primary">Approve</div>
        </div>
      </div>
      <div class='border-2 mt-5 p-3'>
        <div class="text-sm">Transaction information</div>
      </div>
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
import PkPasswordModal from '@/modules/account/components/PkPasswordModal.vue'
import PdfPasswordModal from '@/modules/account/components/PdfPasswordModal.vue'
import DeleteAccountModal from '@/modules/account/components/DeleteAccountModal.vue'
import { toSvg } from "jdenticon";
import { ThemeStyleConfig } from '@/models/stores/themeStyleConfig';

export default {
  name: "ViewTransactionSign",
  components: {
    /* TextInput, */
    // PkPasswordModal,
  },
  props: {
    txnHash: String,
  },
  setup(p) {
    const {t} = useI18n();
    const toast = useToast();
    const router = useRouter();
    const showModal = ref(false)
    // get account details
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    
    return {
      showModal,
    };
  }
};
</script>
<style scoped>
.popup-outer-create-wallet{
  
  top: 40px; left: 0; right: 0; margin-left: auto; margin-right: auto; max-width: 400px;

}
</style>