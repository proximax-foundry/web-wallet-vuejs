<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">ProximaX Sirius Wallet</h1>
    <h2 class="big-para">The secure interface that connects to the Proximax Sirius platform.</h2>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-2 sm:mt-10">
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-blockchain-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">Blockchain</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">Multisig, aggregated tx, cross chain, metadata.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">Storage</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">P2P decentralised storage for any type of file.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">Streaming</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">P2P decentralised streaming for video and chat.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">Supercontracts</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">Easily modifiable digital contracts.</div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-5 sm:py-16 grid xs:grid-cols-1 md:grid-cols-3">
        <div class="px-5 self-center">
          <SignInModal />
        </div>
        <div class="px-5">
          <SignInSiriusIDModal />
        </div>
        <div class="px-5 self-center"><router-link :to="{ name: 'ViewWalletCreateSelection' }" class="block big-default-btn my-3 self-center">Create</router-link></div>
      </div>
    </div>
  </div>
</template>

<script>
import SignInSiriusIDModal from '@/modules/home/components/SignInSiriusIDModal.vue'
import SignInModal from '@/modules/home/components/SignInModal.vue'
export default {
  name: 'Home',
  components: {
    SignInSiriusIDModal,
    SignInModal,
  },
}
</script>
