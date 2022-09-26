<template>
  <div class="block text-left">
    <div class="text-xs mb-2">{{ formLabel }}</div>
    <div class="flex justify-between">
      <div class="flex items-center cursor-pointer" @click="isDisplayBuyTokenModal = true">
        <font-awesome-icon icon="caret-down" class="mr-1 text-gray-700" />
        <img :src="require('@/modules/services/submodule/stacking/img/tokens/' + tokenImage)" class="w-9 h-9 inline-block" />
        <div class="ml-1 text-tsm">{{ tokenName }} (BEP20)</div>
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
              minimumValue: '0',
              maximumValue: tokenBalance,
            }"
            @input="$emit('update:modelValue',parseFloat($event.target.value.replace(/,/g, '')) )"
            @focus="$event.target.select()"
            :disabled="disabled?disabled:false"
          />
        </div>
        <div class="text-xs text-gray-400 text-right">Balance: {{ Helper.convertToCurrency(tokenBalance * 100, 2) }}</div>
      </div>
    </div>
    <SelectTokenModal @closeModal="isDisplayBuyTokenModal = false" @selectToken="setToken" :tokens="tokens" :toggleModal="isDisplayBuyTokenModal" />
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
import SelectTokenModal from '@/modules/services/submodule/stacking/components/SelectTokenModal.vue';
import { boolean } from 'mathjs';
// import { availableTokens } from '@/modules/services/submodule/stacking/tokens';

export default {
  name: "BuyFormInput",
  props: {
    formLabel: String,
    amount: Number,
    modelValue: Number,
    selectedToken: String,
    tokens: Array,
    disabled: boolean
  },
  components:{
    AutoNumericVue,
    SelectTokenModal
  },
  emits:[
    'confirmedSelectToken', 'update:modelValue'
  ],
  setup(props, { emit }){

    const tokenName = computed(() => {
      return props.tokens.find(token => token.name === props.selectedToken).name;
    });

    const tokenImage = computed(() => {
      return props.tokens.find(token => token.name === props.selectedToken).img;
    });

    const tokenBalance = computed(() => {
      return props.tokens.find(token => token.name === props.selectedToken).balance;
    });

    const displayTokenOption = () => {
      emit('displayTokenOptions')
    }

    const isDisplayBuyTokenModal = ref(false);
    const setToken = (token) => {
      isDisplayBuyTokenModal.value = false;
      emit('confirmedSelectToken', token);
    }

    return {
      isDisplayBuyTokenModal,
      displayTokenOption,
      Helper,
      tokenName,
      tokenImage,
      tokenBalance,
      setToken,
    }
  }
}
</script>
<style lang="scss" scoped>
.supply_input{
  @apply flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50 mb-1 text-right;
}
</style>