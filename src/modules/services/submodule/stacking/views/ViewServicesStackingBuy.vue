<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 px-6 py-10 border filter shadow-lg text-center'>
        <div class="text-md mb-3">Buy MetX</div>
        <div>
          <div class="text-xs flex items-center justify-end"><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-4 h-4 inline-block" />&nbsp;(BEP20)&nbsp;1234....1234</div>
          <div>
            <BuyFormInput formLabel="From" v-model="fromInputAmount" :amount="fromAmount" @displayTokenOptions="isDisplayBuyTokenModal = true" />
            <BuyFormInput formLabel="To" v-model="toInputAmount" :amount="toAmount" class="mt-5" />
          </div>
        </div>
      </div>
    </div>
    <SelectTokenModal @closeModal="isDisplayBuyTokenModal = false" :toggleModal="isDisplayBuyTokenModal" />
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { networkState } from "@/state/networkState";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { useI18n } from 'vue-i18n';
import BuyFormInput from '@/modules/services/submodule/stacking/components/BuyFormInput.vue';
import SelectTokenModal from '@/modules/services/submodule/stacking/components/SelectTokenModal.vue';

export default {
  name: "ViewServicesStackingBuy",
  components: {
    BuyFormInput,
    SelectTokenModal
},
  setup(){
    const toAmount = ref(12345.54);
    const fromAmount = ref(12345.87);
    const fromInputAmount = ref(0);
    const toInputAmount = ref(0);
    const isDisplayBuyTokenModal = ref(false);

    return {
      toAmount,
      fromAmount,
      fromInputAmount,
      toInputAmount,
      isDisplayBuyTokenModal,
    }
  }
}
</script>