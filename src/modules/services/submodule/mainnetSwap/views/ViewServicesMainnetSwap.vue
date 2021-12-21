<template>
<div>
  <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
    <div class='mt-6 px-6 py-10 border filter shadow-lg text-center'>
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
            <div class="py-3 px-5 text-sm font-bold transition-all duration-500 flex justify-between" :class="`${!displayWaitMessage['eth']?'cursor-pointer hover:bg-blue-500 hover:text-white':''}`" @click="gotoOutgoingPage('eth')">{{ displayOutgoingETHSwapLabel }}<div v-if="displayWaitMessage['eth']" style="border-top-color:transparent" class="inline-block ml-2 w-5 h-5 border-4 border-gray-700 border-solid rounded-full animate-spin"></div></div>
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
            <div class="py-3 px-5 text-sm font-bold transition-all duration-500 flex justify-between" :class="`${!displayWaitMessage['bsc']?'cursor-pointer hover:bg-blue-500 hover:text-white':''}`" @click="gotoOutgoingPage('bsc')">{{ displayOutgoingBSCSwapLabel }}<div v-if="displayWaitMessage['bsc']" style="border-top-color:transparent" class="inline-block ml-2 w-5 h-5 border-4 border-gray-700 border-solid rounded-full animate-spin"></div></div>
            <router-link :to="{ name: 'ViewServicesMainnetSwapCheckBSCToSirius' }" class="block py-3 px-5 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer">Check Status</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { SwapUtils } from "@/util/swapUtils";
import { networkState } from "@/state/networkState";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
export default {
    name: "ViewServicesMainnetSwap",

    setup(){
      const open = ref([]);
      open.value['nis1', 'eth', 'bsc'] = false;
      let type = ['nis1', 'eth', 'bsc'];
      const openMenu = (coinType) => {
        if(coinType == 'nis1' && !isOutgoingOptionDisabled.value['nis1']){
          open.value['nis1'] = !open.value['nis1'];
        }else if(coinType == 'eth' && !isOutgoingOptionDisabled.value['eth']){
          open.value['eth'] = !open.value['eth'];
        }else if(coinType == 'bsc' && !isOutgoingOptionDisabled.value['bsc']){
          open.value['bsc'] = !open.value['bsc'];
        }
      };

    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const baseURL = swapData.swap_XPX_ETH_URL;
    const priceURL = swapData.priceConsultURL;
    const router = useRouter();
    const isOutgoingOptionDisabled = ref([]);
    isOutgoingOptionDisabled.value['nis1', 'eth', 'bsc'] = false;
    const displayWaitMessage = ref([]);
    displayWaitMessage.value['nis1', 'eth', 'bsc'] = false;
    const displayConnectionMessage = ref([]);
    displayConnectionMessage.value['nis1', 'eth', 'bsc'] = false;
    const displayErrorMessage = ref([]);
    displayErrorMessage.value['nis1', 'eth', 'bsc'] = false;
    const isChecking = ref([]);
    isChecking.value['nis1', 'eth', 'bsc'] = false;

    const displayOutgoingNIS1SwapLabel = computed(() => {
      let label = 'Sirius Chain to NIS1';
      if(displayConnectionMessage.value['nis1']){
        return 'Unable to connect';
      }else if(displayErrorMessage.value['nis1']){
        return 'Service unavailable';
      }else{
        return label;
      }
    });

    const displayOutgoingETHSwapLabel = computed(() => {
      let label = 'Sirius Chain to ETH';
      if(displayConnectionMessage.value['eth']){
        return 'Unable to connect';
      }else if(displayErrorMessage.value['eth']){
        return 'Service unavailable';
      }else{
        return label;
      }
    });

    const displayOutgoingBSCSwapLabel = computed(() => {
      let label = 'Sirius Chain to BSC';
      if(displayConnectionMessage.value['bsc']){
        return 'Unable to connect';
      }else if(displayErrorMessage.value['bsc']){
        return 'Service unavailable';
      }else{
        return label;
      }
    });

    const gotoOutgoingPage = async(coin)=> {

      if(isChecking.value[coin]){
        return;
      }
      isOutgoingOptionDisabled.value[coin] = true;
      // outgoingText.value = "Getting your accounts. Please wait";

      isChecking.value[coin] = true;

      displayWaitMessage.value[coin] = true;
      displayConnectionMessage.value[coin] = false;
      displayErrorMessage.value[coin] = false;

      try {
        const response = await fetch(SwapUtils.checkSwapService(baseURL));
        const priceResponse = await fetch(SwapUtils.checkSwapPrice(priceURL));
        const priceData = await priceResponse.json();

        isChecking.value[coin] = false;
        let priceDataExternalCoin
        if(coin == 'eth'){
          priceDataExternalCoin = priceData.eth;
        }else if(coin == 'bsc'){
          priceDataExternalCoin = priceData.bsc;
        }

        if(priceData.xpx === 0 || priceDataExternalCoin === 0){
          displayWaitMessage.value[coin] = false;
          displayErrorMessage.value[coin] = true;
          isOutgoingOptionDisabled.value[coin] = false;
          return;
        }

        if(response.status == 200 && priceResponse.status == 200){
          displayErrorMessage.value[coin] = false;
          displayWaitMessage.value[coin] = false;
          if(coin == 'eth'){
            router.push({ name: "ViewServicesMainnetSwapSiriusToETH"});
          }else if(coin == 'bsc'){
            router.push({ name: "ViewServicesMainnetSwapSiriusToBSC"});
          }
        }else{
          displayWaitMessage.value[coin] = false;
          displayErrorMessage.value[coin] = true;
          isOutgoingOptionDisabled.value = false;
        }
      } catch (error) {
        displayWaitMessage.value[coin] = false;
        displayErrorMessage.value[coin] = false;
        displayConnectionMessage.value[coin] = true;
        isOutgoingOptionDisabled.value[coin] = false;
        isChecking.value[coin] = false;
      }
    }

    return {
      open,
      openMenu,
      isChecking,
      displayWaitMessage,
      displayErrorMessage,
      displayConnectionMessage,
      isOutgoingOptionDisabled,
      gotoOutgoingPage,
      displayOutgoingETHSwapLabel,
      displayOutgoingBSCSwapLabel,
      displayOutgoingNIS1SwapLabel,
    }
  }
}
</script>