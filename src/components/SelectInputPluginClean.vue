<template>
  <div>
    <div
      class="border border-gray-200 select selectPlugin py-1 relative rounded-md"
      :class="`${!placeholder ? 'pt-2' : ''}`"
    >
      <div
        class="uppercase text-gray-400 font-light text-txs text-left mb-2 pl-2"
        v-if="placeholder"
      >
        {{ placeholder }}
      </div>
      <img
        src="@/assets/img/icon-arrow-down.svg"
        class="inline-block float-right absolute right-0"
        style="top: 4px"
      />
      <Multiselect
        class="border"
        :placeholder="placeholder"
        :options="options"
        mode="single"
        :canDeselect="canDeselect"
        v-model="selected"
        :noOptionsText="noOptionsText"
        @close="closeSelection"
        :maxHeight="maxHeight"
        @deselect="$emit('update:modelValue', selected)"
        @select="
          $emit('update:modelValue', selected);
          $emit('show-selection', selected);
        "
        @clear="$emit('clear-selection')"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Multiselect from "@vueform/multiselect";

defineProps({
  placeholder: String,
  errorMessage: String,
  options: Array,
  modelValue: String,
  selectDefault: String,
  disabled: Boolean,
  noOptionsText: String,
});

defineEmits(["update:modelValue", "show-selection", "clear-selection"]);

const maxHeight = ref(300);
const canDeselect = ref(false);
const selectModel = ref(0);
const selected = ref([]);

const clearSelection = () => {
  selectModel.value = 0;
};

const closeSelection = () => {
  if (!selected.value) {
    clearSelection();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/multiselect.scss";

.selectPlugin::v-deep {
  .multiselect-input {
    min-height: 18px;
  }

  .multiselect-clear {
    display: inline-block;
    right: 7px;
    top: 2px;
  }

  .multiselect-options {
    margin-top: 4px;
  }

  > .border {
    border-width: 0px !important;
  }
}
</style>
