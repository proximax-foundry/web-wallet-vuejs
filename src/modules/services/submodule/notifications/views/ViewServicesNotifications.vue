<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Notifications ></span> <span class="text-blue-primary font-bold">View All</span></div>
    <div>
      <router-link :to="{ name: 'ViewServices' }" class="font-bold">All Services</router-link>
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
