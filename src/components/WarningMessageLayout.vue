<template>
    <div class="mt-2 grid bg-yellow-50 p-3 rounded-md">
      <div class="flex gap-2">
        <img src="@/modules/account/img/icon-warning.svg" class="w-5 h-5">
            <slot name="warning"/>
      </div>
    </div>
</template>