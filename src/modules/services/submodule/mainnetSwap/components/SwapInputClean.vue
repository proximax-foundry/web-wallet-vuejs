<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md ">
      <div class=" uppercase text-gray-500 text-txs  text-left mb-1">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{ value: '<tiptext>' + toolTip + '</tiptext>', escape: false }" v-if="toolTip"></div>
      <div class="flex justify-between items-center">
        <input
        :value="formattedValue"
        class="supply_input"
        :placeholder="placeholder"
        @keyup="checkBalance($event), validateInput($event)"
        @input="handleInput(parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')).toString())"
        @keypress="handleKeypress($event,(<HTMLInputElement>$event.target).value)"
        @blur="handleBlur($event)"
      />
        <button :disabled="disabled == true" class="w-24 cursor-pointer focus:outline-none text-blue-primary text-xs font-bold" @click="showRemark();$emit('clickedMaxAvailable', true);clearAllError()">{{$t('swap.maxAmount')}}</button>
      </div>
    </div>
    <div class="h-3 mb-2 error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
    <div class="h-3 mb-2 error error-text text-left" v-if="emptyErr">{{ emptyErrorMessage }}</div>
    <div class="text-gray-600 text-xs mr-3 my-1 mb-5 text-left" v-if="isShowRemark==true && remarkOption">{{$t('swap.inputRemark1')}} <b>{{ transactionFee }} xpx</b> {{$t('swap.inputRemark2')}} <b>{{ gasFee }} xpx</b></div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, toRefs, computed} from 'vue'

const p = defineProps({
    placeholder: String,
    errorMessage: String,
    emptyErrorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: {
      type: Number,
      required: true
    },
    title: String,
    disabled: Boolean,
    maxAmount: {
      type: Number,
      required: true
    },
    remarkOption: Boolean,
    transactionFee: String,
    gasFee: Number,
    toolTip: String,
    decimal: {
      type: Number,
      required: true
    },
  })
  const emit = defineEmits([
    'update:modelValue',
    'clickedMaxAvailable',
  ])
  
  const {modelValue} = toRefs(p)
  const textErr=ref(false)
  const isShowRemark = ref(false)
  const emptyErr = ref(false)
  const inputValue = ref(p.modelValue);
  const maxDigitLimit = 16
  const maxDecLimit = ref(0)
  watch(modelValue, val => {
      if(val == p.maxAmount){
        isShowRemark.value = true;
      }else{
        isShowRemark.value = false;
      }
    }
  )
    const showRemark = () => {
      isShowRemark.value = true;
    }
    const clearAllError = () => {
      textErr.value = false;
      emptyErr.value = false;
    }
    const checkBalance = (evt:Event) => {
      const target = evt.target as HTMLInputElement
      target.value =  target.value? target.value : "0";
      if(p.maxAmount < Number(target.value.replace(/,/g, ''))){
        textErr.value = true;
      }else{
        textErr.value = false;
      }
    }
    const validateInput = (evt:Event) => {
      const target = evt.target as HTMLInputElement
      if(target.value === '' || Number(target.value) === 0 || target.value === '0'){
        emptyErr.value = true
      }
      else{
        emptyErr.value = false
      }
   };

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

const handleInput = (value: string) => {
  // Update the input value
  if(!isNaN(parseFloat(value))){
    inputValue.value = parseFloat(value);
  }
  else{
    inputValue.value = 0;
  }
};

const handleBlur = (event) => {
  (event.target as HTMLInputElement).value = formattedValue.value
}

const formattedValue = computed(() => {
  return Intl.NumberFormat("en-US", {
      maximumFractionDigits: maxDecLimit.value,
    }).format(inputValue.value)
});

watch(inputValue, (newValue, oldValue) => {
  if(newValue.toString().includes('.')) {
    const [integerPart, decimalPart] = newValue.toString().split('.');
    maxDecLimit.value = maxDigitLimit - integerPart.length
    if (decimalPart && decimalPart.length > maxDecLimit.value) {
      inputValue.value = oldValue;
    }
  }
  else{
    if(newValue.toString().length > maxDigitLimit){
      inputValue.value = oldValue;
    }
  }
    emit('update:modelValue', inputValue.value);
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
.supply_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>