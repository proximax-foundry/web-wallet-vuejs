<template>
  <div :class="disabled?'opacity-50':''">
    <div class="border border-gray-200 px-2 py-2 text-left flex justify-between items-center">
      <div>
        <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">{{ placeholder }}</div>
        <input :type="inputType" :disabled="disabled == true" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="text_input" :placeholder="placeholder" @click="clickInputPassword()" @blur="blurInputPassword()" autocomplete="off">
      </div>
      <font-awesome-icon icon="eye" class="text-gray-500 relative cursor-pointer text-right mr-2" @click="hideShowPassword();" v-if="!showPassword"></font-awesome-icon>
      <font-awesome-icon icon="eye-slash" class="text-gray-500 relative cursor-pointer text-right mr-2" @click="hideShowPassword();" v-if="showPassword"></font-awesome-icon>
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="pswdErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    placeholder: {
      type: String
    },
    errorMessage: {
      type: String
    },
    icon: {
      type: String
    },
    showError: {
      type: Boolean
    },
    modelValue: {
      type: String
    },
    disabled: {
      type: Boolean
    }
  },
  emits:[
    'update:modelValue'
  ],
  name: 'PasswordInputClean',
  data() {
    return {
      inputPassword: "",
      showPassword: false,
      inputType: 'password',
      borderColor: 'border border-grey-300',
      eyeIcon: 'eye',
      pswdErr: false,
    };
  },
  methods: {
    hideShowPassword: function() : void {
      this.showPassword = !this.showPassword;
      this.showPassword?this.eyeIcon='eye-slash':this.eyeIcon='eye';
      this.showPassword?this.inputType='text':this.inputType='password';
    },

    clickInputPassword: function() :void {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputPassword: function() :void {
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
    // this.emitter.on("CLEAR_PASSWORD", (payload) => {
    //   this.inputPassword = payload;
    //   this.pswdErr = false;
    //   this.borderColor = 'border border-gray-300';
    // });
  }
});
</script>

<style lang="scss">
.text_input{
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 disabled:opacity-50;
}
</style>
