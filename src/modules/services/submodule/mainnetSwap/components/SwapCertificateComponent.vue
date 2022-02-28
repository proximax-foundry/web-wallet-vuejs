<template>
  <div>
    <!-- <div class="text-md font-bold">{{ networkTerm }} Swap - {{ swapType }} - Certificate:</div> -->
    <div class="md:mx-20 lg:mx-10 xl:mx-40 border-2 border-gray-200 mt-4 filter shadow-lg">
      <div class="sm:col-span-3 p-4">
        <!-- <div class="text-left text-tsm mt-2" v-if="swapTimestamp">
          <div><b>Swap Timestamp:</b> {{ swapTimestamp }}</div>
        </div> -->
        <!-- <div class="text-left text-tsm mt-2">
          <div class="font-bold inline-block">Swap ID:</div> <div class=" inline-block break-all">{{ swapId }}</div>
        </div> -->
        <div class="sm:grid sm:grid-cols-5 mt-3">
          <div class="sm:col-span-1">
            <div class="inline-block h-full">
              <div class="h-full flex p-1">
                <img :src="swapQr" class="self-center h-20 w-20 border border-gray-100">
              </div>
            </div>
          </div>
          <div class="sm:col-span-4 text-left pl-2 flex">
            <div class="self-center">
              <b class="text-xs font-bold text-blue-primary">{{ networkTerm }} {{$t('swap.transactionHash')}}:</b>
              <div class="break-all mt-1 flex"><a :href="swapLink" target=_new class="hover:underline self-center text-xs">{{ transactionHash }}<font-awesome-icon icon="external-link-alt" class="ml-1 text-blue-500 w-3 h-3 self-center inline-block"></font-awesome-icon></a></div>
              <div class="text-xs font-bold text-blue-primary inline-block mt-5" v-if="siriusTransactionHash">Sirius Transaction Hash:</div>
              <div class="break-all mt-1 flex" v-if="siriusTransactionHash"><a :href="xpxExplorer+siriusTransactionHash" target=_new class="hover:underline text-xs self-center">{{ siriusTransactionHash }}<font-awesome-icon icon="external-link-alt" class="text-blue-500 w-3 h-3 self-center inline-block ml-1"></font-awesome-icon></a></div>
              <div class="md:grid md:grid-cols-2">
                <div class="mb-5">
                  <div class="text-xs font-bold text-blue-primary mt-5">{{$t('swap.siriusAcc')}}:</div>
                  <div class="break-all mt-1 self-center text-xs flex">{{ siriusName }}</div>
                </div>
                <div class="mb-5">
                  <div class="text-xs font-bold text-blue-primary mt-5">{{$t('swap.swappedAmount')}}:</div>
                  <div class="break-all mt-1 self-center text-xs flex">{{ swappedAmount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="text-tsm mt-5 text-left"><b>Note:</b> Swap process may take a few hours to complete.</div> -->
      <!-- <div class="sm:col-span-1 text-center w-full" style="background: -webkit-linear-gradient(bottom,#306FB5,#5DA7DC)">
        <div class="inline-block h-full">
        <div class="h-full flex">
          <img src="@/modules/services/submodule/voting/img/badge-silver-proximax-sirius-wallet.svg" class="w-24 h-24 self-center my-4">
        </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>

export default{
  name: 'SwapCertificateComponent',
  props: {
    networkTerm: String,
    swapType: String,
    swapId: String,
    swapTimestamp: String,
    transactionHash: String,
    siriusAddress: String,
    swapQr: String,
    swapLink: String,
    siriusTransactionHash: String,
    xpxExplorer: String,
    siriusName: String,
    swappedAmount: Number
  }
}
</script>
<style lang="scss" scoped>

</style>