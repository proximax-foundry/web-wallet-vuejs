<template>
  <div :class="disabled ? 'opacity-50' : ''" class="w-full">
    <div class="border border-gray-200 px-2 py-2 rounded-md">
      <div class="flex gap-2">
        <div class="flex flex-col w-full">
          <div class="uppercase text-gray-500 font-light text-txs text-left mb-1.5">{{ placeholder }}</div>
          <div class="flex">
            <input :type="inputType" :disabled="disabled == true" :value="modelValue"
              @input="updateValue($event)" class="text-placeholder text-left"
               autocomplete="off">
            <font-awesome-icon icon="eye" class="text-gray-500 relative cursor-pointer text-right mr-2"
              @click="hideShowPassword();" v-if="!showPassword"></font-awesome-icon>
            <font-awesome-icon icon="eye-slash" class="text-gray-500 relative cursor-pointer text-right mr-2"
              @click="hideShowPassword();" v-if="showPassword"></font-awesome-icon>
          </div>
        </div>
        <div v-if="showError" class="flex flex-col ml-auto justify-center ">
          <img src="@/assets/img/icon-red-x.svg" class="h-5 w-5 mr-auto ml-auto">
          <div class="text-xxs text-red-400 font-bold uppercase">{{ $t('general.invalid') }}</div>
        </div>
        <div v-else class="flex flex-col ml-auto justify-center ">
          <img src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 mr-auto ml-auto">
          <div class="text-xxs text-green-400 font-bold uppercase">{{ $t('general.valid') }}</div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  placeholder: String,
  errorMessage: String,
  icon: String,
  showError: Boolean,
  disabled: Boolean,
  modelValue: String,
  imgRequired: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const inputType = ref("password")
const showPassword = ref(false)

const hideShowPassword = () => {
  showPassword.value = !showPassword.value;
  showPassword.value ? inputType.value = 'text' : inputType.value = 'password';
}

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};


</script>

<style lang="scss">
.text_input {
  @apply flex border-0 outline-none border-white drop-shadow-none filter  text-tsm text-gray-600 font-bold disabled:opacity-50;
}</style>
