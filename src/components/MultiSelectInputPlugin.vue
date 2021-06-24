<template>
  <div>
    <div class="h-5 text-left">
      <transition enter-active-class="animate__animated animate__fadeInUp">
        <span v-if="showSelectTitle" class="text-xs text-blue-400 ">{{ placeholder }}</span>
      </transition>
    </div>
    <div class="select mb-3 selectPlugin" style="position: relative">
       <Multiselect
          :placeholder="placeholder"
          :options="options"
          mode="tags"
          @change="makeSelection"
          v-model="selected"
          @close="closeSelection"
          @deselect="$emit('update:modelValue', selected)"
          @select="$emit('update:modelValue', selected)"
        />
      <div class="h-3 mb-2"><div class="error text-left" v-if="selectErr">{{ errorMessage }}</div></div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import Multiselect from '@vueform/multiselect';

export default{
  props: [
    'placeholder',
    'errorMessage',
    'options',
    'modelValue',
  ],
  emits:[
    'update:modelValue', 'show-selection'
  ],
  name: 'SelectInputPlugin',

  setup(){
    const showSelectTitle = ref(false);
    const selectErr = ref(false);
    const selectModel = ref(0);
    const selected = ref([]);

    const clearSelection = () => {
      selectModel.value = 0;
      showSelectTitle.value = false;
      selectErr.value = true;
    };

    const makeSelection =() => {
      showSelectTitle.value = true;
      selectErr.value = false;
    };

    const closeSelection =() => {
      if(selected.value.length == 0){
        clearSelection();
      }
    };

    const checkCloseSelect = () => {
      if(!selected.value.length){
        clearSelection();
      }
    };

    watch(selected, (n) => {
      if(n.length == 0){
        clearSelection();
      }
    });

    return {
      showSelectTitle,
      selectErr,
      selectModel,
      selected,
      clearSelection,
      makeSelection,
      closeSelection,
      checkCloseSelect,
    };
  },

  components: {
    Multiselect,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";
</style>