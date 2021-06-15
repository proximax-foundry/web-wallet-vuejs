<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold big-title mt-20">Wallets</h1>
    <div class='mt-2 py-3 gray-line'>
      <p>These are the {{siriusStore.state.chainNetworkName}} Wallets available in the local storage of your device.</p>
      <div v-if="wallets.length == 0" class="text-center h4 my-2">
        No wallets found
      </div>
      <div class="grid xs-grid-cols-1 sm:grid-cols-2 mt-10" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" />
      </div>
    </div>
    <div class="mt-32" v-if="!appStore.state.currentLoggedInWallet">
      <router-link :to="{ name : 'Home'}" class="blue-btn p-3 px-5">Home</router-link>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import WalletTile from '@/modules/wallet/components/WalletTile.vue';

import { useToast } from "primevue/usetoast";

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
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const wallets = computed(
      () =>{
        var wallet = appStore.state.wallets.filter((i)=> i.networkName === siriusStore.state.chainNetworkName);
        return wallet;
      }
    );

    if(p.deleteWallet=='success'){
      toast.add({severity:'success', summary: 'Notification', detail: 'Wallet has been removed successfully', group: 'br', life: 5000});
    }

    return {
      wallets,
      appStore,
      siriusStore,
    };
  },
}
</script>
