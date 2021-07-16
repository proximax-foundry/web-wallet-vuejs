<template>
  <div class="flex flex-col h-screen justify-between" @click="clickEvent">
    <Toast position="top-left" group="tl" />
    <Toast position="top-right" group="tr" />
    <Toast position="center" group="center" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" style="word-break: break-all;" />
    <ConfirmDialog></ConfirmDialog>
    <header class="h-16 flex items-stretch">
      <headerComponent></headerComponent>
    </header>
    <div class="flex-grow">
      <div :class="login?`w-full mx-auto text-center`:``">
        <NavigationMenu v-if="login"></NavigationMenu>
        <div :class="`${ login?'page container inline-block pt-5 px-10':''}`">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <!-- <PageComponent></PageComponent> -->
    <footer class="h-12 text-center mt-20">
      <div class="text-xs py-2">
        <div class="font-bold">version 0.2.2</div>
        <div class="font-bold">&copy; ProximaX 2021</div>
        <div>Please report any issues identified to our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold hover:underline">helpdesk</a>.</div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, watch } from "vue";
import headerComponent from '@/components/headerComponent.vue'
import NavigationMenu from '@/components/NavigationMenu.vue'
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { Connector } from './models/connector';
import { networkState } from './state/networkState';
import { walletState } from "@/state/walletState";
import { listenerState } from "@/state/listenerState";
import { ChainUtils } from "@/util/chainUtils";

export default defineComponent({
  name: 'App',
  components: {
    headerComponent,
    // PageComponent,
    NavigationMenu,
    ConfirmDialog,
    Toast,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance!.appContext.config.globalProperties.emitter;

    // chainNetwork.updateAvailableNetworks();


    // emitter for drop down menu in viewAllAccounts and Services page
    const clickEvent = () => {
      emitter.emit("PAGE_CLICK");
    };

    const login = computed(() =>walletState.isLogin);

    return{
      login,
      clickEvent,
    }
  }
});
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
