<template>
  <keep-alive>
    <component :is="dynamicModel" :showModal="isOpenModel" :transaction="transaction"></component>
  </keep-alive>
</template>

<script >
import {computed, defineAsyncComponent, ref, watch} from "vue";

export default {
  name: "DynamicModelComponent",

  props: {
    modelName: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true
    },
    transaction: {
      type: Object,
      required: false
    },
  },

  setup(p){
    const isOpenModel = ref(false);

    const dynamicModel = computed(() => {
      console.log('Dynamic: ' + p.modelName) // component model wont be updated without this line
      return defineAsyncComponent(() => import(/* webpackPrefetch: true */ `@/modules/dashboard/components/DashboardModels/${p.modelName}.vue`))
    });
    watch(() => p.showModal, (n) => {
      setTimeout(() => {
        isOpenModel.value = n;
      }, 100);
    });

    // watch(() => this.dynamicModel, (n) => {
    //   console.log('this is changes: ' + n)
    // });

    return {
      isOpenModel,
      dynamicModel
    }
  }
}
</script>