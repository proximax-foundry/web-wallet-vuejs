<template>
  <div class="w-10/12 ml-auto mr-auto">
    <div class="border filter shadow-lg xl:grid xl:grid-cols-3">
      <div class="xl:col-span-2 p-12">
        <slot name="white" />
      </div>
      <div class="bg-navy-primary py-6 px-6 xl:col-span-1">
        <slot name="navy" />
      </div>
    </div>
    <div class="sm:grid sm:grid-cols-2 mt-10 lg:mt-16">
      <slot name="description" />
    </div>
  </div>
</template>
