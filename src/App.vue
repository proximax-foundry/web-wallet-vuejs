<template>
  <div class="flex flex-col justify-between min-h-screen bg-navy-primary" @click="clickEvent">
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
    <div :class="login?`flex min-full-screen`:``">
      <NavigationMenu v-if="login" class="flex-shrink-0 bg-navy-primary text-left text-xs bg-navi z-10 absolute md:relative inset-y-0 left-0 transform md:-translate-x-0 transition duration-200 ease-in-out" :class="`${isShowNavi?'-translate-x-0':'-translate-x-full'}`"></NavigationMenu>
      <div :class="`${ login?'inline-block flex-grow':''}`">
        <div :class="`${ login?'flex flex-col min-full-screen bg-white':''}`">
          <router-view class="flex-grow" v-if="currentRouteName=='ViewDashboard'"></router-view>
          <router-view class="flex-grow px-2 sm:px-10 pt-5" v-else :key="$route.path"></router-view>
          <footer class="md:h-9 mt-10 text-center sm:text-justify sm:flex text-txs md:text-xs sm:justify-between container mx-auto text-gray-700 px-10 flex-grow-0" v-if="login">
            <div class="ml-2 sm:ml-0">Copyright 2021 ProximaX®. All rights reserved. <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary hover:underline">{{$t('Footer.link')}}</a> <selectLanguageModal class="inline-block" /></div>
            <div class="mr-2 sm:mr-0 py-2 sm:py-0"><span>Version BETA {{$t('Header.version')}}{{ versioning }}</span></div>
          </footer>
        </div>
      </div>
    </div>
    <!-- <PageComponent></PageComponent> -->
    <footer class="h-12 mt-20 text-center sm:text-justify sm:flex text-txs md:text-xs sm:justify-between container mx-auto text-white pb-5" v-if="!login">
      <div class="ml-2 sm:ml-0">Copyright 2021 ProximaX®. All rights reserved. <a href="https://t.me/proximaxhelpdesk" target=_new class="text-white hover:underline">{{$t('Footer.link')}}</a></div>
      <div class="mr-2 sm:mr-0 py-2 sm:py-0"><span>Version BETA {{$t('Header.version')}}{{ versioning }}</span></div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, provide, watch, ref, reactive } from "vue";
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
import { useRouter } from 'vue-router';

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

    const navigationSideBar = reactive({
      isOpen: false,
      inNavi: false,
    });

    provide('navigationSideBar', navigationSideBar);

    const router = useRouter();
    // chainNetwork.updateAvailableNetworks();
    const currentRouteName = computed(() => {
      return router.currentRoute.value.name;
    });

    const versioning = ref('0.0.1');

    versioning.value = packageData.version;


    // emitter for drop down menu in viewAllAccounts and Services page
    const clickEvent = () => {
      emitter.emit("PAGE_CLICK");
    };

    const login = computed(() =>walletState.isLogin);

    const isShowNavi = computed(() => {
      return navigationSideBar.isOpen
    });

    // emitted from App.vue when click on any part of the page
    emitter.on('PAGE_CLICK', () => {
      // if(!isInNavigation.value){
      //   emitter.emit('CLOSE_NAVI_BAR');
      // }
      if(!navigationSideBar.inNavi){
        navigationSideBar.isOpen =false;
      }
    });

    return{
      login,
      clickEvent,
      versioning,
      currentRouteName,
      isShowNavi,
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

.min-full-screen{
  min-height:calc(100vh - 4rem) !important;
}


</style>