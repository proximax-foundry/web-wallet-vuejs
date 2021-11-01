<template>
  <div class="flex flex-col h-screen justify-between" @click="clickEvent">
    <Toast position="top-left" group="tl" />
    <Toast position="top-right" group="tr" />
    <Toast position="center" group="center" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" style="word-break: break-all;" />
    <Toast position="bottom-right" group="brt">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <h3>{{slotProps.message.summary}}</h3>
            <p>{{slotProps.message.detail}}</p>
            <p>{{slotProps.message.detail2}}</p>
          </div>  
        </div>
      </template>
    </Toast>
    <ConfirmDialog></ConfirmDialog>
    <headerComponent></headerComponent>
    <div class="flex-grow">
      <div :class="login?`flex`:``">
        <NavigationMenu v-if="login" class="flex-shrink-0 bg-gray-50 text-left text-xs bg-navi z-10"></NavigationMenu>
        <div :class="`${ login?'inline-block flex-grow min-h-screen bg-white':''}`">
          <router-view></router-view>
          <footer class="h-9 mt-20 text-center sm:text-justify sm:flex text-xs sm:justify-between container mx-auto text-gray-700 px-10" v-if="login">
            <div class="ml-2 sm:ml-0">Copyright 2021 ProximaX®. All rights reserved. <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary hover:underline">{{$t('Footer.link')}}</a> <selectLanguageModal class="inline-block" /></div>
            <div class="mr-2 sm:mr-0 py-2 sm:py-0"><span>Version BETA {{$t('Header.version')}}{{ versioning }}</span></div>
          </footer>
        </div>
      </div>
    </div>
    <!-- <PageComponent></PageComponent> -->
    <footer class="h-12 mt-20 text-center sm:text-justify sm:flex text-xs sm:justify-between container mx-auto text-gray-700 pb-5" v-if="!login">
      <div class="ml-2 sm:ml-0">Copyright 2021 ProximaX®. All rights reserved. <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary hover:underline">{{$t('Footer.link')}}</a></div>
      <div class="mr-2 sm:mr-0 py-2 sm:py-0"><span>Version BETA {{$t('Header.version')}}{{ versioning }}</span></div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, watch, ref } from "vue";
import selectLanguageModal from '@/modules/home/components/selectLanguageModal.vue';
import packageData from "../package.json";
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
    NavigationMenu,
    ConfirmDialog,
    Toast,
    selectLanguageModal,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance!.appContext.config.globalProperties.emitter;

    // chainNetwork.updateAvailableNetworks();

    const versioning = ref('0.0.1');

    versioning.value = packageData.version;


    // emitter for drop down menu in viewAllAccounts and Services page
    const clickEvent = () => {
      emitter.emit("PAGE_CLICK");
    };

    const login = computed(() =>walletState.isLogin);

    return{
      login,
      clickEvent,
      versioning,
    }
  }
});
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.full-screen{
  height:calc(100vh - 4rem) !important;
}

.bg-navi{
  background: #F2F2F5;
  box-shadow: 7px 0px 10px -7px #dedede;
}
</style>