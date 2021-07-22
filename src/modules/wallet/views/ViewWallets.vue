<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold big-title mt-20">{{$t('Header.wallet')}}</h1>
    <div class='mt-2 py-3 gray-line'>
      <p>{{$t('wallets.description', {network: networkState.chainNetworkName}) }}</p>
      <div v-if="wallets.length == 0" class="text-center h4 my-2">
        {{$t('wallets.walletvalidation')}}
      </div>
      <div class="grid xs-grid-cols-1 sm:grid-cols-2 mt-10" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
      </div>
    </div>
    <div class="mt-32" v-if="!walletState.currentLoggedInWallet">
      <router-link :to="{ name : 'Home'}" class="blue-btn p-3 px-5">{{$t('Header.home')}}</router-link>
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
