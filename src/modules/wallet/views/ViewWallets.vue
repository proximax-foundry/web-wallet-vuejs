<template>

     <div :class="`${isLogin?'lg:ml-60':''} p-1 text-gray-700`">
        <h1 :class="`${isLogin?'':'text-white'} text-lg xl:mt-10 xl:mb-5 md:text-xl sm:mb-5  text-center`">My Wallets</h1>
        <div :class="`${isLogin?'':'text-white'} text-sm md:px-5 xl:px-5 xl:mt-0 text-center`">These are the Sirius Wallet available in the local storage of your device.</div>
        <div class="mt-4" :key="item" v-for="item in wallets">
          <WalletTile class="w-96 ml-auto mr-auto" :wallet="item" />
        </div>
        <div v-if="!isLogin" class="mt-8 text-center w-full">
          <div class="inline-block">
            <router-link :to="{ name : 'Home'}" class="flex items-center text-xs blue-btn py-4 px-10 ">Back to Home</router-link>
          </div>
        </div>
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
    const isLogin = computed(()=>{
      return walletState.currentLoggedInWallet
    })
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
      networkState,
      isLogin
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
