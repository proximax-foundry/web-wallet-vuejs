<template>
  <div class="block text-left">
    <div class="text-xs mb-2">{{ formLabel }}</div>
    <div class="flex justify-between">
      <div>
        <img src="@/modules/services/submodule/stacking/img/tether-48.png" class="w-9 h-9 inline-block" />
        <span>USDT (BEP20)</span>
      </div>
      <div>
        <div>
          <AutoNumericVue
            :value="modelValue"
            class="supply_input"
            :options="{
              showWarnings : false,
              digitGroupSeparator: ',',
              decimalCharacter: '.',
              currencySymbol: '',
              allowDecimalPadding: false,
              decimalPlaces: 2,
              minimumValue: '0'
            }"
            @input="$emit('update:modelValue',parseFloat($event.target.value.replace(/,/g, '')) )"
            @focus="$event.target.select()"
          />
        </div>
        <div class="text-xs text-gray-400">Balance: {{ Helper.convertToCurrency(amount * 100, 2) }}</div>
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
import { Helper } from '@/util/typeHelper';
import AutoNumericVue from 'autonumeric-vue/src/components/AutoNumericVue';

export default {
  name: "BuyFormInput",
  props: {
    formLabel: String,
    amount: Number,
    modelValue: String
  },
  setup(){
    return {
      Helper
    }
  }
}
</script>
<style lang="scss" scoped>
.supply_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>