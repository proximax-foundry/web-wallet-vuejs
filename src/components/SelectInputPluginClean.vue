<template>
  <div>
    <div class="border border-gray-200 select selectPlugin py-1 relative" :class="`${ !placeholder?'pt-2':'' }`">
      <div class="uppercase text-gray-400 font-light text-txs text-left mb-2 pl-2" v-if="placeholder">{{ placeholder }}</div>
      <img src="@/assets/img/icon-arrow-down.svg" class="inline-block float-right absolute right-0" style="top: 4px;">
      <Multiselect
        class = 'border'
        :placeholder="placeholder"
        :options="options"
        mode="single"
        :canDeselect="canDeselect"
        v-model="selected"
        :noOptionsText="noOptionsText"
        @close="closeSelection"
        :maxHeight="maxHeight"
        @deselect="$emit('update:modelValue', selected)"
        @select="$emit('update:modelValue', selected);$emit('show-selection', selected)"
        @clear="$emit('clear-selection')"
        ref="selectRef"
        :disabled="disabled"
      />
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
    'selectDefault',
    'disabled',
    'noOptionsText',
  ],
  emits:[
    'update:modelValue', 'show-selection', 'clear-selection'
  ],
  name: 'SelectInputPluginClean',

  setup(p){
    const selectModel = ref(0);
    const selected = ref([]);
    const maxHeight = ref(300);
    const canDeselect = ref(false);

    const clearSelection = () => {
      selectModel.value = 0;
    };

    const closeSelection =() => {
      if(!selected.value){
        clearSelection();
      }
    };

    return {
      selectModel,
      selected,
      clearSelection,
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
    },
    select: function(group) {
      this.$refs.selectRef.select(group, this.options);
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
.selectPlugin::v-deep{
  .multiselect-input{
    min-height: 18px;
  }

  .multiselect-clear{
    display: inline-block;
    right: 7px;
    top: 2px;
  }

  .multiselect-options{
    margin-top: 4px;
  }

  > .border{
    border-width: 0px !important;
  }
}
</style>
