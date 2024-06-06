<template>
    <div class="grid items-center gap-1">
      <div class="relative">
        <input
          :type="inputType"
          :placeholder="placeholder"
          v-model="modelValue"
          class="flex w-full h-9 text-placeholder  border bg-transparent px-3 py-1  shadow-sm transition-colors  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <div class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
          <Eye v-if="inputType == 'password'" @click="inputType = 'text'" />
          <EyeOff v-else @click="inputType = 'password'" />
        </div>
      </div>
      <div class="text-red-500 text-xs text-left my-1">
        {{ errors[0] ?? '' }}
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from 'vue'
  import { Eye, EyeOff } from 'lucide-vue-next'

  defineProps<{
    placeholder: string
    errors: string[]
  }>()

  const inputType = ref('password')
  const modelValue = defineModel<string>()
  </script>