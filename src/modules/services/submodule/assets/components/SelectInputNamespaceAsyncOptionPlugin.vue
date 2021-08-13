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
        :options="getOptions"
        mode="single"
        :canDeselect="canDeselect"
        @change="makeSelection"
        v-model="selected"
        :noOptionsText="noOptionsText"
        @close="closeSelection"
        :maxHeight="maxHeight"
        :resolveOnLoad="false"
        :clearOnSelect="true"
        @deselect="$emit('update:modelValue', selected)"
        @select="makeSelection;$emit('update:modelValue', selected);$emit('show-selection', selected)"
        @clear="$emit('clear-selection')"
        ref="selectRef"
        :disabled="disabled"
      />
      <div class="h-3 mb-2"><div class="error text-left" v-if="selectErr">{{ errorMessage }}</div></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Multiselect from '@vueform/multiselect';
import { NamespacesUtils } from '@/util/namespacesUtils';

export default defineComponent({
  props: [
    'placeholder',
    'errorMessage',
    'options',
    'modelValue',
    'showSelectTitleProp',
    'selectDefault',
    'disabled',
    'selectedAddress',
    'selectedAction',
    'noOptionsText',
  ],
  emits:[
    'update:modelValue', 'show-selection', 'clear-selection'
  ],
  name: 'SelectInputNamespaceAsyncOptionPlugin',

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

    const getOptions = async () => {
      // (async() => {
        const namespacesList = await NamespacesUtils.listNamespacesToLink(p.selectedAddress, p.selectedAction);
        console.log(namespacesList)
        return namespacesList;
      // })();
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
      getOptions,
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
</style>
