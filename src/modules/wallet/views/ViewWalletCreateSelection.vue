<template>
<div>
  <div class="container mx-auto md:grid md:grid-cols-2 md:mt-10 lg:px-20 xl:px-40  gap-4">
    <IntroTextComponent />
    <div class="md:col-span-1 bg-white mx-5 md:mx-0 px-30 pt-1 md:pt-0 rounded-md">
      <router-link :to="{ name: 'Home' }" class="text-xs m-2 text-blue-link items-center flex"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">{{$t('general.back')}}</router-link>
      <div class="text-sm text-center mt-20 mb-6 font-semibold">{{$t('wallet.createWallet')}} </div>
      <div class = 'radio-toolbar text-center'>
        <input name = 'create-type' type='radio' id='new-wallet' value = '0' v-model='currentValue'  :checked='true'>   
        <label for = 'new-wallet' class = 'text-left py-3 text-xs pl-4'> 
          <img  src="@/modules/wallet/img/icon-add-new.svg" class=" h-6 w-6 inline-block mr-1"> 
          {{$t('wallet.newWallet')}} 
          <font-awesome-icon  v-if = 'currentValue==0' class = 'p-1 mr-2 mt-1 float-right text-gray-200 bg-blue-primary rounded-full text-sm' icon="check" ></font-awesome-icon>
        </label>
        <input name = 'create-type' type='radio' id='from-pk' value= '1'  v-model='currentValue'>   
        <label for = 'from-pk' class = ' text-left py-3 text-xs pl-4 '> 
          <img src="@/modules/wallet/img/icon-private-key.svg" class=" h-6 w-6 inline-block mr-1"> 
          {{$t('general.fromPrivateKey')}}
          <font-awesome-icon  v-if = 'currentValue==1' class = 'p-1 mr-2 mt-1 float-right text-gray-200 bg-blue-primary rounded-full text-sm' icon="check" ></font-awesome-icon>
        </label>
        <input name = 'create-type' type='radio' id='import' value= '2'  v-model='currentValue' >   
        <label for = 'import' class = 'text-left py-3 text-xs pl-4'> 
          <img src="@/modules/wallet/img/icon-wallet-import.svg" class=" h-6 w-6 inline-block mr-1"> 
          {{$t('wallet.fromBackUp')}}
          <font-awesome-icon v-if = 'currentValue==2' class = 'p-1 mr-2 mt-1 float-right text-gray-200 bg-blue-primary rounded-full text-sm ' icon="check" ></font-awesome-icon>
        </label>
     </div>
      <router-link v-if='currentValue==0' :to="{ name: 'ViewWalletCreate' }" class = 'mt-3 font-bold text-center blue-btn py-2 px-10 block ml-auto mr-auto w-8/12'>{{$t('general.next')}}</router-link>
      <router-link v-if='currentValue==1' :to="{ name: 'ViewWalletCreatePrivateKey' }" class = 'mt-3 font-bold text-center blue-btn py-2 block ml-auto mr-auto w-8/12'>{{$t('general.next')}}</router-link>
      <router-link v-if='currentValue==2' :to="{ name: 'ViewWalletImport' }" class = 'mt-3 font-bold text-center blue-btn py-2 block ml-auto mr-auto w-8/12'>{{$t('general.next')}}</router-link>
      <div class = 'h-28'></div>
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent,ref} from 'vue';
import IntroTextComponent from '@/components/IntroTextComponent.vue'


export default defineComponent({
  name: 'ViewWalletCreateSelection',
  components: {
    IntroTextComponent,
  },
  setup(){
    let currentValue = ref(0)
    return {
      currentValue,
    };
  },
});
</script>

<style lang = 'scss' scoped>
.radio-toolbar {
	input[type="radio"] {
		opacity: 0;
		width: 0;
	}
	label {
		display: inline-block;
		border: 1px solid #D3D3D3;
		width: 66.67%;
		&:nth-child(4) {
			display: inline-block;
			border-left: 1px solid #d3d3d3;
			border-right: 1px solid #d3d3d3;
			border-top: 0px solid #d3d3d3;
			border-bottom: 0px solid #d3d3d3;
			width: 66.67%;
		}
	}
}
</style>