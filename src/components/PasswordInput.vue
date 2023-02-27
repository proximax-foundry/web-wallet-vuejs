<template>
  <div>
    <div class="bg-white py-2 border flex justify-between">
      <input
        :type="inputType"
        :disabled="disabled == true"
        :value="modelValue"
        @input="updateValue"
        class="w-full text-placeholder text-left ml-2"
        :placeholder="placeholder"
        @blur="blurInputPassword()"
        autocomplete="off"
      />
      <font-awesome-icon
        icon="eye"
        class="text-gray-500 relative cursor-pointer text-right mt-1 mr-2"
        @click="hideShowPassword()"
        v-if="!showPassword"
      ></font-awesome-icon>
      <font-awesome-icon
        icon="eye-slash"
        class="text-gray-500 relative cursor-pointer text-right mt-1 mr-2"
        @click="hideShowPassword()"
        v-if="showPassword"
      ></font-awesome-icon>
    </div>
    <div
      class="error error-password text-left my-2"
      v-if="pswdErr || showError"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  icon: {
    type: String,
  },
  showError: {
    type: Boolean,
  },
  modelValue: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
});
const emit = defineEmits(["update:modelValue"]);

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const inputType = ref("password");
const showPassword = ref(false);
const pswdErr = ref(false);

const hideShowPassword = () => {
  showPassword.value = !showPassword.value;
  showPassword.value
    ? (inputType.value = "text")
    : (inputType.value = "password");
};

const blurInputPassword = () => {
  if (props.modelValue == "") {
    pswdErr.value = true;
  } else {
    pswdErr.value = false;
  }
};
</script>
