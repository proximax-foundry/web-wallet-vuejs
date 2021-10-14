<template>
  <div class="container mx-auto text-center w-80">
    <h1 class="big-title">{{$t('Header.walletTitle')}}</h1>
    <div class='my-3'>
      <p class="text-tsm mx-3 sm:text-tsm">{{$t('wallets.description', {network: networkState.chainNetworkName}) }}</p>
      <div v-if="wallets.length == 0" class="text-center h4 my-2">
        {{$t('wallets.walletvalidation')}}
      </div>
      <div class="mt-8" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
      </div>
    </div>
    <div class="mt-8 text-center w-full" v-if="!walletState.currentLoggedInWallet">
      <div class="inline-block">
        <router-link :to="{ name : 'Home'}" class="flex items-center text-xs text-blue-link"><img src="@/assets/img/chevron_left.svg" class="w-5 inline-block">Back to Home</router-link>
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
