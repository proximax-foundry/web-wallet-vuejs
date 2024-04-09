<template>
  <div :class="type === 'accTabServices' ? 'lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5' : 'w-10/12 ml-auto mr-auto'">
    <slot name="accDetail" />
    <div
      class="border filter shadow-lg xl:grid xl:grid-cols-3"
      :class="type === 'accTabServices' || type === 'alias' ? 'border-t-0' : 'mt-8'"
    >
      <div
        class="xl:col-span-2"
        :class="type === 'account' ? 'p-6 lg:p-12' : 
        type === 'accTabServices' || type === 'alias'  ? 'p-6' : 'p-12'"
      >
        <slot name="white" />
      </div>
      <div
        class="bg-navy-primary py-6 xl:col-span-1"
        :class="type === 'account' || type === 'metadata' ? 'px-12' : 'px-6'"
      >
        <slot name="navy" />
      </div>
    </div>
    <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
      <slot name="description" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    required: false,
  },
});
</script>
