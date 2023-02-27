<template>
<div>
  <div class='border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg'>
    <div class='text-lg text-center font-bold my-10 '>{{$t('general.createNewAcc')}}</div>
    <div class='text-center text-xs font-semibold'>{{$t('general.selectCreationType')}}</div>
    <div class='mt-3'></div>
    <div class='flex gap-2 justify-center flex-col md:flex-row items-center'>
      <router-link :to="{ name : 'ViewAccountCreate'}" class='border p-6 w-8/12 md:w-4/12'>
        <img src="@/modules/wallet/img/icon-add-new.svg" class="ml-auto mr-auto mt-4 mb-3 h-12 w-12 ">
        <div class='text-center text-xs font-semibold'>{{$t('general.createNew')}}</div>
      </router-link>
      <router-link :to="{ name: 'ViewAccountCreatePrivateKey'}" class='border p-6  w-8/12 md:w-4/12'>
        <img src="@/modules/wallet/img/icon-private-key.svg" class=" ml-auto mr-auto mt-4 mb-3 h-12 w-12 ">
        <div class='text-center text-xs font-semibold'>{{$t('general.fromPrivateKey')}}</div>
      </router-link>
    </div> 
    <div class='mt-10'></div>   
  </div>
</div>
</template>
<script>

export default {
  name: 'ViewAccountCreateSelectType',
}
</script>
<style lang="scss">
.buttons_outer{
  width: 550px;
  a{
    width: 230px;
  }
}
</style>