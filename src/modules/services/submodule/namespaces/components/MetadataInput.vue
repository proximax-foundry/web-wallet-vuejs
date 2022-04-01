<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }}</div>
      <input class="number_input" :disabled="disabled" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" type="text"  @focus="$event.target.select()">
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script>
import Tooltip from 'primevue/tooltip';
export default{
  directives: { 'tooltip': Tooltip },
  props: {
    placeholder: String,
    errorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: String,
    title: String,
    disabled: Boolean,
    max: Number,
    toolTip: String,
  },

  emits:[
    'update:modelValue'
  ],

  name: 'MetaDataInput',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },

}
</script>
<style lang="scss">

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.number_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>