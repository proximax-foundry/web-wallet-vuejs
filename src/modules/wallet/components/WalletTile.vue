<template>
  <div class='p-1'>
    <div class=" flex justify-between py-4 bg-white border border-blue-primary ">
      <div class="ml-7 text-left text-sm"><div class="mb-1">{{ wallet.name }}</div><div class="text-txs text-gray-400">Number of accounts: <span class="font-bold">{{ wallet.accounts.length }}</span></div></div>
      <div class="mr-7 self-center"><router-link :to="{ name: 'ViewWalletDeleteConfirmation', params: { name: wallet.name, networkName: wallet.networkName}}"><img src="@/modules/wallet/img/deleteWallet.svg" class="w-5 cursor-pointer"></router-link></div>
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