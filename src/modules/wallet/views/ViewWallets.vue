<template>
<div class="xl:flex xl:justify-between pb-3 xl:pb-0">
    <div class="ml-20 mt-10">
       <h1 v-if="walletState.currentLoggedInWallet" class="font-bold text-base mb-5 ml-20 text-black">{{$t('Header.wallet')}}</h1>
        <h1 v-else class="font-bold text-base mb-5 text-white">{{$t('Header.wallet')}}</h1>
       <template>
      <!-- <p class="text-tsm sm:text-tsm text-white font-semibold">{{$t('wallets.description') }}.</p> -->
       </template>
      <div v-if="wallets.length == 0 && walletState.currentLoggedInWallet" class=" h4 my-2 text-black">
        {{$t('wallets.walletvalidation')}}.
      </div>
       <div v-if="wallets.length == 0 && !walletState.currentLoggedInWallet" class="text-center h4 my-2 text-white">
        {{$t('wallets.walletvalidation')}}.
      </div>
      <div class="ml-20 grid grid-cols-1 grid-cols-2 gap-2" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
      </div>
    </div>
    <template>
    <!-- <div class="mt-8 text-center w-full" v-if="!walletState.currentLoggedInWallet">
      <div class="inline-block">
        <router-link :to="{ name : 'Home'}" class="flex items-center text-xs blue-btn py-3 px-8 ">Back to Home</router-link>
      </div>
    </div> -->
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
