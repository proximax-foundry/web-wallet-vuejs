<template>
  <div>
    <div class="text-outline bg-white flex" :class="borderColor">
      <div class="text-icon-outline text-icon self-center">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <textarea :value="modelValue" :disabled="disabled==1" @input="countChar($event); $emit('update:modelValue', $event.target.value)" rows=2 class="mt-7 ml-2 self-center w-full text-gray-500 focus:outline-none bg-white text-md" :placeholder="placeholder" @click="clickInputText()" @blur="blurInputText()"></textarea>
      <div class="w-1 flex-none"></div>
    </div>
    <div class="float-right mt-1 text-tsm text-gray-800">{{remainingLength}}/{{limit}}</div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script >
import { ref, getCurrentInstance, watch } from 'vue';
export default{
  props: [
    'placeholder',
    'errorMessage',
    'icon',
    'showError',
    'modelValue',
    'msgOpt',
    'disabled',
    'limit',
    'remainingChar'
  ],
  emits:[
    'update:modelValue'
  ],
  name: 'TransferTextareaInput',

  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const remainingLength = ref(0);
    const inputText = ref("");
    const borderColor = ref('border border-gray-300');
    const textErr = ref(false);

    watch(
      ()=> p.remainingChar,
      (n)=>{
        remainingLength.value = n;
    });

    const countChar = (e) => {
      //remainingLength.value = PlainMessage.create(e.target.value).size();
      if(p.msgOpt=='regular'){
        if( e.target.value.length > p.limit) {
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
        if( !regex.test(key) || e.target.value.length > p.limit) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
      }
    };

    const clickInputText = () => {
      if(!textErr.value){
        borderColor.value = 'border-2 border-blue-primary';
      }
    };

    const blurInputText = () => {
      borderColor.value = 'border-2 border-gray-300';
      textErr.value = false;
    };

    emitter.on("CLEAR_TEXTAREA", payload => {
      remainingLength.value = payload;
    });

    emitter.on("CLEAR_TEXT", payload => {
      inputText.value = payload;
      textErr.value = false;
      borderColor.value = 'border border-gray-300';
    });

    return{
      inputText,
      textErr,
      borderColor,
      countChar,
      remainingLength,
      clickInputText,
      blurInputText
    }
  },
}
</script>
