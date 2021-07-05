<template>
  <div>
    <div class="select mb-3 selectPlugin flex" style="position: relative">
      <div class="text-icon-outline text-icon flex-none absolute" style="top: 10px;">
        <font-awesome-icon icon="id-card-alt" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <Multiselect
        class=" flex-grow"
        :options="options"
        mode="single"
        :canDeselect="canDeselect"
        @change="makeSelection"
        v-model="selected"
        :noOptionsText="noOptionsText"
        @close="closeSelection"
        :maxHeight="maxHeight"
        :classes="{ options: 'text-left' }"
        @deselect="$emit('update:modelValue', selected)"
        @select="makeSelection;$emit('update:modelValue', selected);$emit('show-selection', selected)"
        @clear="$emit('clear-selection')"
        ref="selectRef"
        :disabled="disabled"
      />
    </div>
    <div class="h-3 mb-2"><div class="error text-left" v-if="selectErr">{{ errorMessage }}</div></div>
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
      this.$refs.selectRef.clear();
    }
  },

  mounted() {
    if(this.selectDefault){
      this.$refs.selectRef.select(this.selectDefault, this.options);
    }
  },

  created() {
    // eslint-disable-next-line no-unused-vars
    this.emitter.on('CLEAR_SELECT', payload => {
      if(!payload){
        this.$refs.selectRef.clear();
      }
    });
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";
.selectPlugin::v-deep{
  border-bottom: 1px solid #E5E7EB;
  .multiselect-input{
    border-bottom: 0px;
  }
  .multiselect-single-label{
    font-size: 11px;
    @apply text-gray-500;
  }
  .multiselect-options{
    font-size: 12px;
    @apply text-gray-500;
  }
}
@media (min-width: 1024px) {
  .selectPlugin::v-deep{
    .multiselect-single-label{
      font-size: 16px;
    }
    .multiselect-options{
      font-size: 13px;
    }
  }
}

</style>
