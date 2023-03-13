<template>
  <div>
    <div class="border border-gray-200 rounded">
      <div class="flex justify-left">
        <div class="w-18 flex items-center justify-center py-5 sm:h-20 flex-none">
          <img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-8 h-8 inline-block">
        </div>
        <div class="text-left flex items-center">
          <div class="block">
            <div class="text-xxs uppercase text-blue-primary font-bold">{{$t('swap.toMetamaskAddress')}}</div>
            <input :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target)" type="text" size="80" class="placeholder bg-white" :placeholder="placeholder">            
          </div>
        </div>
      </div>
    </div>
    <div class="error error-text text-left" v-if="showError">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
 

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
    'update:modelValue',
  ])
  
</script>
,<style lang="scss" scoped>
.placeholder{
  @apply flex-grow text-xs placeholder-gray-500 focus:outline-none w-full;
}
</style>