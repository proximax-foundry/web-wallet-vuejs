<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>' + toolTip + '</tiptext>', escape: false}" v-if="toolTip"></div>
      <input :disabled="disabled" :value="inputValue" @input="handleInput((<HTMLInputElement>$event.target))" @keypress="validateKey" :placeholder="placeholder" class="number_input">
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue';
import { networkState } from '@/state/networkState';

const props = defineProps({
    placeholder: String,
    errorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: String,
    title: String,
    disabled: Boolean,
    max: Number,
    toolTip: String,
})

const emit = defineEmits(["update:modelValue"]);

const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
const inputText = ref("")
const borderColor = ref('border border-gray-300')
const textErr = ref(false)
const inputValue = ref(props.modelValue)
const maxDivisibility = networkState.currentNetworkProfileConfig.maxMosaicDivisibility
const frontInput = ref(false)

const validateKey = (e: KeyboardEvent) => {
  const charCode = e.key;
  if (
    (charCode >= '0' && charCode <= "9") ||
    charCode === 'Backspace' ||
    charCode === 'Delete' ||
    charCode === 'ArrowLeft' ||
    charCode === 'ArrowRight'
  ) {
    // Allow the keypress
    return true;
  } else {
    // Prevent the default behavior (i.e., disallow the keypress)
    e.preventDefault();
    return false;
  }
}

const handleInput  = (target: HTMLInputElement) => {
  if(target.selectionStart < maxDivisibility.toString().length ){
    frontInput.value = true
  }
  else{
    frontInput.value = false
  }

  if(!isNaN(parseInt(target.value))){
    inputValue.value = target.value.toString();
  }
  else{
    inputValue.value = "0";
  }
}

watch(inputValue, (newValue) => {
  if(newValue.length > maxDivisibility.toString().length) {
    if(!frontInput.value){
      inputValue.value = parseInt(newValue.slice(0, maxDivisibility.toString().length-1) + newValue.slice(-1)).toString()
    }
    else{
      inputValue.value = parseInt(newValue.slice(0, maxDivisibility.toString().length)).toString()
    }
  }
  else if(parseInt(newValue) > maxDivisibility){
    inputValue.value = maxDivisibility.toString()
  }
  else{
    inputValue.value = parseInt(newValue).toString()
  }
  emit('update:modelValue', inputValue.value);
});

emitter.on("CLEAR_TEXT", (payload: string) => {
  inputText.value = payload;
  textErr.value = false;
  borderColor.value = 'border border-gray-300';
});

</script>
<style lang="scss">

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.number_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>