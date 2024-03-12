<template>
    <div :class="disabled?'opacity-50':''">
      <div class="border border-gray-200 px-2 py-1  rounded-md">
          <div class="flex flex-col">
              <div class="uppercase font-light text-gray-500 text-txs text-left mb-2">{{ placeholder }}</div>
              <div class="flex w-full">
                  <input 
                    :value="formattedValue"
                    class="supply_input"
                    :placeholder="placeholder" 
                    @input="handleInput(parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')).toString())"
                    @keypress="handleKeypress($event,(<HTMLInputElement>$event.target).value)"
                    @blur="handleBlur($event)"
                  />
              </div>
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
    disabled: {
      type: Boolean,
      required: false,
    },



  });


  
  const emit = defineEmits([
      'update:modelValue', 'show-error'
    ])
  
    const inputValue = ref(props.modelValue);
    const maxDigitLimit = 16
    const maxDecLimit = ref(0)

const handleKeypress = (event: KeyboardEvent, value: string) => {
  const charCode = event.key;
  // Allow numbers (0-9)
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
      if (formattedValue.value.includes('.') || value.includes('.')){
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
    inputValue.value = value;
  }
  else{
    inputValue.value = "0";
  }
  emit('update:modelValue', inputValue.value);
};

const handleBlur = (event) => {
  (event.target as HTMLInputElement).value = formattedValue.value
}

const formattedValue = computed(() => {
  return Intl.NumberFormat("en-US", {
      maximumFractionDigits: maxDecLimit.value,
    }).format(parseFloat(inputValue.value))
});

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
  
  .supply_input {
    @apply w-full flex border-0 outline-none border-white drop-shadow-none filter  text-sm text-gray-600 font-bold disabled:opacity-50;
  }
  </style>