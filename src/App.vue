<template>
  <div class="flex flex-col h-screen justify-between">
    <Toast />
    <Toast position="top-left" group="tl" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" />
    <ConfirmDialog></ConfirmDialog>
    <header class="h-16 flex items-stretch">
      <headerComponent></headerComponent>
    </header>
    <PageComponent class="flex-grow"></PageComponent>
    <footer class="h-12 text-center">
      <div class="text-xs py-2">
        <div class="font-bold">&copy; ProximaX 2021</div>
        <div>Please report any issues identified to our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold hover:underline">helpdesk</a>.</div>
      </div>
    </footer>
  </div>
</template>

<script>
import { provide } from "vue";
import { appStore } from "./store/app";
import { siriusStore } from "./store/sirius";
import headerComponent from '@/components/headerComponent.vue'
import PageComponent from '@/components/PageComponent.vue'

export default {
  name: 'App',
  components: {
    headerComponent,
    PageComponent,
  },
  setup() {
    siriusStore.startWatch();
    appStore.startWatch();
    provide("appStore", appStore);
    provide("siriusStore", siriusStore);
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>