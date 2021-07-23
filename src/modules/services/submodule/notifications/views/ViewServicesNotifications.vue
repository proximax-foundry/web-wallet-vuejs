<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">{{$t('services.notifications')}} ></span> <span class="text-blue-primary font-bold">{{$t('accounts.viewall')}}</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">{{$t('services.allservices')}}</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line text-center px-0 lg:px-10 xl:px-80'></div>
</template>
<script>
export default {
  name: 'ViewServicesNotifications',

  components: {
  },

  setup() {
    return {
    };
  },
}
</script>
<style lang="scss" scoped>

</style>
