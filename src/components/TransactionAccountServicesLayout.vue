<template>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <slot name="accDetail" />
      <div
        class="border border-t-0 filter shadow-lg xl:grid xl:grid-cols-3"
      >
        <div
          class="xl:col-span-2 p-6"
        >
          <slot name="white" />
        </div>
        <div
          class="bg-navy-primary py-6 px-12 xl:col-span-1"
        >
          <slot name="navy" />
        </div>
      </div>
    </div>
  </template>