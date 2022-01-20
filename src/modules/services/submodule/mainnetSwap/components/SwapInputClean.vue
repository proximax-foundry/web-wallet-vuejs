<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md flex justify-between">
      <div>
        <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="'<tiptext>' + toolTip + '</tiptext>'" v-if="toolTip"></div>
        <input v-if="decimal==0" v-maska="'#*'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
        <input v-else-if="decimal==1" v-maska="'#*.#'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
        <input v-else-if="decimal==2" v-maska="'#*.##'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
        <input v-else-if="decimal==3" v-maska="'#*.###'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
        <input v-else-if="decimal==4" v-maska="'#*.####'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
        <input v-else-if="decimal==5" v-maska="'#*.#####'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
        <input v-else v-maska="'#*.######'" :disabled="disabled == true"  class="supply_input" :value="parseFloat(modelValue)" @change="checkBalance($event);" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      </div>
      <button :disabled="disabled == true" class="cursor-pointer focus:outline-none text-blue-primary text-xs font-bold" @click="showRemark();$emit('clickedMaxAvailable', true);clearAllError()">Max. Amount</button>
    </div>
    <div class="h-3 mb-2 error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
    <div class="h-3 mb-2 error error-text text-left" v-if="emptyErr">{{ emptyErrorMessage }}</div>
    <div class="text-gray-600 text-xs mr-3 my-1 mb-5 text-left" v-if="isShowRemark==true && remarkOption">Maximum amount after deducting transaction fee <b>{{ transactionFee }} xpx</b> and gas fee <b>{{ gasFee }} xpx</b></div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { maska } from 'maska';
import Tooltip from 'primevue/tooltip';
export default{
  directives: { maska, 'tooltip': Tooltip },
  props: {
    placeholder: String,
    errorMessage: String,
    emptyErrorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: Number,
    title: String,
    disabled: Boolean,
    balance: Number,
    maxAmount: Number,
    remarkOption: Boolean,
    transactionFee: String,
    gasFee: Number,
    toolTip: String,
    decimal: Number,
  },

  setup (props) {
    const formatMask = ref("'#*." + ('#')^props.decimal + "'");
    return {
      formatMask,
    }
  },

  emits:[
    'update:modelValue',
    'clickedMaxAvailable',
  ],

  name: 'SwapInputClean',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
      isShowRemark: false,
      emptyErr: false
    };
  },

  watch:{
    modelValue: function(val){
      if(val == this.maxAmount){
        this.isShowRemark = true;
      }else{
        this.isShowRemark = false;
      }
    }
  },

  methods: {
    showRemark: function() {
      this.isShowRemark = true;
    },

    clearAllError: function(){
      this.textErr = false;
      this.emptyErr = false;
      this.borderColor = 'border-2 border-gray-300';
    },

    clickInputText: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputText: function() {
      if(!this.disabled){
        if(this.modelValue == '' || this.modelValue == 0 || this.modelValue == '0'){
          this.borderColor = 'border-2 border-red-primary';
          this.emptyErr = true;
        }else{
          this.borderColor = 'border-2 border-gray-300';
          this.emptyErr = false;
        }
      }
    },

    checkBalance: function(evt){
      evt.target.value =  evt.target.value? evt.target.value : 0;
      if(this.maxAmount < evt.target.value){
        this.borderColor = 'border-2 border-red-primary';
        this.textErr = true;
      }else{
        this.textErr = false;
        this.blurInputText();
      }
    },
  },

  mounted() {
    this.emitter.on("CLEAR_TEXT", payload => {
      this.inputText = payload;
      this.textErr = false;
      this.borderColor = 'border border-gray-300';
    });

    this.emitter.on("CLOSE_MOSAIC_INSUFFICIENT_ERR", payload => {
      this.textErr = payload;
    });
  },
}
</script>
<style lang="scss" scoped>

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.supply_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>