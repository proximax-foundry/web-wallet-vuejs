<template>
  <div>
    <div class="ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5">
      <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{$t('services.nodes')}}</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">
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
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from '@vueform/multiselect';
import { computed, getCurrentInstance, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { walletState } from '@/state/walletState';
import {WalletUtils} from '@/util/walletUtils';

export default {
  name: 'ViewServicesNodes',

  components: {
    Multiselect,
  },

  setup() {
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const showSelectTitle = ref(false);
    const borderColor = ref('border border-gray-300');
    const placeholder = ref('Node list');
    const canDeselect = ref(false);
    const maxHeight = ref(200);
    const selected = ref('');

    const options = computed(() => {
      let nodeList = [];

     networkState.currentNetworkProfile.apiNodes.forEach((node) => {
        nodeList.push({ value: node, name: NetworkStateUtils.buildAPIEndpointURL(node) });
      });
      return nodeList;
    });

    const currentNode = computed(() =>  NetworkStateUtils.buildAPIEndpointURL(networkState.selectedAPIEndpoint))
    const blockHeight = computed(() => networkState.currentNetworkProfileConfig.chainHeight);

    const makeNodeSelection = (endpoint) => {
      if(endpoint != networkState.selectedAPIEndpoint){
        showSelectTitle.value = true;
        NetworkStateUtils.updateChainNode(endpoint);
        WalletUtils.refreshAllAccountDetails(walletState.currentLoggedInWallet, networkState.currentNetworkProfile);
        emitter.emit('listener:reconnect');
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

    return {
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