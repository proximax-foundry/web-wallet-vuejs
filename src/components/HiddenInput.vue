<template>
  <div>
    <div class="bg-white py-2 border flex justify-between">
      <input
        type="text"
        :class="inputClass"
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
        @click="hideShow()"
        v-if="!showPassword"
      ></font-awesome-icon>
      <font-awesome-icon
        icon="eye-slash"
        class="text-gray-500 relative cursor-pointer text-right mt-1 mr-2"
        @click="hideShow()"
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
const showPassword = ref(false);
const inputClass = ref("key");
const pswdErr = ref(false);
const hideShow = () => {
  showPassword.value = !showPassword.value;
  showPassword.value ? (inputClass.value = "") : (inputClass.value = "key");
};

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const blurInputPassword = () => {
  if (props.modelValue == "") {
    pswdErr.value = true;
  } else {
    pswdErr.value = false;
  }
};
</script>

<style lang="scss">
input.key {
  font-family: "Password";
}

input::-webkit-input-placeholder {
  font-family: initial;
}

input::-moz-placeholder {
  font-family: initial;
}

input:-ms-input-placeholder {
  font-family: initial;
}

input::placeholder {
  font-family: initial;
}
</style>
