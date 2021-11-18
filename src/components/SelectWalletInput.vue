<template>
  <div  @click='toggleSelection = !toggleSelection' class= 'border w-8/12 ml-auto mr-auto py-3 px-2 cursor-pointer'>
    <div class='flex'>
        <img src='@/assets/img/icon-wallet.svg' class='h-5 w-5 mt-auto mb-auto'>
        <div class='flex flex-col ml-2'>
            <div class=' text-blue-primary font-semibold'  style="font-size: 7px ; line-height: 9px;">WALLET</div>
            <div v-if='selectedWallet!=""' class='text-xs font-bold'>{{selectedWallet}} </div>
            <div v-if='selectedWallet==""' class='text-xs font-bold '>Select Wallet </div>
        </div>
        <div v-if='!toggleSelection && selectedWallet==""' class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Select</div>
        <div v-if='!toggleSelection && selectedWallet!=""'  class='text-xxs ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>Change</div>
        <img  v-if='toggleSelection' @click=' selectedWallet=""' src="@/assets/img/delete.svg" class='h-5 w-5 ml-auto cursor-pointer text-blue-primary font-semibold mt-auto mb-auto'>
    </div>
  </div>
  <div class='relative' style='left:16.7%'>
  <div v-if='toggleSelection' class='absolute border border-t-0 w-8/12  z-50 bg-white max-h-32 overflow-auto '>
    <div v-if='wallets.length>0' class='pt-2 pl-2 pb-2 font-semibold' style="font-size: 7px ; line-height: 9px;">SELECT WALLET</div>
    <div v-else class='text-xxs pt-2 pl-2 pb-2' >The list is empty.</div>
    <div v-for='(items,index) in wallets' :key="items" class='px-2 py-1 '>
        <div @click='selectWallet(items.label)' class='flex cursor-pointer'>
            <img src='@/assets/img/icon-wallet.svg' class='h-5 w-5 mt-auto mb-auto'>
            <div class='text-xs ml-1 mt-0.5 font-bold'>{{items.label}}</div>
            <div  v-if='items.label!=selectedWallet' class='cursor-pointer text-blue-primary text-xxs mt-0.5 ml-auto font-semibold'>SELECT</div>
            <div v-if='items.label==selectedWallet' class='text-gray-500 text-xxs mt-0.5 ml-auto'>CURRENT</div>
        </div>
        <div v-if="index != wallets.length - 1" class='gray-line mt-2'></div>
    </div>
  </div>
  </div>
</template>

<script>
import { networkState } from '@/state/networkState';
import { NetworkStateUtils } from '@/state/utils/networkStateUtils';
import { walletState } from '@/state/walletState';
import { computed, defineComponent, ref, watch, getCurrentInstance } from 'vue';

export default defineComponent({
  emits:[
    'select-wallet'
  ],
  name: 'SelectWalletInput',

  setup(p){
    const toggleSelection = ref(false);
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const selectedWallet = ref("");
    const selectWallet = (wallet)=>{
        selectedWallet.value = wallet
        toggleSelection.value = !toggleSelection.value
    }
    const wallets = computed(
      () =>{
        var w = [];
        walletState.wallets.filterByNetworkName(networkState.chainNetworkName).forEach((wallet)=>{
          w.push({
            value: wallet.name,
            label: wallet.name,
          });
        });
        w.sort((a, b) => {
          if (a.label > b.label) return 1;
          if (a.label < b.label) return -1;
          return 0;
        });
        return w;
      }
    );
    const updateWalletValue=()=>{
        emitter.emit('select-wallet',selectedWallet.value)
    }
    watch(selectedWallet,()=>{
        updateWalletValue()
    })
    
   emitter.on('switchNetwork',()=>{
       selectedWallet.value=''
   })
    return {
      updateWalletValue,
      selectWallet,
      wallets,
      toggleSelection,
      selectedWallet
    };
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";

</style>
