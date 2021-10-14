<template>
  <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 ">
    <div class="md:col-span-1 p-5 md:p-20 text-tsm md:text-sm text-gray-700 ">
      <div class="text-sm my-2 md:text-xl md:my-7">ProximaX Sirius Wallet</div>
      <div class="md:w-72">Build robust blockchain integrations that help you to get the most value out of ProximaX Sirius platform.</div>
    </div>
      <div class = 'md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md mt-12 '>
        <div class = ' text-center mt-12 text-gray-700 text-bold text-lg'>Sign In</div>
        <div class="px-5 text-gray-700  text-lg text-tsm">
          <SignInModal />
        </div>
        <h2 class = 'my-10 ml-auto mr-auto'><span class = 'text-semibold'>or</span></h2>
        <div class="px-5 mt-4  text-center">
          <router-link :to="{ name: 'ViewHomeSignInSiriusID' }" >
            <div class="siriusID-btn bg-gray-300 py-2 w-8/12 ml-auto mr-auto">
            <img src="@/assets/img/sirius-id-icon.svg" class="h-6 w-6 inline-block">{{$t('welcome.signinwithsiriusid')}}
            </div>
            </router-link>
        </div>
        <div class = 'text-center text-xs mt-6 mb-1'>No Sirius Account wallet yet?</div>
        <div  class="text-center  text-xs text-blue-link mb-16"><router-link :to="{ name: 'ViewWalletCreateSelection' }">Create Account Wallet ></router-link></div>
    </div>
  </div>

   
    <!-- <h1 class="big-title">{{$t('Header.siriuswallet')}}</h1>
    <h2 class="big-para">{{$t('welcome.titledescription')}}.</h2>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-2 sm:mt-10">
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-blockchain-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('welcome.blockchain')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.blockchaindescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-storage-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('welcome.storage')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.storagedescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-streaming-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('welcome.streaming')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.streamingdescription')}}.</div>
      </div>
      <div class="text-center p-5">
        <img src="@/modules/home/img/icon-supercontracts-full-color-80h-proximax-sirius-wallet.svg" class="w-20 md:w-28 lg:w-18 inline-block mb-3">
        <div class="font-bold text-sm md:text-md lg:text-lg">{{$t('welcome.supercontracts')}}</div>
        <div class="text-xs sm:text-tsm md:text-tmd lg:text-tlg">{{$t('welcome.supercontractdescription')}}.</div>
      </div>
    </div>
    <div class="inline-block mt-5">
      <div class="gray-line py-5 sm:py-16 grid xs:grid-cols-1 md:grid-cols-3">
        <div class="px-5 self-center">
          <SignInModal />
        </div>
        <div class="px-5">
          <router-link :to="{ name: 'ViewHomeSignInSiriusID' }" class="block big-default-btn my-3 self-center">{{$t('welcome.signinwithsiriusid')}}</router-link>
        </div>
        <div class="px-5 self-center"><router-link :to="{ name: 'ViewWalletCreateSelection' }" class="block big-default-btn my-3 self-center">{{$t('welcome.create')}}</router-link></div>
      </div>
    </div> -->
  
</template>

<script>
//import SignInSiriusIDModal from '@/modules/home/views/ViewHomeSignInSiriusID.vue'
import SignInModal from '@/modules/home/components/SignInModal.vue'
export default {
  name: 'Home',
  components: {
     //SignInSiriusIDModal,
    SignInModal,
  },
}
</script>

<style>
h2 {
   width: 60%; 
   text-align: center; 
   border-bottom: 1px solid #aeaeae; 
   line-height: 0.1em;
   margin: 10px 0 20px; 
} 

h2 span { 
    background:#fff; 
    padding:0 5px; 
}
</style>