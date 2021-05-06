<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold big-title mt-20">Wallets</h1>
    <div class='mt-2 py-3 gray-line'>
      <p>These are the Sirius Wallets available in the local storage of your device.</p>
      <div v-if="wallets == 0" class="text-center h4 my-2">
        No wallets found
      </div>
      <div class="grid xs-grid-cols-1 sm:grid-cols-2 mt-10" v-else>
        <WalletTile :key="item.name" v-for="item in wallets" :wallet="item" @delete="appStore.deleteWallet(item.name)" />
      </div>
    </div>
    <div class="mt-32">
      <router-link :to="{ name : 'Welcome'}" class="blue-btn p-3 px-5">Home</router-link>
    </div>
    <NotificationModal :toggleModal="toggleModal" msg="Wallet has been removed successfully" notiType="noti" time='1500' />
  </div>
</template>

<script>
import { inject, computed } from "vue";
import WalletTile from '@/components/WalletTile.vue';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  name: 'ViewWallets',
  props:[
    'deleteWallet'
  ],
  components: {
    WalletTile, NotificationModal
  },
  data() {
    return {
      toggleModal: false,
    };
  },
  setup() {
    const appStore = inject("appStore");
    const siriusStore = inject("siriusStore");
    const selectedNetworkName = computed(()=> siriusStore.chainNetworkName);
    const wallets = computed(
      () =>{
        var w = appStore.state.wallets.filter((i)=> i.networkName === selectedNetworkName.value);
        return w;
      }
    );
    return {
      appStore,
      wallets
    };
  },
  created(){
    if(this.deleteWallet=='success'){
      this.toggleModal = true;
    }
    this.emitter.on("CLOSE_NOTIFICATION", payload => {
      this.toggleModal = payload;
    });
  }
}
</script>
