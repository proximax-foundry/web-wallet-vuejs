<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md ">
      <div class=" uppercase text-gray-500 text-txs  text-left mb-1">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{ value: '<tiptext>' + toolTip + '</tiptext>', escape: true }" v-if="toolTip"></div>
      <div class="flex justify-between items-center">
        <input
        :value="modelValue"
        class="supply_input"
        v-maska:[options]
        :data-maska="maskaFormat()"
        data-maska-tokens="0:\d:multiple|9:\d:optional"
        :placeholder="placeholder"
        @keyup="checkBalance($event)"
        @input="$emit('update:modelValue',parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')))"
      />
        <button :disabled="disabled == true" class="w-24 cursor-pointer focus:outline-none text-blue-primary text-xs font-bold" @click="showRemark();$emit('clickedMaxAvailable', true);clearAllError()">{{$t('swap.maxAmount')}}</button>
      </div>
    </div>
    <div class="h-3 mb-2 error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
    <div class="h-3 mb-2 error error-text text-left" v-if="emptyErr">{{ emptyErrorMessage }}</div>
    <div class="text-gray-600 text-xs mr-3 my-1 mb-5 text-left" v-if="isShowRemark==true && remarkOption">{{$t('swap.inputRemark1')}} <b>{{ transactionFee }} xpx</b> {{$t('swap.inputRemark2')}} <b>{{ gasFee }} xpx</b></div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, toRefs} from 'vue'

const p = defineProps({
    placeholder: String,
    errorMessage: String,
    emptyErrorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: {
      type: Number,
      required: true
    },
    title: String,
    disabled: Boolean,
    maxAmount: {
      type: Number,
      required: true
    },
    remarkOption: Boolean,
    transactionFee: String,
    gasFee: Number,
    toolTip: String,
    decimal: {
      type: Number,
      required: true
    },
  })
  defineEmits([
    'update:modelValue',
    'clickedMaxAvailable',
  ])
  
  const {modelValue} = toRefs(p)
      const textErr=ref(false)
      const isShowRemark = ref(false)
      const emptyErr = ref(false)
  watch(modelValue, val => {
      if(val == p.maxAmount){
        isShowRemark.value = true;
      }else{
        isShowRemark.value = false;
      }
    }
  )
    const showRemark = () => {
      isShowRemark.value = true;
    }
    const clearAllError = () => {
      textErr.value = false;
      emptyErr.value = false;
    }
    const checkBalance = (evt:Event) => {
      const target = evt.target as HTMLInputElement
      target.value =  target.value? target.value : "0";
      if(p.maxAmount < Number(target.value.replace(/,/g, ''))){
        textErr.value = true;
      }else{
        textErr.value = false;
      }
    }
    const maskaFormat = () => {
  let maskaFormat = "0";
  if (p.decimal > 0) {
    maskaFormat = maskaFormat + "." + "9".repeat(p.decimal);
  }
  return maskaFormat;
};

const options = {
  preProcess: (val: string) => {
    return val.replace(/,/g, "");
  },
  postProcess: (val: string) => {
    if (!val) return "";
    let sub = 0;
    if (p.decimal > 0) {
      sub =
        1 +
        p.decimal -
        (val.includes(".") ? val.length - val.indexOf(".") : 0);
    }
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: p.decimal,
    })
      .format(parseFloat(val))
      .slice(0, sub ? -sub : undefined);
  },
};
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