<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position" style="right: 3px;"></font-awesome-icon>
      </div>
      <input :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @keypress="validate" type="text" :placeholder="placeholder" class="text-placeholder bg-white" @click="clickInputText()" @blur="blurInputText()">
      <div class="w-5"></div>
    </div>
    <div class="float-right mt-1 text-tsm text-gray-800">{{remainingLength}}/{{limit}}</div>
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
    limit: Number,
  },

  emits:[
    // 'update-divisibility'
    'update:modelValue'
  ],

  name: 'CardMessageInput',

  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
    };
  },

  computed: {
    remainingLength: function () {
      return this.modelValue.length;
    }
  },

  methods: {
    clickInputText: function() {
      if(!this.pswdErr){
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

    validate: function(e){
      if( e.target.value.length > (this.limit-1)) {
        e.returnValue = false;
        e.preventDefault();
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