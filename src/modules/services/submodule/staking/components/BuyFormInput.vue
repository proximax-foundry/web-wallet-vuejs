<template>
  <div class="block text-left">
    <div class="text-xs mb-2">{{ formLabel }}</div>
    <div class="flex justify-between">
      <div class="flex items-center cursor-pointer" @click="isDisplayBuyTokenModal = true">
        <font-awesome-icon icon="caret-down" class="mr-1 text-gray-700" />
        <img :src="'/src/modules/services/submodule/staking/img/tokens/' + tokenImage"
          class="w-9 h-9 inline-block" />
        <div class="ml-1 text-tsm">{{ tokenName }} {{ tokenType }}</div>
      </div>
      <div>
        <div>
          <input 
            :value="modelValue" 
            class="supply_input disabled:opacity-70" 
            v-maska:[options]
            :data-maska="maskaFormat()"
            data-maska-tokens="0:\d:multiple|9:\d:optional"
            :placeholder="''"
            @input="$emit('update:modelValue', parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')))"
            @focus="(<HTMLInputElement>$event.target).select()" :disabled="disabled ? disabled : false" />
        </div>
        <div class="text-xs text-gray-400 text-right">Balance: {{ Helper.toCurrencyFormat(tokenBalance, 3) }}</div>
      </div>
    </div>
    <SelectTokenModal @closeModal="isDisplayBuyTokenModal = false" @selectToken="setToken" :tokens="tokens"
      :toggleModal="isDisplayBuyTokenModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Helper } from '@/util/typeHelper';
import SelectTokenModal from '@/modules/services/submodule/staking/components/SelectTokenModal.vue';
// import { availableTokens } from '@/modules/services/submodule/staking/tokens';

  const props = defineProps({
    formLabel: String,
    amount: Number,
    modelValue: Number,
    selectedToken: {
      type: String,
      required: true
    },
    tokens: {
      type: Array<{ name: string, balance: number, img: string }>,
      required: true
    },
    tokenType: String,
    disabled: Boolean
  })

  const decimal =ref(6)

  const emit = defineEmits(['confirmedSelectToken', 'update:modelValue'])

  const tokenName = computed(() => {
    let checkTokenName = props.tokens.find(token => token.name === props.selectedToken)
    if (checkTokenName) {
      return checkTokenName.name;
    }
  });

  const tokenImage = computed(() => {
    let checkTokenImage = props.tokens.find(token => token.name === props.selectedToken)
    if (checkTokenImage) {
      return checkTokenImage.img;
    }
  });

  const tokenBalance = ref(0);

  const isDisplayBuyTokenModal = ref(false);
  const setToken = (tokenName: string) => {
    isDisplayBuyTokenModal.value = false;
    let checkTokenBalance = props.tokens.find(token => token.name === tokenName)
    if (checkTokenBalance) {
      tokenBalance.value = checkTokenBalance.balance;
    }
    emit('confirmedSelectToken', tokenName);
  }

  const updateSeletectedTokenBalance = (tokenName: string) => {
    let checkTokenBalance = props.tokens.find(token => token.name === tokenName)
    if (checkTokenBalance) {
      tokenBalance.value = checkTokenBalance.balance;
    }
  }

  const maskaFormat = () => {
  let maskaFormat = "0";
  if (decimal.value > 0) {
    maskaFormat = maskaFormat + "." + "9".repeat(decimal.value);
  }
  return maskaFormat;
};
const options = {
  preProcess: (val: string) => {
    return val.replace(/,/g, "");
  },
  postProcess: (val: string) => {
    if (!val) return "";
    let sub = 0;
    if (decimal.value > 0) {
      sub =
        1 +
        decimal.value -
        (val.includes(".") ? val.length - val.indexOf(".") : 0);
    }
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimal.value,
    })
      .format(parseFloat(val))
      .slice(0, sub ? -sub : undefined);
  },
};

  defineExpose({ updateSeletectedTokenBalance })

  updateSeletectedTokenBalance(props.selectedToken);

  watch(props, (newProps) => {
    let checkTokenBalance = newProps.tokens.find(token => token.name === newProps.selectedToken)
    if (checkTokenBalance) {
      tokenBalance.value = checkTokenBalance.balance;
    }
  }, { deep: true })

</script>
<style lang="scss" scoped>
.supply_input {
  @apply flex border-0 border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50 mb-1 text-right;
}
</style>