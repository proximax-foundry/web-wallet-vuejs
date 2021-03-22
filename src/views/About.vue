<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import { inject} from 'vue';
// import NavigationMenu from '@/components/NavigationMenu.vue'
export default {
  name: 'About',
  components: {

  },

  setup(){
    const appStore = inject("appStore");
    return {
      appStore,
    };
  }
}
</script>