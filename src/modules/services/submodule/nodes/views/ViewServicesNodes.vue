<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('services.nodes')}} ></span> <span class="text-blue-primary font-bold">{{$t('welcome.blockchain')}}</span></div>
    <div>
      <router-link :to="{name: 'ViewServices'}" class="font-bold" active-class="accounts">{{$t('services.allservices')}}</router-link>
    </div>
  </div>

  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'>
    <div class="text-outline bg-white mt-5" :class="borderColor">
      <div class="w-40 text-left">
        <img src="@/modules/services/submodule/nodes/img/icon-block-height-blue-30h.svg" class="h-7 w-7 inline-block ml-4">
        <div class="ml-2 text-tsm mt-1 text-gray-500 w-30 inline-block">{{$t('services.blockheight')}}</div>
      </div>
      <input disabled="disabled" v-model="blockHeight" class="text-placeholder bg-white text-right">
      <div class="w-5"></div>
    </div>

    <div class="text-outline bg-white mt-5" :class="borderColor">
      <div class="w-40 text-left">
        <img src="@/modules/services/submodule/nodes/img/icon-nodes-blue-60h.svg" class="h-7 w-7 inline-block ml-4">
        <div class="ml-2 text-tsm mt-1 text-gray-500 w-30 inline-block">{{$t('services.currentnode')}}</div>
      </div>
      <input disabled="disabled" v-model="currentNode" class="text-placeholder bg-white text-right">
      <div class="w-5"></div>
    </div>

    <div class="mt-5">
      <div class="h-5 text-left">
        <transition enter-active-class="animate__animated animate__fadeInUp">
          <span v-if="showSelectTitle" class="text-xs text-blue-400 ">{{ placeholder }}</span>
        </transition>
      </div>
      <div class="select mb-3 selectPlugin" style="position: relative">
        <Multiselect
          :placeholder="placeholder"
          :options="options"
          mode="single"
          :canDeselect="canDeselect"
          v-model="selected"
          :maxHeight="maxHeight"
          @select="makeNodeSelection"
          @close="closeSelection"
          label="name"
        >
          <template v-slot:singlelabel="{ value }">
            <div class="multiselect-single-label">
              <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 h-5 mr-2"> {{ value.name }}
            </div>
          </template>
          <template v-slot:option="{ option }">
            <img src="@/assets/img/icon-prx-xpx-blue.svg" class="w-5 h-5 mr-2"> {{ option.name }}
          </template>
        </Multiselect>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from '@vueform/multiselect';
import { computed, inject, ref } from "vue";
import { startListening, stopListening } from '@/util/listener.js';
import { useToast } from "primevue/usetoast";
// import { DataBridgeService } from '../util/dataBridge.js';

export default {
  name: 'ViewServicesNodes',

  components: {
    Multiselect,
  },

  setup() {
    const toast = useToast();
    const chainNetwork = inject("chainNetwork");
    const showSelectTitle = ref(false);
    // const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
    const borderColor = ref('border border-gray-300');
    const placeholder = ref('Node list');
    const canDeselect = ref(false);
    const maxHeight = ref(200);
    const selected = ref('');

    const options = computed(() => {
      let nodeList = [];
      chainNetwork.getChainNodes().forEach((node) => {
        // let link = (location.protocol == "http:" ? node.protocol : node.sslProtocol) + "://" + node.hostname + (location.protocol == "http:" ?(':' + node.port):'');
        nodeList.push({ value: node, name: siriusStore._buildAPIEndpointURL(node) });
      });
      return nodeList;
    });

    const currentNode = computed(() => siriusStore._buildAPIEndpointURL(siriusStore.state.selectedChainNode));
    const blockHeight = computed(() => siriusStore.state.blockHeight);

    const makeNodeSelection = (e) => {
      if(e != siriusStore.state.selectedChainNode){
        showSelectTitle.value = true;
        chainNetwork.updateChainNode(e);
        stopListening();
        const walletSession = JSON.parse(sessionStorage.getItem('currentWalletSession'));
        startListening(walletSession.accounts);
        appStore.getXPXBalance(walletSession.name, siriusStore);
        toast.add({severity:'success', summary: 'Services', detail: 'Node updated', group: 'br', life: 5000});
      }
    };

    const closeSelection =() => {
      if(!selected.value){
        clearSelection();
      }
    };

    const clearSelection = () => {
      showSelectTitle.value = false;
    };

    // var dataBridgeInstance = new DataBridgeService();
    // dataBridgeInstance.connectBlockSocket();

    return {
      appStore,
      // wallet,
      selected,
      showSelectTitle,
      borderColor,
      placeholder,
      canDeselect,
      maxHeight,
      options,
      makeNodeSelection,
      closeSelection,
      currentNode,
      blockHeight,
    };
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";
</style>