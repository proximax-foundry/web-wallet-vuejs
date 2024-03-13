<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>' + toolTip + '</tiptext>', escape: false}" v-if="toolTip"></div>
      <input :disabled="disabled" :value="inputValue" @input="handleInput(parseInt((<HTMLInputElement>$event.target).value))" @keypress="validateKey" type="number" min=0 :max="max" :placeholder="placeholder" class="number_input">
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
    if(charCode === '0' && inputValue.value.slice(0,1) === '0'){
      e.preventDefault();
    }
    return true;
  } else {
    // Prevent the default behavior (i.e., disallow the keypress)
    e.preventDefault();
    return false;
  }
}

const handleInput  = (value: number) => {
  if(!isNaN(value)){
    inputValue.value = value.toString();
  }
  else{
    inputValue.value = "0";
  }
  emit('update:modelValue',  inputValue.value);
}

watch(inputValue, (newValue) => {
  if(newValue.toString().length > maxDivisibility.toString().length) {
    inputValue.value = parseInt(newValue.slice(0, maxDivisibility.toString().length-1) + newValue.slice(-1)).toString()
  }
  else if(parseInt(newValue) > maxDivisibility){
    inputValue.value = maxDivisibility.toString()
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