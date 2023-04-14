<template>
  <div :class="disabled?'opacity-50':''" class="w-full">
    <div class="border border-gray-200 px-2 py-2 rounded-md h-16">
        <div class="flex gap-2">
            <div class="flex flex-col w-full">
                <div class="uppercase text-gray-500 font-light text-txs text-left mb-1.5">{{ placeholder }}</div>
                <input type="text" :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"  class="w-full font-semibold text-tsm outline-none mt-1">
            </div>
            <div v-if="textErr || showError" class="flex flex-col ml-auto justify-center mt-1">
                <img src="@/assets/img/icon-red-x.svg" class="h-5 w-5 mr-auto ml-auto">
                <div class="text-xxs text-red-400 font-bold uppercase">{{$t('general.invalid')}}</div>
            </div>
            <div v-else class="flex flex-col ml-auto justify-center mt-1">
                <img src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 mr-auto ml-auto">
                <div class="text-xxs text-green-400 font-bold uppercase">{{$t('general.valid')}}</div>
            </div>
        </div>
       

    </div>
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
    'update:modelValue'
  ],
  name: 'TextInputClean',
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

<style lang="scss">
.text_input{
  @apply  flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>
