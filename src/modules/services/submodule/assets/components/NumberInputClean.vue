<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{value:'<tiptext>' + toolTip + '</tiptext>', escape: true}" v-if="toolTip"></div>
      <input :disabled="disabled" :value="modelValue" @input="validate" @keypress="validateKey" type="number" maxlength="1" min=0 :max="max" :placeholder="placeholder" class="number_input" @click="clickInputText()" @focus="$event.target.select()">
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

  name: 'NumberInputClean',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },

  methods: {
    clickInputText: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    validateKey: function(e){
      if(e.charCode < 48 || e.charCode > 54){
        e.preventDefault();
      }else{
        // this.$emit('update:modelValue', e.key);
        return e.key;
      }
    },

    validate: function(e) {
      // if(e.data > -1 && e.data < 7){
        this.$emit('update:modelValue', e.data);
      // }
    }
  },

  mounted() {
    this.emitter.on("CLEAR_TEXT", payload => {
      this.inputText = payload;
      this.textErr = false;
      this.borderColor = 'border border-gray-300';
    });

  }
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