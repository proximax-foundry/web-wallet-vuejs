<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">ProximaX Swap Service</h1>
    <div class="mt-10">
      <div class="text-center p-5">
        <img src="@/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">Swap</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg text-gray-500">Swap from Ethereum <span class="text-txs text-black font-bold">ETH</span> / Binance Smart Change <span class="text-txs text-black font-bold">BSC</span> to Sirius <span class="text-txs text-black font-bold">XPX</span>.</div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-5 sm:py-16 grid xs:grid-cols-1 md:grid-cols-2">
        <div class="px-5 self-center w-64">
          <SignInModal />
        </div>
        <div class="px-5 self-center w-64"><router-link :to="{ name: 'ViewWalletCreateSelection' }" class="block big-default-btn my-3 self-center">Create</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
import SignInModal from '@/modules/home/components/SignInModal.vue'
export default {
  name: 'Home',
  components: {
    SignInModal,
  },
}
</script>
