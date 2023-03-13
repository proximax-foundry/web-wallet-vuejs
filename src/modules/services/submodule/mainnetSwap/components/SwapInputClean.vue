<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md ">
      <div class=" uppercase text-gray-500 text-txs  text-left mb-1">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{ value: '<tiptext>' + toolTip + '</tiptext>', escape: true }" v-if="toolTip"></div>
      <div class="flex justify-between items-center">
        <AutoNumericVue 
        :value="modelValue"
        class="supply_input "  
        :options="{
          showWarnings : false,
          digitGroupSeparator: ',',
          decimalCharacter: '.',
          currencySymbol: '',
          allowDecimalPadding: false,
          decimalPlaces: decimal,
          roundingMethod: 'U',
          minimumValue: '0'
        }"
        @input="$emit('update:modelValue',parseFloat($event.target.value.replace(/,/g, '')) )"
        @keyup="checkBalance($event)"
        @focus="$event.target.select()" 
        @blur="blurInputText()"
        ></AutoNumericVue>
        <button :disabled="disabled == true" class="w-24 cursor-pointer focus:outline-none text-blue-primary text-xs font-bold" @click="showRemark();$emit('clickedMaxAvailable', true);clearAllError()">{{$t('swap.maxAmount')}}</button>
      </div>
    </div>
    <div class="h-3 mb-2 error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
    <div class="h-3 mb-2 error error-text text-left" v-if="emptyErr">{{ emptyErrorMessage }}</div>
    <div class="text-gray-600 text-xs mr-3 my-1 mb-5 text-left" v-if="isShowRemark==true && remarkOption">{{$t('swap.inputRemark1')}} <b>{{ transactionFee }} xpx</b> {{$t('swap.inputRemark2')}} <b>{{ gasFee }} xpx</b></div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from 'primevue/tooltip';
import AutoNumericVue from 'autonumeric-vue/src/components/AutoNumericVue';
defineProps({
    placeholder: String,
    errorMessage: String,
    emptyErrorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: Number,
    title: String,
    disabled: Boolean,
    maxAmount: Number,
    remarkOption: Boolean,
    transactionFee: String,
    gasFee: Number,
    toolTip: String,
    decimal: Number,
  })
  defineEmits([
    'update:modelValue',
    'clickedMaxAvailable',
  ])
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