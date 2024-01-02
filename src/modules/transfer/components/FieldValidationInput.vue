<template>
    <div class="border border-gray-200 px-2 py-2 rounded-md w-full">
        <div class="flex gap-2">
            <div class="flex flex-col w-full">
                <div class="uppercase text-gray-500 font-light text-xxs text-left  ">{{ placeholder }}</div>
                <input type="text" v-model="modelValue"  class="w-full font-semibold text-tsm outline-none mt-1">
            </div>
            <div v-if="showError && modelValue.length != 0" class="flex flex-col ml-auto justify-center mt-1">
                <img src="@/assets/img/icon-red-x.svg" class="h-5 w-5 mr-auto ml-auto">
                <div class="text-xxs text-red-400 font-bold uppercase">{{$t('general.invalid')}}</div>
            </div>
            <div v-else-if="!showError" class="flex flex-col ml-auto justify-center mt-1">
                <img src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 mr-auto ml-auto">
                <div class="text-xxs text-green-400 font-bold uppercase">{{$t('general.valid')}}</div>
            </div>
        </div>
       

    </div>
</template>

<script setup lang="ts" generic="T extends string, U extends boolean" >

  defineProps<{
    placeholder: T,
    showError: U,
  }>()


 const modelValue = defineModel<string>()
 
</script>

<style lang="scss">
.text_input{
  @apply  flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>
