<template>
  <div :class="`${(!disabled)?'cursor-pointer':'opacity-50'}`">
    <div class="border border-gray-200 px-2 py-1 h-14 flex items-center justify-between rounded-md">
      <div>
        <div class="inline-block font-bold text-tsm" :class="`${ disabled?'text-gray-500':'text-black' }`">{{ title }}</div>
        <img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="{ value: '<tiptext>' + toolTip + '</tiptext>', escape: false }" v-if="toolTip">
      </div>
      <img src="@/assets/img/icon-done.svg" class="inline-block" v-if="modelValue">
      <img src="@/assets/img/icon-undone.svg" class="inline-block" v-else>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  title: String,
  disabled: Boolean,
  modelValue: Boolean,
  toolTip: String,
})

</script>
