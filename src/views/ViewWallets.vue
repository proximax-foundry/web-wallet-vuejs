<template>
  <div class="container mx-auto text-center">
    <h1 class="font-bold big-title mt-20">Wallets</h1>
    <div class='mt-2 py-3 gray-line'>
      <p>These are the Sirius Wallets available in the local storage of your device.</p>
      <div class="grid xs-grid-cols-1 sm:grid-cols-2 mt-10">
        <div class='p-3'>
          <div class="bg-gray-200 rounded-2xl flex justify-between py-3">
            <div class="ml-5 text-left text-sm"><div class="font-bold mb-1">wallet_name</div><div class="text-xs">Account: <span class="font-bold">1</span></div></div>
            <div class="mr-5 self-center"><img src="../assets/img/icon-trash-can-gray-16h-proximax-sirius-wallet.svg" class="w-7"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-32">
      <router-link to="/" class="blue-btn p-3 px-5">Home</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'ViewWallets',
  components: {
  }
}
</script>
