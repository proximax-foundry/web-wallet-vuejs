<template>
  <div>
    <div class="bg-white py-2 border">
      <input
        :disabled="disabled"
        :value="modelValue"
        @input="updateValue"
        type="text"
        class="ml-2 text-placeholder bg-white w-11/12"
        :placeholder="placeholder"
        @focus="focusInputText()"
        @blur="blurInputText()"
        maxlength="16"
      />
    </div>
    <div class="error error-text text-left my-2" v-if="textErr || showError">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  placeholder: String,
  errorMessage: String,
  icon: String,
  showError: Boolean,
  disabled: Boolean,
  modelValue: String,
  imgRequired: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const textErr = ref(false);

const blurInputText = () => {
  if (!props.disabled) {
    if (props.modelValue == "") {
      textErr.value = true;
    } else {
      textErr.value = false;
    }
  }
};

const focusInputText = () => {
  textErr.value = false;
};
</script>
