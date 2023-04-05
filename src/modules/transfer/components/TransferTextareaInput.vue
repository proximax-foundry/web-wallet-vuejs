<template>
  <div>
    <div class="rounded-md bg-white flex border ">
      <textarea :value="modelValue" :disabled="disabled"
        @input="countChar($event); updateValue($event)" rows=2
        class="  w-full text-gray-500 px-2 py-1 outline-none bg-white text-xs" :placeholder="placeholder.toUpperCase()"
        @blur="blurInputText()"></textarea>
      <div class="w-1 flex-none"></div>
    </div>
    <div class="float-right mt-1 text-tsm text-gray-800">{{ remainingLength }}/{{ limit }}</div>
    <div class="h-3 mb-2">
      <div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,  watch } from 'vue';

const p = defineProps({
  placeholder: {
    type: String,
    required: true
  },
  msgOpt: {
    type: String,
    required: true
  },
  errorMessage: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  remainingChar: {
    type: Number,
    required: true
  },
  showError:{
    type: Boolean,
    required:true
  }

})

const emit = defineEmits([
  'update:modelValue'
])

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const remainingLength = ref(0);
const textErr = ref(false);

watch(
  () => p.remainingChar,
  (n) => {
    remainingLength.value = n;
  });

const countChar = (e :Event) => {
  const target = e.target as HTMLInputElement
  if (p.msgOpt == 'regular') {
    if (target.value.length > p.limit) {
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
    }
  }
};


const blurInputText = () => {
  textErr.value = false;
};

</script>
