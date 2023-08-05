<template>
  <div>
    <div class="bg-white py-2 border">
      <input
        v-model="modelValue"
        type="text"
        class="ml-2 text-placeholder bg-white w-11/12"
        :placeholder="placeholder"
      />
    </div>
    <div class="error error-text text-left my-2" >
      {{ errors[0]?? "" }}
    </div>
  </div>
</template>

<script setup lang="ts">


defineProps<{
  placeholder: string,
  errors: string [];
}>()

const modelValue = defineModel<string>();

</script>
