<template>
  <div :class="`${isLogin ? 'lg:ml-60' : ''} p-1 text-gray-700`">
    <h1 :class="`${isLogin ? '' : 'text-white'} text-lg mt-10 xl:mb-5 md:text-xl sm:mb-5  text-center`">
      {{ $t('wallet.myWallets') }}</h1>
    <div :class="`${isLogin ? '' : 'text-white'} text-sm md:px-5 xl:px-5 xl:mt-0 text-center`">
      {{ $t('wallet.walletsAvailable') }}</div>
    <div class="mt-4" :key="index" v-for="(item, index) in wallets">
      <WalletTile class="w-96 ml-auto mr-auto" :wallet="item" />
    </div>
    <div v-if="!isLogin" class="mt-8 text-center w-full">
      <div class="inline-block">
        <router-link :to="{ name: 'Home' }" class="flex items-center text-xs blue-btn py-4 px-10 ">{{
          $t('wallet.backHome') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import WalletTile from '@/modules/wallet/components/WalletTile.vue';
import { networkState } from "@/state/networkState";
import { walletState } from '@/state/walletState';

const isLogin = computed(() => {
  return walletState.currentLoggedInWallet
})

const wallets = computed(
  () => {
    var wallet = walletState.wallets.filterByNetworkName(networkState.chainNetworkName);
    return wallet;
  }
);

</script>
<style lang="scss" scoped>
.tileWidth {
  @media (min-width: 640px) {
    width: 28rem;
  }
}
</style>
