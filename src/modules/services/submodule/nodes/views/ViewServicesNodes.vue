<template>
  <div>
    <div class="ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5">
      <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">{{$t('services.nodes')}}</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">

          <div class="border border-gray-200 px-2 py-1 h-12">
            <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">{{ $t('services.blockheight') }}</div>
            <input disabled="true" v-model="blockHeight" type="text" class="text_input">
          </div>

          <div class="border border-gray-200 px-2 py-1 h-12 mt-5">
            <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">{{ $t('services.currentnode') }}</div>
            <input disabled="true" v-model="currentNode" type="text" class="text_input">
          </div>

          <div class="mt-5 border border-gray-200 px-2 py-1">
            <div class="h-5 text-left">
              <transition enter-active-class="animate__animated animate__fadeInUp">
                <span v-if="showSelectTitle" class="uppercase text-gray-400 font-light text-txs text-left">{{ placeholder }}</span>
              </transition>
            </div>
            <div class="select selectPlugin" style="position: relative">
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
                    <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-5 h-5 mr-2"> {{ value.name }}
                  </div>
                </template>
                <template v-slot:option="{ option }">
                  <img src="@/modules/dashboard/img/icon-xpx.svg" class="w-5 h-5 mr-2"> {{ option.name }}
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
    const showSelectTitle = ref(true);
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

.text_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold bg-white;
}
</style>