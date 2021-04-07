<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <input :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" class="text-placeholder bg-white" :placeholder="placeholder" @click="clickInputText()" @blur="blurInputText()">
      <div class="w-1/12 flex-none"></div>
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
    disabled: Boolean,
    modelValue: String,
  },
  emits:[
    'update:modelValue'
  ],
  name: 'TextInput',
  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },
  methods: {
    clickInputText: function() {
      if(!this.pswdErr && !this.disabled){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputText: function() {
      if(!this.disabled){
        if(this.modelValue == ''){
          this.borderColor = 'border-2 border-red-primary';
          this.textErr = true;
        }else{
          this.borderColor = 'border-2 border-gray-300';
          this.textErr = false;
        }
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
