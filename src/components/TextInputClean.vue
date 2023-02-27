<template>
  <div :class="disabled ? 'opacity-50' : ''">
    <div class="border border-gray-200 px-2 py-1 h-12">
      <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">{{ placeholder }}</div>
      <input :disabled="disabled" :value="modelValue" @input="updateValue" type="text" class="text_input">
    </div>
    <div class="h-3 mb-2">
      <div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  placeholder: String,
  errorMessage: String,
  icon: String,
  showError: Boolean,
  disabled: Boolean,
  modelValue: String,
  imgRequired: Boolean,
})

const emit = defineEmits([
  'update:modelValue'
])

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
};

const textErr = ref(false)


</script>

<style lang="scss">
.text_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>
