<template>
  <div>
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ title }}</div>
      <div class="flex items-center">
        <input id="increase" type="radio" name="modificationType" :value="modelValue" :disabled="disabled" class="h-5 w-5"
          @change="$emit('update:modelValue', 'increase')" :checked="modelValue == 'increase'" /><label for="increase"
          class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{ $t('general.increase') }}</label>
        <input id="decrease" type="radio" name="modificationType" :value="modelValue" :disabled="disabled" class="h-5 w-5"
          @change="$emit('update:modelValue', 'decrease')" :checked="modelValue == 'decrease'" /><label for="decrease"
          class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{ $t('general.decrease') }}</label>
      </div>
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
  modelValue: String,
  title: String,
  disabled: Boolean,
})

defineEmits([
  'update:modelValue'
])

</script>
<style lang="scss" scoped></style>