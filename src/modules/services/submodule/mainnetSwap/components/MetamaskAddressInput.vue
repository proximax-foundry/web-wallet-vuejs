<template>
  <div>
    <div class="border border-gray-200 rounded">
      <div class="flex justify-left">
        <div class="w-18 flex items-center justify-center py-5 sm:h-20 flex-none">
          <img src="@/modules/services/submodule/mainnetSwap/img/icon-metamask-fox.svg" class="w-8 h-8 inline-block">
        </div>
        <div class="text-left flex items-center">
          <div class="block">
            <div class="text-xxs uppercase text-blue-primary font-bold">To MetaMask Address</div>
            <input :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" size="80" class="placeholder bg-white" :placeholder="placeholder" @click="clickInputText()" @focus="focusInputText()" @blur="blurInputText()">            
          </div>
        </div>
      </div>
    </div>
    <div class="error error-text text-left" v-if="textErr || showError">{{ errorMessage }}</div>
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
  name: 'MetamaskAddressInput',
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
,<style lang="scss" scoped>
.placeholder{
  @apply flex-grow text-xs placeholder-gray-500 focus:outline-none w-full;
}
</style>