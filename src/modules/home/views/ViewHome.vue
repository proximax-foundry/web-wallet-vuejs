<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">ProximaX Swap Service</h1>
    <div class="mt-10">
      <div class="text-center p-5">
        <img src="@/modules/services/img/icon-swap-process-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">Swap</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">Swap from eXPX or bXPX to Sirius.</div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-16 grid xs:grid-cols-1 md:grid-cols-2">
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
