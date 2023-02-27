<template>
  <div :class="disabled ? 'opacity-50' : ''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg"
          class="inline-block ml-1 relative cursor-pointer" style="top: -1px;"
          v-tooltip.bottom="{ value: '<tiptext>' + toolTip + '</tiptext>', escape: true }" v-if="toolTip"></div>
      <input :disabled="disabled" :value="modelValue" @input="updateValue" type="text"
        class="text_input">
    </div>
    <div class="h-3 mb-2">
      <div class="error error-text text-left" v-if="showError">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  placeholder: String,
  errorMessage: String,
  showError: Boolean,
  disabled: Boolean,
  modelValue: String,
  toolTip: String,
})
const emit = defineEmits([
  'update:modelValue'
])

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
};

</script>

<style lang="scss">.text_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter text-tsm text-gray-600 font-bold disabled:opacity-50;
}</style>
