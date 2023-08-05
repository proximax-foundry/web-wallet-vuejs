<template>
  <div
    class="border border-gray-200 px-2 py-2 text-left flex justify-between items-center"
  >
    <div>
      <input
        :type="inputType"
        v-model="modelValue"
        class="ml-2 text-placeholder bg-white w-11/12"
        :placeholder="$t('general.enterPassword')"
      />
    </div>
    <font-awesome-icon
      icon="eye"
      class="text-gray-500 relative cursor-pointer text-right mr-2"
      @click="inputType = 'text'"
      v-if="inputType == 'password'"
    ></font-awesome-icon>
    <font-awesome-icon
      icon="eye-slash"
      class="text-gray-500 relative cursor-pointer text-right mr-2"
      @click="inputType = 'password'"
      v-if="inputType == 'text'"
    ></font-awesome-icon>
  </div>
  <div class="error error-text text-left my-2">
    {{ errors[0] ?? "" }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  placeholder: string;
  errors: string[];
}>();

const modelValue = defineModel<string>();
const inputType = ref("password");
</script>
