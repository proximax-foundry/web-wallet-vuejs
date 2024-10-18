<template>
    <div class='font-bold text-xs text-blue-primary uppercase'>
        <slot name="selectedAcc" />
    </div>

    <div class="lg:grid lg:grid-cols-5 grid grid-cols-7 text-gray-200 my-1">
        <div class='font-semibold text-xxs mt-2 lg:col-span-2 col-span-3 text-blue-primary uppercase'>
            {{ $t('general.currentBalance') }}</div>
        <span class='ml-auto lg:col-span-2 col-span-3 '>
            <slot name="accBalance" />
        </span>
        <div class="flex">
            <div class='ml-1 text-blue-400 font-bold'>{{ AppState.nativeToken.label }}</div>
            <img src="@/modules/account/img/proximax-logo.svg" class='ml-1 h-5 w-5 mt-0.5'>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppState } from '@/state/appState';    
</script>