<template>
  <loading v-model:active="isLoading" :can-cancel="false"
        :is-full-page="true" />
  <div class="flex flex-col justify-between md:min-h-screen bg-navy-primary" @click="clickEvent" ref="mainFrame">
    <Toast position="top-left" group="tl" />
    <Toast position="top-right" group="tr" />
    <Toast position="center" group="center" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" style="word-break: break-all;" />
    <Toast position="top-right" group="tr-wait">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <div class="font-semibold">{{slotProps.message.summary}}</div>
          </div>
          <div class="col-span-12">
            <div class="text-sm">{{slotProps.message.detail}}</div>
            <div class="mt-1 text-xs">{{slotProps.message.detail2}}</div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize: 0.6}rem`" v-if="slotProps.message.url">
              <a :href="slotProps.message.url" target="_blank">
              {{slotProps.message.detail3}}
              </a>
            </div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 0.6}rem`" v-else>{{slotProps.message.detail3}}</div>
          </div> 
        </div>
      </template>
    </Toast>
    <Toast position="top-right" group="tr-custom">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i v-if="slotProps.message.severity === 'success'" class="pi pi-check-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'error'" class="pi pi-times-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'info'" class="pi pi-info-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'warn'" class="pi pi-exclamation-circle" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <div class="font-semibold">{{slotProps.message.summary}}</div>
          </div>
          <div class="col-span-12">
            <div class="text-sm">{{slotProps.message.detail}}</div>
            <div class="mt-1 text-xs">{{slotProps.message.detail2}}</div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize: 0.6}rem`" v-if="slotProps.message.url">
              <a :href="slotProps.message.url" target="_blank">
              {{slotProps.message.detail3}}
              </a>
            </div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 0.6}rem`" v-else>{{slotProps.message.detail3}}</div>
          </div> 
        </div>
      </template>
    </Toast>
    <Toast position="bottom-right" group="br-custom">
      <template #message="slotProps">
        <div style="width: 100%" class="grid grid-cols-12">
          <div class="col-span-2">
            <i v-if="slotProps.message.severity === 'success'" class="pi pi-check-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'error'" class="pi pi-times-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'info'" class="pi pi-info-circle" style="font-size: 2.5rem"></i>
            <i v-else-if="slotProps.message.severity === 'warn'" class="pi pi-exclamation-circle" style="font-size: 2.5rem"></i>
          </div>
          <div class="col-span-10">
            <div class="font-semibold">{{slotProps.message.summary}}</div>
          </div>
          <div class="col-span-12">
            <div class="text-sm">{{slotProps.message.detail}}</div>
            <div class="mt-1 text-xs">{{slotProps.message.detail2}}</div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize: 0.6}rem`" v-if="slotProps.message.url">
              <a :href="slotProps.message.url" target="_blank">
              {{slotProps.message.detail3}}
              </a>
            </div>
            <div :style="`font-size: ${slotProps.message.detail3RemSize ? slotProps.message.detail3RemSize : 0.6}rem`" v-else>{{slotProps.message.detail3}}</div>
            <div :style="`font-size: ${slotProps.message.detail4 && slotProps.message.detail4.length > 64 ? 0.4 : 0.5}rem`" >{{slotProps.message.detail4}}</div>
          </div> 
        </div>
      </template>
    </Toast>
    <ConfirmDialog></ConfirmDialog>
    <headerComponent></headerComponent>
    <div :class="login?`flex min-full-screen`:`min-h-screen sm:flex sm:items-center sm:justify-center`">
      <NavigationMenu v-if="login" class="lg:mt-16 flex-shrink-0 bg-navy-primary text-left text-xs bg-navi z-20 overflow-y-auto fixed inset-y-0 left-0 transform lg:-translate-x-0 transition duration-200 ease-in-out" :class="`${isShowNavi?'-translate-x-0':'-translate-x-full'}`"></NavigationMenu>
      <div :class="`${ login?'inline-block flex-grow overflow-hidden':'sm:w-full'}`">
        <div :class="`${ login?'flex flex-col min-full-screen bg-white':''}`">
          <router-view class="lg:ml-60 mt-12 lg:mt-16 flex-grow" v-if="currentRouteName=='ViewDashboard' || currentRouteName=='ViewTransactionStatus'"></router-view>
          <router-view class="mt-24 lg:mt-16 flex-grow" v-else-if="currentRouteName=='ViewWallets'" ></router-view>
          <router-view class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5" v-else-if="login" :key="$route.path"></router-view>
          <router-view class="mt-12 sm:mt-0 flex-grow px-2 pt-5 sm:p-0" v-else></router-view>
          <footer class="md:ml-60 md:h-9 mt-10 text-center sm:text-justify sm:flex text-txs md:text-xs sm:justify-between text-gray-700 px-10 flex-grow-0" v-if="login">
            <div class="ml-2 sm:ml-0">{{$t('home.copyright')}} <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary hover:underline">{{$t('home.helpdesk')}}</a> </div>
            <div class="mr-2 sm:mr-0 py-2 sm:py-0"><span> {{$t('home.version')}}{{ versioning }}</span></div>
          </footer>
        </div>
      </div>
    </div>
    <div v-if="!login" class="w-full items-center px-2" :class="`${ overflowScreen?'relative':'2xl:absolute bottom-0' }`">
      <footer class="mx-auto h-12 mt-20 text-center  lg:flex text-txs lg:text-xs lg:justify-between container text-white pb-5">
        <div class="ml-2 sm:ml-0">{{$t('home.copyright')}} <a href="https://t.me/proximaxhelpdesk" target=_new class="text-white hover:underline">{{$t('home.helpdesk')}}</a></div>
        <div class="mr-2 sm:mr-0 py-2 sm:py-0"><span> {{$t('home.version')}} {{ versioning }}</span></div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, provide, watch, ref, reactive, onUnmounted, onMounted } from "vue";
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
import { AppState } from '@/state/appState'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default defineComponent({
  name: 'App',
  components: {
    headerComponent,
    NavigationMenu,
    ConfirmDialog,
    Toast,
    Loading
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance!.appContext.config.globalProperties.emitter;

  interface defaultAcc{
    walletName: string,
    defaultAcc: string
  }
    watch(walletState,n=>{
      if(n.currentLoggedInWallet){
        let findAcc = sessionStorage.getItem('defaultAcc')
        //first time
        if(!findAcc){
          let data = [{
            walletName: walletState.currentLoggedInWallet.name,
            defaultAcc:walletState.currentLoggedInWallet.accounts[0].address
          }]
          sessionStorage.setItem('defaultAcc',JSON.stringify(data))
          return
        }
        let datas :defaultAcc[] = JSON.parse(findAcc)
        let findData = datas.find(data=>data.walletName == walletState.currentLoggedInWallet.name)
        walletState.currentLoggedInWallet.setDefaultAccountByAddress(findData.defaultAcc)
      }
    },{immediate:true})

    const overflowScreen = ref(false);
    const mainFrame = ref(null);
    let contentHeight = ref(0);

    const isOverflow = () => {
      if(window.innerWidth > 768){
        if(window.innerHeight < contentHeight.value){
          overflowScreen.value = true;
        }else{
          overflowScreen.value = false;
        }
      }else{
        if(window.innerHeight < (contentHeight.value + 90)){
          overflowScreen.value = true;
        }else{
          overflowScreen.value = false;
        }
      }
    }

    const screenResizeHandler = () => {
      isOverflow();
    };
    screenResizeHandler();

    onUnmounted(() => {
      window.removeEventListener("resize", screenResizeHandler);
    });

    onMounted(() => {
      contentHeight.value = mainFrame.value.clientHeight;
      isOverflow();
      window.addEventListener("resize", screenResizeHandler);
    });

    const isLoading = computed(()=>{ return !AppState.isReady});

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
      isLoading,
      overflowScreen,
      mainFrame
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
  min-height:calc(100vh) !important;
}


</style>