<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class='mt-6 px-6 py-10 border filter shadow-lg text-center'>
        <div class="text-md mb-3">Buy MetX</div>
        <div>
          <div class="text-xs flex items-center justify-end"><img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-4 h-4 inline-block" />&nbsp;(BEP20)&nbsp;1234....1234</div>
          <div>
            <BuyFormInput formLabel="From" :tokens="fromTokens" v-model="fromInputAmount" :selectedToken="selectedFromToken" :amount="fromAmount" @confirmedSelectToken="selectFromToken" />
            <BuyFormInput formLabel="To" :tokens="toTokens" v-model="toInputAmount" :selectedToken="selectedToToken" :amount="toAmount" @confirmedSelectToken="selectToToken" disabled="true" class="mt-5" />
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { networkState } from "@/state/networkState";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { useI18n } from 'vue-i18n';
import { availableTokens } from '@/modules/services/submodule/stacking/tokens';
import { availableToTokens } from '@/modules/services/submodule/stacking/toTokens';
import BuyFormInput from '@/modules/services/submodule/stacking/components/BuyFormInput.vue';


export default {
  name: "ViewServicesStackingBuy",
  components: {
    BuyFormInput,
  },
  setup(){
    const fromTokens = availableTokens;
    const toTokens = availableToTokens;
    const toAmount = ref(12345.54);
    const fromAmount = ref(12345.87);
    const fromInputAmount = ref(0);
    const toInputAmount = ref(0);

    const selectedFromToken = ref('USDT');
    const selectedToToken = ref('XPX');
    const selectFromToken = (token) => {
      selectedFromToken.value = token;
    }
    const selectToToken = (token) => {
      selectedToToken.value = token;
    }

    return {
      fromTokens,
      toTokens,
      toAmount,
      fromAmount,
      fromInputAmount,
      toInputAmount,
      selectedFromToken,
      selectedToToken,
      selectFromToken,
      selectToToken,
    }
  }
}
</script>