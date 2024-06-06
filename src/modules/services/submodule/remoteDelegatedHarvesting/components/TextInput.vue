<template>
    <div class="grid items-center gap-1">
      <input
        class="h-9 w-full   border  bg-transparent px-3 py-1 text-placeholder shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
        v-model="modelValue"
        type="text"
        :disabled="disabled"
        :placeholder="placeholder"
      />
      <div class="text-red-500 text-xs text-left my-1.5">
        {{ errors[0] ?? '' }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    placeholder: string
    errors: string[],
    disabled?: boolean 
  }>()
  
  const modelValue = defineModel<string>()
  </script>
  