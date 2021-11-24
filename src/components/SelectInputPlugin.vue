<template>
  <div>
    <div class="select selectPlugin" style="position: relative">
      <div class="h-5 text-left m-auto w-8/12 mb-1">
        <transition enter-active-class="animate__animated animate__fadeInUp">
          <span v-if="showSelectTitle" class="text-xs text-blue-400">{{ placeholder }}</span>
        </transition>
      </div>
      <Multiselect
        class = 'border w-8/12'
        :placeholder="placeholder"
        :options="options"
        mode="single"
        :canDeselect="canDeselect"
        @change="makeSelection"
        v-model="selected"
        :noOptionsText="noOptionsText"
        @close="closeSelection"
        :maxHeight="maxHeight"
        @deselect="$emit('update:modelValue', selected)"
        @select="makeSelection;$emit('update:modelValue', selected);$emit('show-selection', selected)"
        @clear="$emit('clear-selection')"
        ref="selectRef"
        :disabled="disabled"
      />
      <div class="h-3 mb-2"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Multiselect from '@vueform/multiselect';

export default defineComponent({
  props: [
    'placeholder',
    'errorMessage',
    'options',
    'modelValue',
    'showSelectTitleProp',
    'selectDefault',
    'disabled',
    'noOptionsText',
  ],
  emits:[
    'update:modelValue', 'show-selection', 'clear-selection'
  ],
  name: 'SelectInputPlugin',

  setup(p){
    const showSelectTitle = ref(false);
    const selectErr = ref(false);
    const selectModel = ref(0);
    const selected = ref([]);
    const maxHeight = ref(300);
    const canDeselect = ref(true);

    if(p.showSelectTitleProp){
      showSelectTitle.value = true;
    }

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
      if(!selected.value){
        clearSelection();
      }
    };

    return {
      showSelectTitle,
      selectErr,
      selectModel,
      selected,
      clearSelection,
      makeSelection,
      closeSelection,
      maxHeight,
      canDeselect,
    };
  },

  components: {
    Multiselect,
  },

  methods: {
    clear: function() {
      if(this.$refs.selectRef){
        this.$refs.selectRef.clear();
      }
    }
  },

  mounted() {
    if(this.selectDefault){
      this.$refs.selectRef.select(this.selectDefault, this.options);
    }

    this.emitter.on('CLEAR_SELECT', this.clear)
  },

  beforeUnmount(){
    this.emitter.off('CLEAR_SELECT', this.clear)
  },
  created() {
    // eslint-disable-next-line no-unused-vars
    // console.log(this.$refs);
    // this.emitter.on('CLEAR_SELECT', payload => {
    //   if(!payload){
    //     this.$refs.selectRef.clear();
    //   }
    // });
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";
</style>
