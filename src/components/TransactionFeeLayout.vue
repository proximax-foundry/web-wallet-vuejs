<template>
  <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 justify-between items-center text-gray-200 text-xs py-2">
    <div class='font-semibold lg:col-span-2 col-span-3'>
        <slot name="transactionType" />
    </div>
    <div class="lg:col-span-2 col-span-3 ml-auto">
        <slot name="transactionTypeFee" />
    </div>
    <div class='ml-1 text-blue-400'>
        {{ AppState.nativeToken.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppState } from '@/state/appState';    
</script>