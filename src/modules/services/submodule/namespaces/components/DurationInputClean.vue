<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{value: '<tiptext>' + toolTip + '</tiptext>', escape: false}" v-if="toolTip"></div>
      <input :disabled="disabled" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" @blur="verifyMinimum" @keypress="validateKey" type="text" min=1 :max="max" :maxlength="max" :placeholder="placeholder" class="number_input" @focus="$event.target.select()">
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
    'update:modelValue', 'set-default-duration'
  ],

  name: 'DurationInputClean',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },

  methods: {

    verifyMinimum: function(e) {
      if(e.target.value == 0){
        this.$emit('set-default-duration', '1');
      }
    },

    validateKey: function(e){
      if(this.modelValue.length <=2){
        if(e.charCode < 48 || e.charCode > 59){
          e.preventDefault();
        }else{
          return e.key;
        }
      }else{
        e.preventDefault();
      }
    },
  },
}
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