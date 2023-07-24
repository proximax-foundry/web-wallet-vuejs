<template>
    <div  class="w-full">
      <div class="border border-gray-200 px-2  rounded-md py-1">
          <div class="flex gap-2 items-center">
              <div class=" w-full">
                <input type="text"  :value="modelValue"
            @input="updateValue($event)" class="w-full font-semibold text-tsm outline-none ">
              </div>
              <div v-if=" showError" class="flex flex-col ml-auto justify-center mt-1">
                  <img src="@/assets/img/icon-red-x.svg" class="h-5 w-5 mr-auto ml-auto">
                  <div class="text-xxs text-red-400 font-bold uppercase">{{$t('general.invalid')}}</div>
              </div>
              <div v-else class="flex flex-col ml-auto justify-center mt-1">
                  <img src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 mr-auto ml-auto">
                  <div class="text-xxs text-green-400 font-bold uppercase">{{$t('general.valid')}}</div>
              </div>
          </div>
      </div>
    </div>
  </template>

<script setup lang=ts>

const emit = defineEmits([
  'update:modelValue'
])
  defineProps({
    showError: Boolean,
    modelValue: String,
  })

  const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

</script>

<style lang="scss">
.text_input{
  @apply  flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>