<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
        <div class="ml-6 text-xs text-gray-500 text-left" style="width: 170px"><button :disabled="disabled == true" class="border border-gray-200 bg-gray-50 py-1 px-3 rounded-md cursor-pointer relative hover:bg-gray-100 hover:shadow-sm focus:outline-none" style="top: -3px" @click="showRemark();$emit('clickedMaxAvailable', true);clearAllError()">Max. amount</button></div>
      </div>
      <input v-maska="'#*.######'" :disabled="disabled == true"  class="text-placeholder bg-white text-right" :value="parseFloat(modelValue)" @change="checkBalance($event);console.log('c');" @input="$emit('update:modelValue', $event.target.value? parseFloat($event.target.value) : 0)" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @paste="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <div class="w-5"></div>
    </div>
    <div class="h-3 mb-5 inline-block float-left"><div class="error error-text" v-if="textErr || showError">{{ errorMessage }}</div></div>
    <div class="h-3 mb-5 inline-block float-left"><div class="error error-text" v-if="emptyErr">{{ emptyErrorMessage }}</div></div>
    <div class="float-right text-gray-600 text-xs mr-3 my-1 mb-5" v-if="isShowRemark==true && remarkOption">Maximum amount after deducting transaction fee <b>{{ transactionFee }} xpx</b> and gas fee <b>{{ gasFee }} xpx</b></div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { maska } from 'maska';
export default{
  directives: { maska },
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
    gasFee: Number
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

  name: 'SupplyInput',

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
</style>