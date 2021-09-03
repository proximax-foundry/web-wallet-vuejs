<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">ProximaX Swap Service</h1>
    <div class="mt-10">
      <div class="text-center p-5">
        <img src="@/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">Swap</div>
        <div class="mt-3 text-xs sm:text-tsm md:text-tmd lg:text-tlg text-gray-500">Swap between<br><span class="text-gray-900">Ethereum (ERC20)</span> / <span class="text-gray-900">Binance Smart Chain (BEP20)</span> <br>and<br><span class="text-gray-900">ProximaX Sirius Chain</span></div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-5 sm:py-8 sm:mt-10">
        <label class="inline-flex items-center mb-2 sm:mb-5 px-5">
          <input type="checkbox" class="h-5 w-5 bg-blue-primary self-center" value="true" v-model="haveRead">
          <span class="ml-2 cursor-pointer text-tsm self-center">I confirm that I have read and understood the <a href="https://bit.ly/3mVayCu" target=_new class="text-blue-500 hover:underline">walkthrough<font-awesome-icon icon="external-link-alt" class="text-blue-500 w-3 h-3 self-center ml-1 relative" style="top: -1px"></font-awesome-icon></a>.</span>
        </label>
        <div class="grid xs:grid-cols-1 md:grid-cols-2">
          <div class="px-5 self-center w-full md:w-64">
            <SignInModal :enableLink="haveRead" />
          </div>
          <div class="px-5 self-center w-full md:w-64"><router-link :to="haveRead?createLink[1]:createLink[0]" class="block my-3 self-center :disabled:bg-gray-300" :class="`${!haveRead?'bg-gray-100 text-gray-300 px-10 py-3 md:py-5 text-sm font-bold rounded-3xl transition-all duration-500':'big-default-btn'}`">Create</router-link></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import SignInModal from '@/modules/home/components/SignInModal.vue'
export default {
  name: 'Home',
  components: {
    SignInModal,
  },
  setup() {
    const haveRead = ref(false);
    const createLink = ref([
      { name: 'Home' },
      { name: 'ViewWalletCreateSelection' }
    ])

    return {
      haveRead,
      createLink,
    }
  }
}
</script>
