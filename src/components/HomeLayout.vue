<template>
  <div class="flex flex-col justify-between min-h-screen bg-navy-primary">
    <HeaderComponent />
    <div class="container mx-auto lg:px-20  gap-4 pt-24 md:my-auto md:pt-0">
      <slot />
    </div>

    <div class="w-full items-center px-2">
      <footer
        class="mx-auto text-center flex text-txs lg:text-xs justify-between container text-black-primary pb-5 items-center"
      >
        <div class="ml-2 sm:ml-0 text-white">
          {{ $t('home.copyright', {date: lastActiveYear}) }}
          <a
            href="https://t.me/proximaxhelpdesk"
            target="_new"
            class="text-blue-primary hover:underline"
            >{{ $t('home.helpdesk') }}</a
          >
        </div>
        <div class="mr-2 sm:mr-0 py-2 sm:py-0 text-white">
          <span> {{ $t('home.version') }} {{ version }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import packageData from '../../package.json'

const version = packageData.version
const lastActiveYear = BUILD_YEAR;
</script>
