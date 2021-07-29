<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">Swap > BSC > </span> <span class="text-blue-primary font-bold">Select option</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices'}" class="font-bold" active-class="accounts">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="text-lg sm:text-xl text-gray-600 font-bold mt-10">Please select an option</div>
    <div class="md:grid md:grid-cols-2 mx-5 lg:mx-5 2xl:mx-60 mt-5">
      <div class="md:col-span-1">
        <div class="m-5 lg:mx-10 rounded-2xl border border-blue-primary option-div clickable" @click="gotoOutgoingPage">
          <div class="mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1">Out <img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="h-8 w-8 inline-block ml-2"></div>
          <div class="mt-3 mb-5 sm:mb-10 text-gray-500">From Sirius to BSC</div>
        </div>
        <InlineMessage v-if="displayWaitMessage" severity="info">Checking service, please wait.</InlineMessage>
        <InlineMessage v-if="displaErrorMessage" severity="error">Service unavailable.</InlineMessage>
      </div>
      <div class="md:col-span-1">
        <router-link :to="{ name: 'ViewServicesMainnetSwapBSCToSirius' }">
          <div class="m-5 lg:mx-10 rounded-2xl border border-blue-primary option-div">
            <div class="mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1">In <img src="@/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg" class="h-8 w-8 inline-block ml-2"></div>
            <div class="mt-3 mb-5 sm:mb-10 text-gray-500">From BSC to Sirius</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
import { SwapUtils } from "../../../../../../../util/swapUtils";
import { ChainSwapConfig } from "@/models/stores/chainSwapConfig";
import { networkState } from "@/state/networkState";
import InlineMessage from 'primevue/inlinemessage';
import {ref} from "vue";

export default {
  name: 'ViewServicesMainnetSwapBscOptions',
  components: {
    InlineMessage
  },
  setup() {
    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const baseURL = swapData.swap_XPX_BSC_URL;
    const priceURL = swapData.priceConsultURL;
    const router = useRouter();
    const displayWaitMessage = ref(false);
    const displaErrorMessage = ref(false);
    const isChecking = ref(false);

    const gotoOutgoingPage = async()=> {

      if(isChecking.value){
        return;
      }

      isChecking.value = true;

      displayWaitMessage.value = true;
      const response = await fetch(SwapUtils.checkSwapService(baseURL));
      const priceResponse = await fetch(SwapUtils.checkSwapPrice(priceURL));
      const priceData = await priceResponse.json();

      isChecking.value = false;

      if(priceData.xpx === 0 || priceData.bnb === 0){
        displaErrorMessage.value = true;
        return;
      }

      if(response.status == 200 && priceResponse.status == 200){
        displaErrorMessage.value = false;
        displayWaitMessage.value = false;
        router.push({ name: "ViewServicesMainnetSwapSiriusToBSC"});
      }
      else{
        displaErrorMessage.value = true;
      }
    };

    return {
      gotoOutgoingPage,
      displayWaitMessage,
      displaErrorMessage
    };
  },
}
</script>
<style lang="scss" scoped>
.option-div:hover{
  @apply bg-blue-primary;
  transition: all 0.5s;
  > div{
    @apply text-white;
  }
}

.clickable{
  cursor: pointer;
}
</style>