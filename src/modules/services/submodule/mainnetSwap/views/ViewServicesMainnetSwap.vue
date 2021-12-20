<template>
<div>
  <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
    <div class='mt-6 p-6 border filter shadow-lg text-center'>
      <div class="text-md mb-3">Main Network Swap</div>
      <div class="text-xs max-w-md inline-block">You can swap from NIS1, ETH and BSC to ProximaX Sirius Chain. In reverse, ProximaX Sirius Chain is available to swap in ETH and BSC only.</div>
      <br>
      <div class="inline-block relative w-full sm:w-80 text-left mt-5 transition-all duration-500">
        <div class="border inline-block w-full shadow-md filter" :class="`${open['nis1']?'border-blue-500':'border-gray-200'}`" style="top: 0px;" @click="openMenu('nis1')">
          <div class="flex items-center w-full px-5 h-20 cursor-pointer hover:bg-blue-50 transition-all duration-500" :class="`${open['nis1']?'bg-blue-50':'bg-white'}`">
            <img src="@/modules/services/submodule/mainnetSwap/img/nem.svg" class="float-left">
            <div class="text-left pl-5">
              <div class="text-md font-bold">NIS1</div>
              <div class="text-xs">NEM</div>
            </div>
          </div>
          <div class="w-full text-left z-20 bg-white" v-if="open['nis1']">
            <div class="bg-blue-100 border-blue-100 uppercase py-2 px-5 text-xxs">Select option</div>
            <div class="py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">NIS1 to Sirius Chain</div>
            <div class="py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Sirius Chain to NIS1</div>
            <div class="py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Check Status</div>
          </div>
        </div>
        <br>
        <div class="border inline-block w-full mt-4 rounded shadow-md filter" :class="`${open['eth']?'border-blue-500':'border-gray-200'}`" style="top: 95px;" @click="openMenu('eth')">
          <div class="flex items-center w-full px-5 h-20 cursor-pointer hover:bg-blue-50 transition-all duration-500" :class="`${open['eth']?'bg-blue-50':'bg-white'}`">
            <img src="@/modules/services/submodule/mainnetSwap/img/eth.svg" class="float-left">
            <div class="text-left pl-5">
              <div class="text-md font-bold">ETH</div>
              <div class="text-xs">Ethereum</div>
            </div>
          </div>
          <div class="w-full text-left z-20 bg-white" v-if="open['eth']">
            <div class="bg-blue-100 border-blue-100 uppercase py-2 px-5 text-xxs">Select option</div>
            <router-link :to="{ name: 'ViewServicesMainnetSwapETHToSirius' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">ETH to Sirius Chain</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwapSiriusToETH' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Sirius Chain to ETH</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwapCheckETHToSirius' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Check Status</router-link>
          </div>
        </div>
        <br>
        <div class="border inline-block w-full mt-4 rounded shadow-md filter" :class="`${open['bsc']?'border-blue-500':'border-gray-200'}`" style="top: 205px;" @click="openMenu('bsc')">
          <div class="flex items-center w-full px-5 h-20 cursor-pointer hover:bg-blue-50 transition-all duration-500" :class="`${open['bsc']?'bg-blue-50':'bg-white'}`">
            <img src="@/modules/services/submodule/mainnetSwap/img/bsc.svg" class="float-left">
            <div class="text-left pl-5">
              <div class="text-md font-bold">BSC</div>
              <div class="text-xs">Binance Smart Chain</div>
            </div>
          </div>
          <div class="w-full text-left z-20 bg-white" v-if="open['bsc']">
            <div class="bg-blue-100 border-blue-100 uppercase py-2 px-5 text-xxs">Select option</div>
            <router-link :to="{ name: 'ViewServicesMainnetSwapBSCToSirius' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">BSC to Sirius Chain</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwapSiriusToBSC' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Sirius Chain to BSC</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwapCheckBSCToSirius' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Check Status</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref } from "vue";
export default {
    name: "ViewServicesMainnetSwap",

    setup(){
      const open = ref([]);
      open.value['nis1', 'eth', 'bsc'] = false;
      let type = ['nis1', 'eth', 'bsc'];
      const openMenu = (coinType) => {
        if(coinType == 'nis1'){
          open.value['nis1'] = !open.value['nis1'];
        }else if(coinType == 'eth'){
          open.value['eth'] = !open.value['eth'];
        }else{
          open.value['bsc'] = !open.value['bsc'];
        }
      };

      return {
        open,
        openMenu
      }
    }
}
</script>