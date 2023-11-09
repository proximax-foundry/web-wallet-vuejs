<template>
  <div>
    <div class=" bg-white py-2 border">
      <input :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" class="ml-2 text-placeholder bg-white w-11/12 " :placeholder="placeholder" @click="clickInputText()" @focus="focusInputText()" @blur="blurInputText()" maxlength="32">
    </div>
    <div class="error error-text text-left my-2" v-if="textErr || showError">{{ errorMessage }}</div>
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
    imgRequired: Boolean,
  },
  emits:[
    'update:modelValue',
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
      if(!this.showError && !this.disabled){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },
    getIcon() {
      return require(`@/${this.icon}`);
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

    focusInputText: function() {
      this.borderColor = 'border-2 border-blue-primary';
      this.textErr = false;
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
