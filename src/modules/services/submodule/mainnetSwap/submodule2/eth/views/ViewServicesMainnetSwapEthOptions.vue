<template>
  <div>
    <div class="flex justify-between text-xs sm:text-sm">
      <div><span class="text-gray-400">Swap > ETH > </span> <span class="text-blue-primary font-bold">Select option</span></div>
      <div>
        <router-link :to="{ name: 'ViewServices'}" class="font-bold" active-class="accounts">{{$t('services.allservices')}}</router-link>
      </div>
    </div>
    <div class='mt-2 py-3 gray-line text-center'>
      <div class="text-lg sm:text-xl text-gray-600 font-bold mt-10">Please select an option</div>
      <div class="md:grid lg:grid-cols-3 mx-5 lg:mx-5 2xl:mx-60 mt-5">
        <div class="lg:col-span-1" :class="`${!isOutgoingOptionDisabled?'cursor-pointer':'' }`" @click="gotoOutgoingPage">
          <div class="m-5 lg:mx-3 rounded-2xl border option-div" :class="`${!isOutgoingOptionDisabled?'border-blue-primary hover:bg-blue-primary':'border-gray-200 bg-gray-300' }`">
            <div class="mt-5 sm:mt-10 font-bold text-xl mb-1" :class="`${!isOutgoingOptionDisabled?'text-blue-primary':'text-white' }`">Out <img src="@/modules/dashboard/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="h-8 w-8 inline-block ml-2"></div>
            <div class="mt-3 mb-5 sm:mb-10" :class="`${!isOutgoingOptionDisabled?'text-gray-500':'text-white' }`">{{ outgoingText }}</div>
          </div>
          <InlineMessage v-if="displayWaitMessage" severity="info" class="rounded">Retrieving information, please wait...</InlineMessage>
          <InlineMessage v-if="displaErrorMessage" severity="error">Service unavailable.</InlineMessage>
          <InlineMessage v-if="displaConnectionMessage" severity="error">Unable to connect.</InlineMessage>
        </div>
        <div class="lg:col-span-1">
          <router-link :to="{ name: 'ViewServicesMainnetSwapETHToSirius' }">
            <div class="m-5 lg:mx-3 rounded-2xl border border-blue-primary option-div hover:bg-blue-primary">
              <div class="mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1">In <img src="@/modules/dashboard/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg" class="h-8 w-8 inline-block ml-2"></div>
              <div class="mt-3 mb-5 sm:mb-10 text-gray-500">From ETH to Sirius</div>
            </div>
          </router-link>
        </div>
        <div class="lg:col-span-1">
          <router-link :to="{ name: 'ViewServicesMainnetSwapCheckETHToSirius' }">
            <div class="m-5 lg:mx-3 rounded-2xl border border-blue-primary option-div hover:bg-blue-primary">
              <div class="mt-5 sm:mt-10 text-blue-primary font-bold text-xl mb-1">Check status <img src="@/modules/services/submodule/mainnetSwap/img/check-status.svg" class="h-8 w-8 inline-block"></div>
              <div class="mt-3 mb-5 sm:mb-10 text-gray-500">Between ETH and Sirius</div>
            </div>
          </router-link>
        </div>
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
  name: 'ViewServicesMainnetSwapEthOptions',
  components: {
    InlineMessage
  },
  setup() {
    let swapData = new ChainSwapConfig(networkState.chainNetworkName);
    swapData.init();

    const baseURL = swapData.swap_XPX_ETH_URL;
    const priceURL = swapData.priceConsultURL;
    const router = useRouter();
    const outgoingText = ref('From Sirius to ETH');
    const isOutgoingOptionDisabled = ref(false);
    const displayWaitMessage = ref(false);
    const displaConnectionMessage = ref(false);
    const displaErrorMessage = ref(false);
    const isChecking = ref(false);

    const gotoOutgoingPage = async()=> {

      if(isChecking.value){
        return;
      }
      isOutgoingOptionDisabled.value = true;
      // outgoingText.value = "Getting your accounts. Please wait";

      isChecking.value = true;

      displayWaitMessage.value = true;
      displaConnectionMessage.value = false;
      displaErrorMessage.value = false;

      try {
        const response = await fetch(SwapUtils.checkSwapService(baseURL));
        const priceResponse = await fetch(SwapUtils.checkSwapPrice(priceURL));
        const priceData = await priceResponse.json();

        isChecking.value = false;

        if(priceData.xpx === 0 || priceData.eth === 0){
          displayWaitMessage.value = false;
          displaErrorMessage.value = true;
          isOutgoingOptionDisabled.value = false;
          return;
        }

        if(response.status == 200 && priceResponse.status == 200){
          displaErrorMessage.value = false;
          displayWaitMessage.value = false;
          router.push({ name: "ViewServicesMainnetSwapSiriusToETH"});
        }else{
          displayWaitMessage.value = false;
          displaErrorMessage.value = true;
          isOutgoingOptionDisabled.value = false;
        }
      } catch (error) {
        displayWaitMessage.value = false;
        displaErrorMessage.value = false;
        displaConnectionMessage.value = true;
        isOutgoingOptionDisabled.value = false;
        isChecking.value = false;
      }
      
    };

    return {
      gotoOutgoingPage,
      displayWaitMessage,
      displaErrorMessage,
      displaConnectionMessage,
      isOutgoingOptionDisabled,
      outgoingText,
    };
  },
}
</script>
<style lang="scss" scoped>
.option-div:hover{
  transition: all 0.5s;
  > div{
    @apply text-white;
  }
}
</style>