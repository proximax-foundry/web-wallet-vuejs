<template>
  <div>
    <div class="text-outline bg-white flex" :class="borderColor">
      <div class="text-icon-outline text-icon self-center">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <textarea :value="modelValue" :disabled="disabled==1" @input="$emit('update:modelValue', $event.target.value)" rows=2 class="mt-7 ml-2 self-center w-full text-gray-500 focus:outline-none bg-white text-md" :placeholder="placeholder" @click="clickInputText()" @blur="blurInputText()"></textarea>
      <div class="w-1 flex-none"></div>
    </div>
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
    'disabled',
  ],
  emits:[
    'update:modelValue'
  ],
  name: 'TextareaInput',

  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const inputText = ref("");
    const borderColor = ref('border border-gray-300');
    const textErr = ref(false);

    const clickInputText = () => {
      if(!textErr.value){
        borderColor.value = 'border-2 border-blue-primary';
      }
    };

    const blurInputText = () => {
      borderColor.value = 'border-2 border-gray-300';
      textErr.value = false;
    };

    emitter.on("CLEAR_TEXT", payload => {
      inputText.value = payload;
      textErr.value = false;
      borderColor.value = 'border border-gray-300';
    });

    return{
      inputText,
      textErr,
      borderColor,
      clickInputText,
      blurInputText
    }
  },
}
</script>