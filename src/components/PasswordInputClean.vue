<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-2 text-left flex justify-between items-center">
      <div>
        <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">{{ placeholder }}</div>
        <input :type="inputType" :disabled="disabled == true" :value="modelValue" @input="updateValue" class="text_input" :placeholder="placeholder" @blur="blurInputPassword()" autocomplete="off">
      </div>
      <font-awesome-icon icon="eye" class="text-gray-500 relative cursor-pointer text-right mr-2" @click="hideShowPassword();" v-if="!showPassword"></font-awesome-icon>
      <font-awesome-icon icon="eye-slash" class="text-gray-500 relative cursor-pointer text-right mr-2" @click="hideShowPassword();" v-if="showPassword"></font-awesome-icon>
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="pswdErr || showError">{{ errorMessage }}</div></div>
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
  }
  else if (Object.keys(props.modelValue as string).length < 8){
    pswdErr.value = true;
  } else {
    pswdErr.value = false;
  }
};
</script>

<style lang="scss">
.text_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 disabled:opacity-50;
}
</style>
