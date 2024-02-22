<template>
  <div class="flex h-screen bg-gray-200">
    <NavigationMenu />

    <div class="flex-1 flex flex-col overflow-hidden">
      <HeaderComponentVue class="z-50"/>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-white flex flex-col justify-between" >
        <div class="    flex flex-col">
          <slot />
          
        </div>
        <footer
            class="mx-auto px-6 flex text-txs lg:text-xs justify-between container pb-5 items-center"
          >
            <div class="ml-2 sm:ml-0">
              {{ $t('home.copyright', {date: lastActiveYear}) }}
              <a
                href="https://t.me/proximaxhelpdesk"
                target="_new"
                class="text-blue-primary hover:underline"
                >{{ $t('home.helpdesk') }}</a
              >
            </div>
            <div class="mr-2 sm:mr-0 py-2 sm:py-0">
              <span> {{ $t('home.version') }} {{ version }}</span>
            </div>
          </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderComponentVue from './HeaderComponent.vue'
import NavigationMenu from './NavigationMenu.vue'
import packageData from '../../package.json'

const version = packageData.version
const lastActiveYear = BUILD_YEAR;
</script>
