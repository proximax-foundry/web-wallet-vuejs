<template>
<div class="sm:ml-0 xl:flex xl:justify-between pb-3">
    <div v-if="walletState.currentLoggedInWallet" class="sm:ml-0 xl:ml-15 xl:mt-10 md:px-10">
       <h1 class="text-lg md:text-xl xl:text-xl mb-5 ml-5 text-black xl:ml-5 sm:ml-0">{{$t('Header.wallet')}}</h1>
       <template>
      <!-- <p class="text-tsm sm:text-tsm text-white font-semibold">{{$t('wallets.description') }}.</p> -->
       </template>
      <div v-if="wallets.length == 0 && walletState.currentLoggedInWallet" class="h4 my-2 text-black sm:ml-0">
        {{$t('wallets.walletvalidation')}}.
      </div>
       <div v-if="wallets.length == 0 && !walletState.currentLoggedInWallet" class="text-center h4 my-2 text-white sm:ml-0">
        {{$t('wallets.walletvalidation')}}.
      </div>
      <!-- <div class="grid grid-cols-1 sm:ml-0 md:grid-cols-2 md:gap-6 xl:ml-2 xl:mr-2 xl:grid-cols-2 lg:grid-cols-3 xl:gap-6" v-else> -->
        <div class="grid grid-cols-1 sm:ml-0 md:grid-cols-2 md:gap-6 xl:ml-0 xl:mr-20 xl:gap-6 2xl:grid-cols-4 xl:grid-cols-3 fixed" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
      </div>
    </div>
     <div v-else class="p-1 text-tsm md:col-span-1 sm:pt-20 md:text-sm text-gray-700">
        <h1 class="text-lg xl:mt-10 xl:mb-5 md:text-xl sm:mb-5 text-white text-center">My Wallets</h1>
        <div class="text-sm md:px-5 text-white xl:px-5 xl:mt-0 text-center">These are the Sirius Wallet available in the local storage of your device.</div>
        <div class="grid grid-cols-1 xl:mr-2 xl:ml-2 md:mr-10 md:ml-20 md:mr-20 md:mt-8 sm:ml-20 sm:mr-20" >
          <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
        </div>
        <div class="mt-8 text-center w-full">
          <div class="inline-block">
            <router-link :to="{ name : 'Home'}" class="flex items-center text-xs blue-btn py-4 px-10 ">Back to Home</router-link>
          </div>
        </div>
     </div>
    <template>
  
    </template>
</div>
</template>

<script>
import { computed } from "vue";
import WalletTile from '@/modules/wallet/components/WalletTile.vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { useToast } from "primevue/usetoast";
import { WalletUtils } from "../../../util/walletUtils"

export default {
  name: 'ViewWallets',
  components: {
    WalletTile
  },
  setup(p) {
    
    const toast = useToast();
    
    const wallets = computed(
      () =>{
        var wallet = walletState.wallets.filterByNetworkName(networkState.chainNetworkName);
        return wallet;
      }
    );

    if(p.deleteWallet=='success'){
      toast.add({severity:'success', summary: 'Notification', detail: 'Wallet has been removed successfully', group: 'br', life: 5000});
    }

    return {
      wallets,
      walletState,
      networkState
    };
  },
}
</script>
<style lang="scss" scoped>
.tileWidth{
@media (min-width: 640px) { 
  width: 28rem ;
}
}

</style>
