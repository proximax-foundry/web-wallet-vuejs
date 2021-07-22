<template>
  <div class="container mx-auto text-center md:px-20 lg:px-40 mt-10">
    <h1 class="big-title">{{$t('Header.siriuswallet')}}</h1>
    <h2>{{$t('welcome.titledescription')}}.</h2>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-10">
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-blockchain-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">{{$t('welcome.blockchain')}}</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.blockchaindescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">{{$t('welcome.storage')}}</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.storagedescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">{{$t('welcome.streaming')}}</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.streamingdescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg" class="w-36 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-md md:text-md lg:text-lg">{{$t('welcome.supercontracts')}}</div>
        <div class=" sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.supercontractdescription')}}.</div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-16 grid xs:grid-cols-1 md:grid-cols-3">
        <div class="px-5 self-center">
          <SignInModal />
        </div>
        <div class="px-5">
          <SignInSiriusIDModal />
        </div>
        <div class="px-5 self-center"><router-link :to="{ name: 'ViewWalletCreateSelection' }" class="block big-default-btn my-3 self-center">{{$t('welcome.create')}}</router-link></div>
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
