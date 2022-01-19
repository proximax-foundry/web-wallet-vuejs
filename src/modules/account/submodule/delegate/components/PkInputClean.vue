<template>
  <div :class="disabled?'opacity-50':''" class="w-full">
    <div class="border border-gray-200 px-2 py-2 rounded-md">
        <div class="flex gap-2">
            <div class="flex flex-col w-full">
                <div class="uppercase text-gray-500 font-light text-txs text-left mb-1.5">{{ placeholder }}</div>
                <div class="flex">
                    <input  :type="inputType" :disabled="disabled == true" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="text-placeholder text-left"  @click="clickInputPassword()" @blur="blurInputPassword()" autocomplete="off">
                    <font-awesome-icon icon="eye" class="text-gray-500 relative cursor-pointer text-right mr-2" @click="hideShowPassword();" v-if="!showPassword"></font-awesome-icon>
                    <font-awesome-icon icon="eye-slash" class="text-gray-500 relative cursor-pointer text-right mr-2" @click="hideShowPassword();" v-if="showPassword"></font-awesome-icon>
                </div>
            </div>
            <div v-if="textErr || showError" class="flex flex-col ml-auto justify-center ">
                <img src="@/assets/img/icon-red-x.svg" class="h-5 w-5 mr-auto ml-auto">
                <div class="text-xxs text-red-400 font-bold">INVALID</div>
            </div>
            <div v-else class="flex flex-col ml-auto justify-center ">
                <img src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 mr-auto ml-auto">
                <div class="text-xxs text-green-400 font-bold">VALID</div>
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
  name: 'PkInputClean',
  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-300',
      textErr: false,
      showPassword: false,
      inputType: "password",
      eyeIcon: 'eye'
    };
  },
  methods: {
      hideShowPassword: function(){
      this.showPassword = !this.showPassword;
      this.showPassword?this.eyeIcon='eye-slash':this.eyeIcon='eye';
      this.showPassword?this.inputType='text':this.inputType='password';
    },
    clickInputText: function() {
      if(!this.showError && !this.disabled){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    getIcon() {
      return require(`@/${this.icon}`);
    },

    clickInputPassword: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputPassword: function() {
      var passwdPattern = "^[^ ]{8,}$";
      if(this.modelValue == ''){
        this.borderColor = 'border-2 border-red-primary';
        this.pswdErr = true;
      }
      else if (Object.keys(this.modelValue).length < 8){
        this.borderColor = 'border-2 border-red-primary';
        this.pswdErr = true;
      }
      else{
        this.borderColor = 'border-2 border-gray-300';
        this.pswdErr = false;
        // }
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
.text_input{
  @apply  flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>
