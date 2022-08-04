<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }} <img src="@/assets/img/icon-info.svg" class="inline-block ml-1 relative cursor-pointer" style="top: -1px;" v-tooltip.bottom="{ value:'<tiptext>' + toolTip + '</tiptext>', escape: true}" v-if="toolTip"></div>
      <AutoNumericVue 
        :value="modelValue"
        :disabled ='disabled'
        class="supply_input"  
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
        @input="$emit('update:modelValue',parseFloat($event.target.value.replace(/,/g, '')).toString() )"
        @keyup="checkBalance($event)"
        @focus="$event.target.select()" 
        @blur="blurInputText()"
      ></AutoNumericVue>
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { maska } from 'maska';
import Tooltip from 'primevue/tooltip';
import AutoNumericVue from 'autonumeric-vue/src/components/AutoNumericVue';
export default{
  directives: { maska, 'tooltip': Tooltip },
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
    toolTip: String,
  },
  components:{
    AutoNumericVue
  },
  setup (props) {
    const formatMask = ref("'#*." + ('#')^props.decimal + "'");
    return {
      formatMask,
    }
  },

  emits:[
    'update:modelValue', 'show-error'
  ],

  name: 'SupplyInput',

  data() {
    return {
      inputText: "",
      textErr: false,
    };
  },

  methods: {

    blurInputText: function() {
      if(!this.disabled){
        if(this.modelValue == '' || this.modelValue > this.balance){
          this.textErr = true;
        }else{
          this.textErr = false;
        }
      }
    },

    checkBalance: function(evt){
      evt.target.value =  evt.target.value||0;
      if(this.balance < evt.target.value){
        this.textErr = true;
        this.$emit('show-error', true);
      }else{
        this.textErr = false;
        this.$emit('show-error', false);
      }
    },
  },

  watch:{
    showError: function(val){
      if(val){
        this.textErr = true;
      }else{
        this.textErr = false;
      }
    }
  },

  mounted() {
    this.emitter.on("CLEAR_TEXT", payload => {
      this.inputText = payload;
      this.textErr = false;
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