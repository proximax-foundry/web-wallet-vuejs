<template>
  <div class="relative">
    <div @click='toggleSelection = !toggleSelection' class= "border ml-auto mr-auto py-3 px-2 cursor-pointer rounded-md w-full h-14">
      <div class='flex'>
        <div class='flex flex-col ml-2 text-left'>
          <div class='text-blue-primary font-semibold text-xxs mb-1'  style="line-height: 9px;">NAMESPACE</div>
          <div v-if='selectedNamespace!=""' class='mt-1 text-tsm font-bold'>{{selectedNamespace}}</div>
          <div v-else class='text-tsm font-bold '>Select Namespace</div>
        </div>
        <div v-if='!toggleSelection && selectedNamespace==""' class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Select</div>
        <div v-if='!toggleSelection && selectedNamespace!=""'  class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Change</div>
        <img v-if='toggleSelection' @click='selectedNamespace=""' src="@/assets/img/delete.svg" class='h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>
      </div>
    </div>
    <div class='relative'>
      <div v-if='toggleSelection' class='absolute border border-t-0 w-full z-50 bg-white max-h-40 overflow-auto px-3 filter drop-shodow-xl'>
        <div v-if='namespaces.length > 0' class="pl-2 pt-4 text-xxs text-gray-400">SELECT NAMESPACE</div>
        <div v-else class='text-xxs pt-2 pl-2 pb-2' >The list is empty.</div>
        <div v-for='(item,index) in namespaces' :key="index" class="px-2 py-3 flex items-center" @click="selectNamespace(item);$emit('update:modelValue', selectedNamespace);" :class='[(index != namespaces.length - 1)?"border-b border-gray-200":"", (!item.disabled)?"cursor-pointer":""]'>
          <div class='text-xs truncate' :class="(!item.disabled)?'text-black font-semibold':'text-gray-300'">{{item.label}}</div>
          <div v-if='item.label!=selectedNamespace && !item.disabled' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold'>SELECT</div>
          <div v-else-if="item.disabled" class='text-gray-300 text-xxs mt-0.5 ml-auto'>DISABLED</div>
          <div v-else class='text-gray-500 text-xxs mt-0.5 ml-auto'>CURRENT</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Address } from "tsjs-xpx-chain-sdk";
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { walletState } from '@/state/walletState';
import { computed, defineComponent, ref, watch, getCurrentInstance } from 'vue';
import { AssetsUtils } from '@/util/assetsUtils';

export default defineComponent({
  emits:[
    'select-account','update:modelValue',
  ],
  name: 'SelectInputNamespace',
  props: [
    'modelValue',
    'action',
    'address',
    'assetId'
  ],

  setup(props){
    const toggleSelection = ref(false);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const selectedNamespace = ref('');
    const selectNamespace = (ns) => {
      selectedNamespace.value = ns.value;
      toggleSelection.value = !toggleSelection.value;
    };

    const namespaces = computed(() => {
      return AssetsUtils.listActiveNamespacesToLink(props.assetId, Address.createFromRawAddress(props.address).plain(), props.action);
    });

    return {
      selectNamespace,
      namespaces,
      toggleSelection,
      selectedNamespace,
    };
  }
})
</script>

