<template>
  <div class="flex flex-col h-screen justify-between" @click="clickEvent">
    <Toast />
    <Toast position="top-left" group="tl" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" />
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
        <div class="font-bold">&copy; ProximaX 2021</div>
        <div>Please report any issues identified to our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold hover:underline">helpdesk</a>.</div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, provide, getCurrentInstance } from "vue";
import { walletState } from "./state/walletState";
import headerComponent from '@/components/headerComponent.vue'
// import PageComponent from '@/components/PageComponent.vue'
import NavigationMenu from '@/components/NavigationMenu.vue'
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

<<<<<<< HEAD
export default{
=======
export default {
>>>>>>> 6441db2... v 0.0.10 bug fixes
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
<<<<<<< HEAD
    const emitter = internalInstance?.appContext.config.globalProperties.emitter;
=======
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    provide("appStore", appStore);
    provide("siriusStore", siriusStore);
    provide("chainNetwork", chainNetwork);
    chainNetwork.updateAvailableNetworks();
>>>>>>> a0d9159... v 0.0.10 - Toast notifications

    const login = computed(() => appStore.state.isLogin);

    // emitter for drop down menu in viewAllAccounts and Services page
    const clickEvent = () => {
      emitter.emit("PAGE_CLICK");
    };

<<<<<<< HEAD
    const login = computed(() =>walletState.isLogin);

=======
>>>>>>> a0d9159... v 0.0.10 - Toast notifications
    return{
      login,
      clickEvent,
    }
  },
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>