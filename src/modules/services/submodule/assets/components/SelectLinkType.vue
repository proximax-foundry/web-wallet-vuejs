<template>
  <div>
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ title }}</div>
      <div class="flex items-center">
        <input id="link" type="radio" name="linkType" :value="modelValue" :disabled="disabled" class="h-5 w-5"
          @change="$emit('update:modelValue', 'link')" :checked="modelValue == 'link'" /><label for="link"
          class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{ $t('general.link') }}</label>
        <input id="unlink" type="radio" name="linkType" :value="modelValue" :disabled="disabled" class="h-5 w-5"
          @change="$emit('update:modelValue', 'unlink')" :checked="modelValue == 'unlink'" /><label for="unlink"
          class="cursor-pointer font-bold ml-4 mr-5 text-tsm">{{ $t('general.unlink') }}</label>
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