<template>
  <div>
    <div class="text-md font-bold">{{ networkTerm }} {{$t('swap.swap')}} - {{ swapType }} - {{$t('swap.certificate')}}:</div>
    <div class="md:mx-10 lg:mx-20 border-8 border-solid border-gray-300 mt-4 sm:grid sm:grid-cols-4">
      <div class="sm:col-span-3 p-4">
        <div class="text-left text-tsm">
          <div class="font-bold">{{$t('swap.siriusaccount')}}:</div>
          <div>[[ Address ]]</div>
        </div>
        <div class="text-left text-tsm mt-2">
          <div><b>{{$t('swap.swaptime')}}:</b> [[ date and time ]]</div>
        </div>
        <div class="text-left text-tsm mt-2">
          <div class="font-bold inline-block">{{$t('swap.swapid')}}:</div> <div class=" inline-block break-all">AD7B610271C4</div>
        </div>
        <div class="grid grid-cols-4 mt-3">
          <div class="col-span-1">
            <div class="inline-block h-full">
              <div class="h-full flex">
                <img src="@/modules/services/submodule/mainnetSwap/img/barCode.jpg" class="self-center h-20 w-20">
              </div>
            </div>
          </div>
          <div class="col-span-3 text-left pl-2 flex">
            <div class="self-center">
              <b class="text-sm">{{ networkTerm }} {{$t('dashboard.transactionhash')}}:</b>
              <div class="break-all text-sm mt-1 text-blue-500">AD7B610271C4F830BC9EB840029D03CF1C80E0F3A9A68F72A6AC01EEDFDA8ED2</div>
            </div>
          </div>
        </div>
        <div class="text-tsm mt-5 text-left"><b>{{$t('swap.note')}}:</b> {{$t('swap.swapmessage')}}.</div>
      </div>
      <div class="sm:col-span-1 text-center w-full" style="background: -webkit-linear-gradient(bottom,#306FB5,#5DA7DC)">
        <div class="inline-block h-full">
        <div class="h-full flex">
          <img src="@/modules/services/submodule/voting/img/badge-silver-proximax-sirius-wallet.svg" class="w-24 h-24 self-center my-4">
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: 'SwapCertificateComponent',
  props: {
    networkTerm: String,
    swapType: String,
  }
}
</script>
<style lang="scss" scoped>

</style>