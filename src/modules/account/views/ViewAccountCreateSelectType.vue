<template>
<div>
  <div class='border w-8/12 ml-auto mr-auto mt-6 filter shadow-lg'>
    <div class='text-lg text-center font-bold my-10 '>Create New Account</div>
    <div class='text-center text-xs font-semibold'>Select Creation Type</div>
    <div class='mt-3'></div>
    <div class='flex gap-2 justify-center'>
      <router-link :to="{ name : 'ViewAccountCreate'}" class='border p-6 w-4/12'>
        <img src="@/modules/wallet/img/icon-add-new.svg" class="ml-auto mr-auto mt-4 mb-3 h-12 w-12 mr-1">
        <div class='text-center text-xs font-semibold'>Create New</div>
      </router-link>
      <router-link :to="{ name: 'ViewAccountCreatePrivateKey'}" class='border p-6 w-4/12'>
        <img src="@/modules/wallet/img/icon-private-key.svg" class=" ml-auto mr-auto mt-4 mb-3 h-12 w-12 mr-1">
        <div class='text-center text-xs font-semibold'>From Private Key</div>
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