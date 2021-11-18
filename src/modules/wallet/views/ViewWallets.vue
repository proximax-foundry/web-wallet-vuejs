<template>
  <div class="container mx-auto text-center  w-80 tileWidth" >
    <h1 class="text-white text-xxl font-bold">{{$t('Header.walletTitle')}}</h1>
    <div class='mt-12'>
      <p class="text-tsm mx-3 sm:text-tsm text-white font-semibold">{{$t('wallets.description') }}.</p>
      <div v-if="wallets.length == 0" class="text-center h4 my-2 text-white">
        {{$t('wallets.walletvalidation')}}.
      </div>
      <div class="mt-8" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
      </div>
    </div>
    <div class="mt-8 text-center w-full" v-if="!walletState.currentLoggedInWallet">
      <div class="inline-block">
        <router-link :to="{ name : 'Home'}" class="flex items-center text-xs blue-btn py-3 px-8 ">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import WalletTile from '@/modules/wallet/components/WalletTile.vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';
import { useToast } from "primevue/usetoast";
import { WalletUtils } from "../../../util/walletUtils"

export default {
  name: 'ViewWallets',
  props:[
    'deleteWallet'
  ],
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

    WalletUtils.initFixOldFormat(walletState.wallets);

    if(p.deleteWallet=='success'){
      toast.add({severity:'success', summary: 'Notification', detail: 'Wallet has been removed successfully', group: 'br', life: 5000});
    }

    return {
      wallets,
      walletState,
      networkState,
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
