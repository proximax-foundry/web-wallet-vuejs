<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
        <div class="ml-6 text-xs mt-1 text-gray-500">{{ title }}</div>
      </div>
      <!-- <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" class="text-placeholder bg-white text-right" :placeholder="placeholder" @click="clickInputText()" @keypress="validate(event)"> -->
      <input :disabled="disabled" :value="modelValue" type="number" min="0" :max="max" @input="$emit('update:modelValue', $event.target.value)" :placeholder="placeholder" class="text-placeholder bg-white text-right" @click="clickInputText()" @keypress="validate(event)">
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
    title: String,
    disabled: Boolean,
    max: String,
  },

  emits:[
    'update:modelValue'
  ],

  name: 'NumberInput',

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

    // blurInputText: function() {
    //   if(this.modelValue == ''){
    //     this.borderColor = 'border-2 border-red-primary';
    //     this.textErr = true;
    //   }else{
    //     this.borderColor = 'border-2 border-gray-300';
    //     this.textErr = false;
    //   }
    // },

    validate: function(evt) {
      var theEvent = evt || window.event;
      // Handle paste
      if (theEvent.type === 'paste') {
        key = theEvent.clipboardData.getData('text/plain');
      } else {
      // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
      }
      var regex = /[0-9]|/;
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
<style lang="scss">
input:disabled{
  color: #dedede;
}
</style>