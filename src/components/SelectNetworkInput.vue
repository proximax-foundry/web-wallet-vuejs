<template>
  <div  @click='toggleSelection = !toggleSelection' class= 'border w-8/12 ml-auto mr-auto py-3 px-2 cursor-pointer'>
    <div class='flex'>
        <img v-if='selectedNetwork.label== "Sirius Mainnet"' src="@/assets/img/icon-mainnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
        <img v-else src="@/assets/img/icon-testnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
        <div class='flex flex-col ml-2'>
            <div class=' text-blue-primary font-semibold' style="font-size: 7px ; line-height: 9px;">NETWORK</div>
            <div class='text-xs font-bold'>{{selectedNetwork.label}}</div>
        </div>
        <div v-if='!toggleSelection' class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Change</div>
        <img  v-if='toggleSelection' src="@/assets/img/delete.svg" class='h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>
    </div>
  </div>
  <div class='relative' style='left:16.7%'>
  <div v-if='toggleSelection' class='absolute border border-t-0 w-8/12  z-50 bg-white'>
    <div class=' my-3 pl-2 font-semibold' style="font-size: 7px ; line-height: 9px;">SELECT NETWORK</div>
    <div v-for='(items,index) in chainNetworks' :key="items" class='px-2 py-1'>
        <div class='flex'>
            <img v-if='index==0' src="@/assets/img/icon-mainnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
            <img v-else src="@/assets/img/icon-testnet-block.svg" class='h-5 w-5 mt-auto mb-auto'>
            <div class='text-xs ml-1 mt-0.5 font-bold'>{{items.label}}</div>
            <div @click='selectNetwork(index)' v-if='items.label!=selectedNetwork.label' class='cursor-pointer text-blue-primary font-semibold text-xxs mt-0.5 ml-auto'>SELECT</div>
            <div v-if='items.label==selectedNetwork.label' class='text-gray-500 text-xxs mt-0.5 ml-auto'>CURRENT</div>
        </div>
        <div v-if="index != chainNetworks.length - 1" class='gray-line mt-2'></div>
    </div>
  </div>
  </div>
</template>

<script>
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { computed, defineComponent, ref, watch, getCurrentInstance } from 'vue';

export default defineComponent({
  emits:[
    'switchNetwork'
  ],
  name: 'SelectNetworkInput',

  setup(p){
    const toggleSelection = ref(false);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const selectedNetwork = computed(()=>{ return {label: networkState.chainNetworkName, value: networkState.chainNetwork }});
     const chainNetworks = computed(()=> {
         
      let options = [];
      networkState.availableNetworks.forEach((network, index) => {
        options.push({ label: network, value: index });
      });
       /* options.push({ label: 'Sirius Testnet 2', value: 2}); */
      return options;
    });
    const chainsNetworkOption = computed(()=>{

      return [{
        label: t('Header.network'),
        items: chainNetworks.value
      }];
    });
    const selectNetwork= (e) =>{
      // if(e.value.value !== 'customize'){
         /* selectedWallet.value = ''
        wallets.value = [] */
        emitter.emit('switchNetwork')
        NetworkStateUtils.changeNetworkByIndex(parseInt(e));
        toggleSelection.value = !toggleSelection.value
      //}
    }
    watch(()=> networkState.availableNetworks, (availableNetworks)=>{
      let options = [];

      console.log("Network List Updated");

      for(let i=0; i < availableNetworks.length; ++i){
        options.push({ label: availableNetworks[i], value: i });
      }
      chainNetworks.value = options;
    }, true);

    return {
      selectNetwork,
      selectedNetwork,
      toggleSelection,
      chainNetworks,
    };
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";

</style>
