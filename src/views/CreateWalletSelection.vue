<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold default-title mt-20">Select Wallet Creation Type</h1>
      <div class="page-title-gray-line grid grid-cols-1 md:grid-cols-3 pt-20">
        <div class="px-5 self-center text-center mb-10">
          <img src="../assets/img/icon-add-new-blue.svg" class="w-12 inline-block">
          <p class="mt-3">New Wallet</p>
          <router-link to="/create-wallet" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link></div>
        <div class="px-5 self-center text-center mb-10">
          <img src="../assets/img/icon-private-key-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Private Key</p>
          <router-link to="/import-wallet" class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center">Create</router-link>
        </div>
        <div class="px-5 self-center text-center mb-10"><img src="../assets/img/icon-wallet-import-blue.svg" class="w-12 inline-block"><p class="mt-3">From a Wallet Backup</p>
          <label class="max-w-xs sm:max-w-sm inline-block md:block default-btn my-3 self-center cursor-pointer">
            <span>Import</span>
            <input type="file" hidden />
          </label>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ViewWallets',
  components: {
  }
}
</script>
