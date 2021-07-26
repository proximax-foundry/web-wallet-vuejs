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
      <div class="md:col-span-1 clickable" @click="gotoOutgoingPage">
        <div class="m-5 lg:mx-10 rounded-2xl border border-blue-primary option-div">
          <div class="mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1">Out <img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="h-8 w-8 inline-block ml-2"></div>
          <div class="mt-3 mb-5 sm:mb-10 text-gray-500">From Sirius to BSC</div>
        </div>
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
import { useToast } from "primevue/usetoast";
import { networkState } from "@/state/networkState";

export default {
  name: 'ViewServicesMainnetSwapBscOptions',

  setup() {
    const toast = useToast();
    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const baseURL = swapData.swap_XPX_BSC_URL;
    const router = useRouter();

    const gotoOutgoingPage = async()=> {

      const response = await fetch(SwapUtils.checkSwapService(baseURL));

      if(response.status == 200){
        router.push({ name: "ViewServicesMainnetSwapSiriusToBSC"});
      }
      else{
        toast.add(
          {
            severity:'error', 
            summary: `Service unavailable`, 
            detail: `Service unavailable right now`, 
            group: 'br', 
            life: 3000
          }
        );
      }
    };

    return {
      gotoOutgoingPage
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