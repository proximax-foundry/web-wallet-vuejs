<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
        <div class="ml-6 text-xs mt-1 text-gray-500">{{ (title!=undefined)?title:'Send' }}</div>
      </div>
      <input :disabled="disabled" :value="parseFloat(modelValue).toFixed(decimal)" @input="$emit('update:modelValue', parseFloat($event.target.value).toFixed(decimal))" :placeholder="placeholder" class="text-placeholder bg-white text-right" @click="clickInputText()" @keypress="validate($event)" @keyup="checkBalance($event)">
      <div class="w-5"></div>
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script>

export default{
  props: {
    placeholder: String,
    errorMessage: String,
    icon: String,
    showError: Boolean,
    modelValue: String,
    options: Object,
    title: String,
    disabled: Boolean,
    decimal: Number,
    balance: Number,
  },

  // setup (props) {
  //   const { formatedValue, inputRef } = useCurrencyInput(props.options)

  //   return {
  //     inputRef,
  //     formatedValue,
  //   }
  // },

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
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    checkBalance: function(evt){
      if(this.balance < evt.target.value){
        this.textErr = true;
      }else{
        this.textErr = false;
      }
    },

    validate: function(evt) {
      // verify balance
      var theEvent = evt || window.event;
      // Handle paste
      if (theEvent.type === 'paste') {
        key = theEvent.clipboardData.getData('text/plain');
      } else {
      // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
      }
      var regex = /[0-9]|\./;
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
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
