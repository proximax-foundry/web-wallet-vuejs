<template>
  <div class="flex flex-col h-screen justify-between">
    <header class="h-16 flex items-stretch">
      <div class="flex-none self-center flex items-end logo">
        <router-link to="/"><img src="/img/logo-proximax-sirius-wallet-beta.svg" class="w-32"></router-link><span class="version-text">v0.5.4</span>
      </div>
      <div class="flex-grow h-16"></div>
      <div class="flex-none self-center header-menu">
        <div class="w-16 text-center inline-block">
          <router-link to="/" class="font-normal hover:font-bold inline-block">Home</router-link>
        </div>
        <div class="w-16 text-center inline-block">
          <router-link to="/wallets" class="hover:font-bold">Wallets</router-link>
        </div>
      </div>
    </header>
    <router-view class="mb-auto"></router-view>
    <footer class="h-12 text-center">
      <div class="text-xs py-2">
        <div class="font-bold">&copy; ProximaX 2021</div>
        <div>Please report any issues identified to our <a href="https://t.me/proximaxhelpdesk" target=_new class="text-blue-primary font-bold hover:underline">helpdesk</a>.</div>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>