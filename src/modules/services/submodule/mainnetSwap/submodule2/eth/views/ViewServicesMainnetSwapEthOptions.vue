<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Swap > ETH </span> <span class="text-blue-primary font-bold">Select</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices'}" class="font-bold" active-class="accounts">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <div class="text-xl text-gray-600 font-bold mt-10">Please select an option</div>
    <div class="text-sm text-gray-400 mt-3">Lorem ipsum dolor sit amet, consectetur adipi</div>
    <div class="grid xs-grid-cols-1 sm:grid-cols-2 mx-60 mt-5">
      <div class="col-span-1">
        <router-link :to="{ name: 'ViewServicesMainnetSwapSiriusToETH' }">
          <div class="m-5 lg:mx-10 rounded-2xl border border-blue-primary option-div">
            <div class="mt-10 text-blue-primary font-bold text-xl mb-1">Outcome</div>
            <div class="mb-10 text-gray-500">From Sirius to ETH</div>
          </div>
        </router-link>
      </div>
      <div class="col-span-1">
        <router-link :to="{ name: 'ViewServicesMainnetSwapETHToSirius' }">
          <div class="m-5 lg:mx-10 rounded-2xl border border-blue-primary option-div">
            <div class="mt-10 text-blue-primary font-bold text-xl mb-1">Income</div>
            <div class="mb-10 text-gray-500">From ETH to Sirius</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ViewServicesMainnetSwapEthOptions',

  setup() {

    return {
    };
  },
}
</script>
<style lang="scss" scoped>
.option-div:hover{
  @apply bg-blue-primary;
  transition: all 0.5s;
  > div{
    @apply text-white;
  }
}
</style>