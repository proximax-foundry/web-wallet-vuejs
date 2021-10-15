<template>
  <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40 ">
    <IntroTextComponent />
    <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
      <div class = 'text-center mt-16 text-gray-700 text-lg'>Sign In</div>
      <div class="px-5 text-gray-700 md:text-lg text-tsm">
        <SignInComponent />
      </div>
      <h2 class = 'my-10 ml-auto mr-auto'><span class = 'text-semibold'>or</span></h2>
      <div class="px-5 mt-4  text-center">
        <router-link :to="{ name: 'ViewHomeSignInSiriusID' }" >
          <div class="sirius-id-button bg-gray-300 py-2 w-8/12 ml-auto mr-auto">
          <img src="@/assets/img/sirius-id-icon.svg" class="h-6 inline-block mr-1">{{$t('welcome.signinwithsiriusid')}}
          </div>
          </router-link>
      </div>
      <div class ='text-center text-xs mt-6 mb-1'>No Sirius Account wallet yet?</div>
      <div class ="text-center  text-xs text-blue-link"><router-link :to="{ name: 'ViewWalletCreateSelection' }">Create Account Wallet ></router-link></div>
      <div class = 'h-16 '></div>
    </div>
  </div>
</template>

<script>
//import SignInSiriusIDModal from '@/modules/home/views/ViewHomeSignInSiriusID.vue'
import SignInComponent from '@/modules/home/components/SignInComponent.vue'
import IntroTextComponent from '@/components/IntroTextComponent.vue'
export default {
  name: 'Home',
  components: {
     //SignInSiriusIDModal,
    SignInComponent,
    IntroTextComponent,
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
  padding: 0 5px; 
}

.sirius-id-button{
 
  @apply text-xs text-black font-extralight transition-all duration-500 hover:bg-opacity-90 hover:shadow-lg focus:outline-none
}
</style>