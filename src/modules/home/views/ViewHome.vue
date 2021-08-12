<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">{{$t('home.siriusWallet')}}</h1>
    <h2 class="big-para">{{$t('home.titleDescription')}}.</h2>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-2 sm:mt-10">
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-blockchain-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('common.blockchain')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('home.blockchainDescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('common.storage')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('home.storageDescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('common.streaming')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('home.streamingDescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('common.superContracts')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('home.superContractDescription')}}.</div>
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
        <div class="px-5 self-center"><router-link :to="{ name: 'ViewWalletCreateSelection' }" class="block big-default-btn my-3 self-center">{{$t('common.create')}}</router-link></div>
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
