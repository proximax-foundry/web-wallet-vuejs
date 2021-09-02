<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
        <div class="ml-6 text-xs mt-1 text-gray-500 text-left" style="width: 160px">{{ (title!=undefined)?title:'Send' }}</div>
      </div>
      <input v-if="decimal==0" v-maska="'#*'" :disabled="disabled" class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <input v-else-if="decimal==1" v-maska="'#*.#'" :disabled="disabled"  class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <input v-else-if="decimal==2" v-maska="'#*.##'" :disabled="disabled"  class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <input v-else-if="decimal==3" v-maska="'#*.###'" :disabled="disabled"  class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <input v-else-if="decimal==4" v-maska="'#*.####'" :disabled="disabled"  class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <input v-else-if="decimal==5" v-maska="'#*.#####'" :disabled="disabled"  class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <input v-else v-maska="'#*.######'" :disabled="disabled"  class="text-placeholder bg-white text-right" :value="modelValue" @input="$emit('update:modelValue', parseFloat($event.target.value).toString())" :placeholder="placeholder" @click="clickInputText()" @keyup="checkBalance($event)" @focus="$event.target.select()" @blur="blurInputText()">
      <div class="w-5"></div>
    </div>
    <div class="h-3 mb-2 inline-block float-left"><div class="error error-text text-left inline-block" v-if="textErr || showError">{{ errorMessage }}</div></div>
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
    icon: String,
    showError: Boolean,
    modelValue: String,
    title: String,
    disabled: Boolean,
    decimal: Number,
    balance: Number,
  },

  setup (props) {
    const formatMask = ref("'#*." + ('#')^props.decimal + "'");
    return {
      formatMask,
    }
  },

  emits:[
    'update:modelValue'
  ],

  name: 'SupplyInput',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },

  methods: {
    clickInputText: function() {
      if(!this.showError){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputText: function() {
      if(!this.disabled){
        if(this.modelValue == '' || this.modelValue > this.balance){
          this.borderColor = 'border-2 border-red-primary';
          this.textErr = true;
        }else{
          this.borderColor = 'border-2 border-gray-300';
          this.textErr = false;
        }
      }
    },

    checkBalance: function(evt){
      evt.target.value =  evt.target.value||0;
      if(this.balance < evt.target.value){
        this.textErr = true;
      }else{
        this.textErr = false;
      }
    },
  },

  watch:{
    showError: function(val){
      if(val){
        this.borderColor = 'border-2 border-red-primary';
        this.textErr = true;
      }else{
        this.borderColor = 'border-2 border-gray-300';
        this.textErr = false;
      }
    }
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