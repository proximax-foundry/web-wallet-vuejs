<template>
  <div>
    <div class="relative inline-block w-10 mr-2 select-none transition duration-200 ease-in align-middle">
      <input type="checkbox" id="toggle" value="selected" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-gray-500 border-4 appearance-none cursor-pointer" @click="$emit('update:modelValue', $event.target.checked)" />
      <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
    </div>
    <label for="toggle" class="text-xs text-gray-700">I confirm the exchange rate might change</label>
  </div>
</template>

<script>
import { ref, shallowRef } from "vue";

export default {
  name: "toggleSwitch",
  emits: ['update:modelValue'],
}
</script>
<style lang="scss" scoped>
.toggle-checkbox:checked {
  @apply right-0 border-blue-primary;
  right: 0;
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-blue-400;
}
</style>