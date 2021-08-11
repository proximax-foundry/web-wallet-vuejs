<template>
  <div class="container mx-auto text-center">
    <div class="mx-auto page-title-gray-line lg:mt-16">
      <h1 class="text-gray-800 font-normal text-txl mt-5">{{$t('deletewallet.wallettodelete')}}:</h1>
      <div class="mt-2 text-xl">{{ name }}</div>
      <h1 class="text-gray-800 font-normal text-txl mt-5">Network:</h1>
      <div class="mt-2 text-xl">{{ networkName }}</div>
      <p class="mt-6">{{$t('deletewallet.accountsavailable')}}:</p>
      <div class="bg-gray-200 rounded-2xl text-left p-5 w-full lg:w-9/12 inline-block mt-5" v-if="accountsList.length > 0">
        <div v-for="i in accountsList" :key="i.address">
          <div class="font-bold text-sm">{{ i.name }}</div>
          <div class="mb-2 text-tsm">{{ i.address }}</div>
        </div>
      </div>
      <div class="my-5">{{$t('deletewallet.question')}}</div>
      <div class="mt-10">
        <router-link :to="{name: 'ViewWallets'}" class="default-btn mr-5 w-50 inline-block">{{$t('deletewallet.goback')}}</router-link>
        <ConfirmDeleteWalletModal :name="name" :networkName="networkName" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Wallets } from "@/models/wallets";
import { walletState } from "@/state/walletState"
import ConfirmDeleteWalletModal from '@/modules/wallet/components/ConfirmDeleteWalletModal.vue';

export default defineComponent({
  name: 'ViewWalletDeleteConfirmation',
  props: ['name', 'networkName'],
  components: {
    ConfirmDeleteWalletModal
  },
  data() {
    return {
      deleteWallet: false
    };
  },

  setup(p){
    const accountsList = computed(() =>{
      var w = walletState.wallets.filterByNetworkNameAndName( p.networkName, p.name);
      if(w){
        return w.accounts;
      }else{
        return '';
      }
    });

    return {
      accountsList
    };
  },
});
</script>
