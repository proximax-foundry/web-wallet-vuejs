<template>
<div class="border border-black dark:border-0">
  <AutoNumericVue 
  :value="modelValue"
  :disabled ='disabled'
  class="supply_input px-3 py-1.5"  
  :options="{
    showWarnings : false,
    digitGroupSeparator: ',',
    decimalCharacter: '.',
    currencySymbol: '',
    allowDecimalPadding: false,
    decimalPlaces: decimal,
    roundingMethod: 'U',
    minimumValue: '0',
    placeholder: placeholder
  }"
  @input="$emit('update:modelValue',parseFloat($event.target.value.replace(/,/g, '')).toString() )"
></AutoNumericVue>
</div>

<div class="h-3 mb-2"><div class="error error-text text-left" v-if="showError">{{ errorMessage }}</div></div>
</template>

<script setup lang="ts">
import AutoNumericVue from 'autonumeric-vue/src/components/AutoNumericVue';

    defineProps({
        placeholder: String,
        errorMessage: String,
        icon: String,
        showError: Boolean,
        modelValue: String,
        title: String,
        disabled: Boolean,
        decimal: Number,
        balance: Number,
        toolTip: String,
    })
    

</script>
<style  scoped>

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
  display: flex; 
  color: #4B5563; 
  font-size: 0.875rem;
  line-height: 1.25rem; 
  font-weight: 700; 
  width: 100%; 
  border-width: 0; 
  border-color: #ffffff; 
  outline: 0; 
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow); 
}
</style>