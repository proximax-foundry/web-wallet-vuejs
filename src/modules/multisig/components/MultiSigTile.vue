<template>
  <div class='p-3'>
    <div class="rounded-2xl flex justify-between py-3 border border-gray-200 bg-white">
      <div class="ml-5 text-left text-sm w-full">
        <div class="font-bold mb-1">{{ account.name }}</div>
        <div class="flex justify-between pr-4 rounded-xl mb-4 items-center bg-white">
          <div class="text-left w-full relative">
            <div class="z-20 w-full h-full">{{ appStore.pretty(account.address) }}</div>
          </div>
          <div class="relative inline-block text-left" @mouseover="hoverOverMenu" @mouseout="hoverOutMenu">
            <router-link :to="{ name: 'ViewMultisigEditAccount', params: { name: account.name}}" class="block">
              <img src="@/modules/multisig/img/icon-settings-gray-proximax-sirius-wallet.svg" class="w-6 h-6 inline-block mr-6 cursor-pointer">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";

export default{

  name: 'multiSigTile',
  props: ['account'],
  setup(){
    const appStore = inject("appStore");
    return {
      appStore,
    }
  },
}
</script>