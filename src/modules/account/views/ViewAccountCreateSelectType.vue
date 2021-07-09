<template>
  <div class="flex justify-between text-md">
    <div><span class="text-gray-300">Accounts ></span> <span class="text-blue-primary font-bold">Select Creation Type</span></div>
  </div>
  <div class='mt-2 py-3 gray-line text-center'>
    <div class="inline-block">
      <div class="flex justify-around pt-16 buttons_outer">
        <router-link :to="{ name : 'ViewAccountCreate'}" class="inline-block md:block default-btn my-3 self-center">New</router-link>
        <router-link :to="{ name: 'ViewAccountCreatePrivateKey'}" class="inline-block md:block default-btn my-3 self-center">From a Private Key</router-link>
      </div>
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