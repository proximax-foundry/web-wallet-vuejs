<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1  rounded-md">
        <div class="flex justify-between">
          <div class="flex flex-col">
            <div class="uppercase font-light text-gray-500 text-txs text-left mb-2">{{ placeholder }}</div>
            <div class="flex w-full">
                <img v-if="logo" src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
                <input 
                  :value="formattedValue"
                  class="supply_input"
                  :placeholder="placeholder" 
                  :maxlength="maxInputLimit"
                  @input="handleInput(((<HTMLInputElement>$event.target).value.replace(/,/g, '')))"
                  @keypress="handleKeypress($event,(<HTMLInputElement>$event.target).value)"
                />
            </div>
          </div>
          <button v-if="logo" :disabled="disabled == true" class="w-24 cursor-pointer focus:outline-none text-blue-primary text-xs font-bold" @click="$emit('clickedMaxAvailable', true)">{{$t('swap.maxAmount')}}</button>
            
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';


const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  decimal: {
    type: Number,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  toolTip: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  showError: {
    type: Boolean,
    required: false,
  },

  logo: {
    type: Boolean,
    required: false
  },
  balance: {
    type: Number,
    required: false
  }
});

const emit = defineEmits([
    'update:modelValue', 'show-error','clickedMaxAvailable'
  ])

const inputValue = ref(props.modelValue);
const maxDigitLimit = 16
const maxDecLimit = ref(0)
const dotInclude = ref(false)
const retainZero = ref(false)

const handleKeypress = (event: KeyboardEvent, value: string) => {
  const charCode = event.key;
  // Allow numbers (0-9) and dot (.)
  if (
    (charCode >= '0' && charCode <= '9') ||
    charCode === '.' ||
    charCode === 'Backspace' ||
    charCode === 'Delete' ||
    charCode === 'ArrowLeft' ||
    charCode === 'ArrowRight'
  ) {
    // Allow the keypress
    if (charCode === '.'){
      // If a dot already exists in the value, prevent adding another dot
      if (value.includes('.')){
        event.preventDefault();
      }
    }
    return true;
  } else {
    // Prevent the default behavior (i.e., disallow the keypress)
    event.preventDefault();
    return false;
  }
};

const countCommas = (str: string) => {
  return str.split(',').length - 1;
}

const handleInput = (value: string) => {
  if(value.includes('.')){
    if(value.includes('.0')){
      retainZero.value = true
    }
    dotInclude.value = true
  }
  else{
    dotInclude.value = false
    retainZero.value = false
  }
  // Update the input value
  if(!isNaN(parseFloat(value))){
    inputValue.value = value;
  }
  else{
    inputValue.value = "0";
  }
};

const formattedValue = computed(() => {
  let formatValue = Intl.NumberFormat("en-US", {
      maximumFractionDigits: maxDecLimit.value,
    }).format(parseFloat(inputValue.value))
  if(dotInclude.value && !formatValue.includes('.')){
    formatValue = formatValue + "."
  }
  if(retainZero.value && inputValue.value !== formatValue){
    formatValue = formatValue + "0"
  }
  return formatValue
});

const maxInputLimit = computed(() => {
  let totalMaxInputLimit = 0
  if(formattedValue.value.includes(',')){
    totalMaxInputLimit = totalMaxInputLimit + countCommas(formattedValue.value)
  }
  if(dotInclude.value){
    totalMaxInputLimit = totalMaxInputLimit + 1
  }
  return totalMaxInputLimit != 0 ? totalMaxInputLimit+maxDigitLimit : maxDigitLimit
})

watch(inputValue, (newValue, oldValue) => {
  if(newValue.includes('.')) {
    const [integerPart, decimalPart] = newValue.split('.');
    maxDecLimit.value = maxDigitLimit - integerPart.length
    if (decimalPart && decimalPart.length > maxDecLimit.value) {
      inputValue.value = oldValue;
    }
  }
  else{
    if(newValue.length > maxDigitLimit){
      inputValue.value = oldValue;
    }
  }
    emit('update:modelValue', parseFloat(inputValue.value).toString());
});

</script>
<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.supply_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter  text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>