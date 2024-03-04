<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{ value:'<tiptext>' + toolTip + '</tiptext>', escape: true}" v-if="toolTip"></div>
      <input
        :value="formattedValue"
        class="supply_input"
        :placeholder="placeholder"
        @input="handleInput(parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')).toString())"
        @keypress="handleKeypress"
      />
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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
  errorMessage: {
    type: String,
    required: false,
  },
});

const emit = defineEmits([
    'update:modelValue', 'show-error'
  ])

const inputValue = ref(props.modelValue);

const handleKeypress = (event: KeyboardEvent) => {
  const charCode = event.key;
  // Allow numbers (0-9)
  if (
    (charCode >= '0' && charCode <= '9') ||
    charCode === 'Backspace' ||
    charCode === 'Delete' ||
    charCode === 'ArrowLeft' ||
    charCode === 'ArrowRight'
  ) {
    // Allow the keypress
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

const formattedValue = computed(() => {
  return Intl.NumberFormat("en-US", {
      maximumFractionDigits: props.decimal,
    }).format(parseFloat(inputValue.value))
});
</script>

<style lang="scss" scoped>
.supply_input {
  @apply w-full flex border-0 border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>