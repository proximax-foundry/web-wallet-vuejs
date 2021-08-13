<template>
  <div class='p-3'>
    <div class="rounded-2xl flex justify-between py-3 border border-gray-200 bg-white">
      <div class="ml-5 text-left text-sm w-full">
        <div class="font-bold mb-1">{{ account.name }}</div>
        <div class="flex justify-between pr-4 rounded-xl mb-4 items-center bg-white">
          <div class="text-left w-full relative">
            <div class="z-20 w-full h-full">{{ pretty(account.address) }}</div>
          </div>
          <div class="relative inline-block text-left" @mouseover="hoverOverMenu" @mouseout="hoverOutMenu">
            <router-link :to="{ name: 'ViewMultisigEditAccount', params: { name: account.name}}" class="block">
              <img src="@/modules/account/submodule/multisig/img/icon-settings-gray-proximax-sirius-wallet.svg" class="w-6 h-6 inline-block mr-6 cursor-pointer">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default{

  name: 'multiSigTile',
  props: ['account'],
  setup(){
    function pretty(address){
      return address.replace(/([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{6})([a-zA-Z0-9]{4})/, "$1-$2-$3-$4-$5-$6-$7");
    }
    return {
      pretty,
    }
  },
}
</script>