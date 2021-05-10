<template>
  <div :class="login?`w-full mx-auto text-center`:``">
    <NavigationMenu v-if="login"></NavigationMenu>
    <div :class="login?`page container inline-block pt-5 px-10`:``">
      <router-view></router-view>
    </div>
  </div>
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
        return appStore.state.isLogin;
      }
    );
    return {
      login,
    };
  }
}
</script>