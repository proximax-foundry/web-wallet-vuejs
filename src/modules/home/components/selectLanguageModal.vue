<template>
  <div @click="toggle" class="cursor-pointer flex gap-2 items-center">
    <img v-if="!walletState.currentLoggedInWallet" src="@/assets/img/globe-white.svg" class="h-4 w-4" />
    <img v-else src="@/assets/img/globe.svg" class="h-4 w-4" />

    <div :class="walletState.currentLoggedInWallet?'text-black':'text-white'">{{ locale.toUpperCase() }}</div>
  </div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Menu from 'primevue/menu'
import { walletState } from '@/state/walletState';

const { locale } = useI18n()
const selected = ref(locale.value)

const menu = ref()
const toggle = (event: Event) => {
  menu.value.toggle(event)
}

const items = ref([
  {
    label: 'English',
    command: () => {
      changeLang('en')
    }
  },
  {
    label: '中文',
    command: () => {
      changeLang('zh')
    }
  },
  {
    label: 'русский',
    command: () => {
      changeLang('ru')
    }
  },
  {
    label: 'Español',
    command: () => {
      changeLang('es')
    }
  }
])

const changeLang = (lng: string) => {
  locale.value = lng
  selected.value = lng
}
</script>
