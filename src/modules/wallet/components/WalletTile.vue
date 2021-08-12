<template>
  <div class='p-3'>
    <div class="bg-gray-200 rounded-2xl flex justify-between py-3">
      <div class="ml-5 text-left text-sm"><div class="font-bold mb-1">{{ wallet.name }}</div><div class="text-xs">{{$t('common.account',(wallet.accounts.length>1)? 2 : 1)}}: <span class="font-bold">{{ wallet.accounts.length }}</span></div></div>
      <div class="mr-5 self-center"><router-link :to="{ name: 'ViewWalletDeleteConfirmation', params: { name: wallet.name, networkName: wallet.networkName}}" class="hover:font-bold"><img src="@/modules/wallet/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg" class="w-7 cursor-pointer"></router-link></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'WalletTile',
  props: {
    wallet: {
      type: Object,
      default: null,
    },
  },
});
</script>