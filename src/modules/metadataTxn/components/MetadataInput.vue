<template>
  <div :class="disabled ? 'opacity-50' : ''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }}<img src="@/assets/img/icon-info.svg"
          class="inline-block ml-1 relative cursor-pointer" style="top: -1px;"
          v-tooltip.bottom="{ value: '<tiptext>' + toolTip + '</tiptext>', escape: true }" v-if="toolTip"></div>
      <input v-if="!hex" class="number_input" :disabled="disabled"
        @input="updateValue($event)" :value="modelValue" type="text">
      <input v-if="hex" type="text" class="number_input" :disabled="disabled"
        @input="updateValue($event)" :value="modelValue" v-on:keypress="hexOnly($event)">
    </div>
    <div v-if="showError" class="h-3 mb-2">
      <div class="error error-text text-left">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  placeholder: String,
  errorMessage: String,
  icon: String,
  showError: Boolean,
  modelValue: String,
  title: String,
  disabled: Boolean,
  max: Number,
  toolTip: String,
  hex: Boolean
})

const hexOnly = (evt: KeyboardEvent) => {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 70) && (charCode < 97 || charCode > 102))) {
    evt.preventDefault();
  } else {
    return
  }
}
const emit = defineEmits([
  'update:modelValue'
])


const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};


</script>
<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter text-tsm text-gray-600 font-bold disabled:opacity-50;
}</style>