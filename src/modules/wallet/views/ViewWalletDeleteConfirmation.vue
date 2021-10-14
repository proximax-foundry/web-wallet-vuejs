<template>
  <div class="container mx-auto text-center">
    <div class="mx-auto lg:mt-16">
      <h1 class="text-gray-800 font-normal text-sm mt-5">{{$t('deletewallet.wallettodelete')}}:</h1>
      <div class="mt-2 text-lg">{{ name }} <span class="text-xs">({{ networkName }})</span></div>
      <p class="mt-4 text-tsm">{{$t('deletewallet.accountsavailable')}}:</p>
      <div class="px-2 sm:px-0 text-left inline-block mt-3 sm:mt-5" v-if="accountsList.length > 0">
        <div v-for="i in accountsList" :key="i.address" class="bg-white rounded-md p-2 sm:p-5 w-full sm:w-82 mb-2">
          <div class="font-bold text-xs mb-2">{{ i.name }}</div>
          <div class="mb-2 text-xs break-all">{{ i.address }}</div>
        </div>
      </div>
      <div class="my-5 mx-1 text-tsm">{{$t('deletewallet.question')}}</div>
      <div class="mt-5 inline-block text-center">
        <ConfirmDeleteWalletModal :name="name" :networkName="networkName" />
        <div class="text-center mt-5">
          <router-link :to="{name: 'ViewWallets'}" class="inline-block mr-5 text-xs text-blue-link"><div class="flex items-center"><img src="@/assets/img/chevron_left.svg" class="inline-block">{{$t('deletewallet.goback')}}</div></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Wallets } from "@/models/wallets";
import { walletState } from "@/state/walletState"
import ConfirmDeleteWalletModal from '@/modules/wallet/components/ConfirmDeleteWalletModal.vue';
import { Helper } from '@/util/typeHelper';

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
      var w = walletState.wallets.filterByNetworkNameAndName( p.networkName, p.name).accounts.map((account) => {
        { return { name: account.name, address: Helper.createAddress(account.address).pretty() }}
      });
      if(w){
        return w;
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
