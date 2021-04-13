<template>
  <div class="w-full mx-auto text-center" v-if="login">
    <NavigationMenu></NavigationMenu>
    <div class="page container inline-block pt-5 px-10">
      <router-view></router-view>
    </div>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import { computed, inject} from 'vue';
import NavigationMenu from '@/components/NavigationMenu.vue'
export default {
  name: 'PageComponent',
  components: {
    NavigationMenu
  },

  setup(){
    const appStore = inject("appStore");
    const login = computed(
      () => {
        return appStore.state.currentLoggedInWallet;
      }
    );
    return {
      login,
    };
  }
}
</script>