<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
        <div class="ml-6 text-xs mt-1 text-gray-500">{{ title }}</div>
      </div>
      <!-- <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" class="text-placeholder bg-white text-right" :placeholder="placeholder" @click="clickInputText()" @keypress="validate(event)"> -->
      <!-- @keydown="validate" -->
      <input :disabled="disabled" :value="modelValue" @input="validate" @keypress="validateKey" type="number" size="1" maxlength="1" min=0 :max="max" :placeholder="placeholder" class="text-placeholder bg-white text-right" @click="clickInputText()">
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
    max: Number,
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

    validateKey: function(e){
      if(e.charCode < 48 || e.charCode > 54){
        e.preventDefault();
      }else{
        return e.key;
      }

    },

    validate: function(e) {
      if(e.data > -1 && e.data < 7){
        this.$emit('update:modelValue', e.data);
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