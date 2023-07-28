<template>
    <div class="rounded-md bg-white flex border mt-3" >
      <textarea :value="modelValue" @input=" $emit('update:modelValue', ($event.target as HTMLInputElement).value)" rows=2 class="  w-full text-gray-500 px-2 py-1 outline-none bg-white text-xs" :placeholder="placeholder.toUpperCase()" ></textarea>
      <div class="w-1 flex-none"></div>
    </div>
    <div class="float-right mt-1 text-tsm " :class="currentBytes> limit? 'text-red-500':'text-gray-800'" >{{currentBytes}} <span class="text-gray-800">/{{limit}}</span></div>
</template>

<script setup lang="ts">

defineProps({
    modelValue:{
        type:String,
        required:false
    },
    currentBytes:{
        type:Number,
        required:true
    },
    limit:{
        type:Number,
        required:true
    },
    placeholder:{
        type:String,
        required:true
    },
})

defineEmits(['update:modelValue'])

</script>