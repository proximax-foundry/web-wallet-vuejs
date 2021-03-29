<template>
  <div>
    <div class="text-outline bg-white flex" :class="borderColor">
      <div class="text-icon-outline text-icon self-center">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @keypress="countChar" rows=2 class="mt-7 ml-2 self-center w-full text-gray-500 focus:outline-none bg-white text-md" :placeholder="placeholder" @click="clickInputText()" @blur="blurInputText()"></textarea>
      <div class="w-1 flex-none"></div>
    </div>
    <div class="float-right mt-1 text-tsm text-gray-800">{{remainingChar}}/1024</div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
export default{
  props: [
    'placeholder',
    'errorMessage',
    'icon',
    'showError',
    'modelValue',
    'msgOpt',
  ],
  emits:[
    'update:modelValue'
  ],
  name: 'TextareaInput',
  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },
  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const remainingChar = ref(0);
    const countChar = (e) => {
      var limit = 1024;
      remainingChar.value = e.target.value.length;
      if(p.msgOpt=='regular'){
        if( e.target.value.length > limit) {
          e.returnValue = false;
          if(e.preventDefault) e.preventDefault();
        }
      }else{
        var theEvent = e || window.event;
        // Handle paste
        if (theEvent.type === 'paste') {
          key = theEvent.clipboardData.getData('text/plain');
        } else {
        // Handle key press
          var key = theEvent.keyCode || theEvent.which;
          key = String.fromCharCode(key);
        }
        var regex = /[0-9A-Fa-f]|\./;
        if( !regex.test(key) || e.target.value.length > limit) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
      }
    }

    emitter.on("CLEAR_TEXTAREA", payload => {
      remainingChar.value = payload;
    });

    return{
      countChar,
      remainingChar,
    }
  },
  methods: {
    clickInputText: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputText: function() {
      if(this.modelValue == ''){
        this.borderColor = 'border-2 border-red-primary';
        this.textErr = true;
      }else{
        this.borderColor = 'border-2 border-gray-300';
        this.textErr = false;
      }
    },
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
