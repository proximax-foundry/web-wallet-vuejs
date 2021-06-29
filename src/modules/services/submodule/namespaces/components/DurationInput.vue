<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon relative">
        <img v-if="imgRequired" :src="getIcon()">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position" v-else></font-awesome-icon>
        <div class="ml-6 text-xs mt-1 text-gray-500 absolute" style="width:150px; top: 0px;">{{ title }}</div>
      </div>
      <!-- @keydown="validate" -->
      <input :disabled="disabled" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" @keypress="validateKey" type="text" min=0 :max="max"  :maxlength="max" :placeholder="placeholder" class="text-placeholder bg-white text-right" @focus="$event.target.select()" @click="clickInputText()">
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
    imgRequired: Boolean,
  },

  emits:[
    'update:modelValue'
  ],

  name: 'DurationInput',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },

  methods: {
    getIcon: function() {
      return require(`@/${this.icon}`);
    },

    clickInputText: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    validateKey: function(e){
      if(this.modelValue.length <=2){
        if(e.charCode < 48 || e.charCode > 59){
          e.preventDefault();
        }else{
          return e.key;
        }
      }else{
        e.preventDefault();
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
<style lang="scss">
input:disabled{
  color: #dedede;
}

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