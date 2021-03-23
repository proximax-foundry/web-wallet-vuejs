<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="inputType" class="text-placeholder" :placeholder="placeholder" @click="clickInputPassword()" @blur="blurInputPassword()" autocomplete="off">
      <div class="inline-block flex-none mr-2">
        <font-awesome-icon icon="eye" class="text-gray-400 relative" @click="hideShowPassword();" v-if="!showPassword"></font-awesome-icon>
        <font-awesome-icon icon="eye-slash" class="text-gray-400 relative" @click="hideShowPassword();" v-if="showPassword"></font-awesome-icon>
      </div>
    </div>
    <div class="h-3 mb-2"><div class="error error-password text-left" v-if="pswdErr || showError">{{ errorMessage }}</div></div>
  </div>
</template>

<script>
export default{
  props: [
    'placeholder',
    'errorMessage',
    'icon',
    'showError',
    'modelValue'
  ],
  emits:[
    'update:modelValue'
  ],
  name: 'PasswordInput',
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
    hideShowPassword: function() {
      this.showPassword = !this.showPassword;
      this.showPassword?this.eyeIcon='eye-slash':this.eyeIcon='eye';
      this.showPassword?this.inputType='text':this.inputType='password';
    },

    clickInputPassword: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputPassword: function() {
      var passwdPattern = "^[^ ]{8,}$";
      if(this.modelValue == '' || this.modelValue.match(passwdPattern) == null){
        this.borderColor = 'border-2 border-red-primary';
        this.pswdErr = true;
      }else{
        this.borderColor = 'border-2 border-gray-300';
        this.pswdErr = false;
      }
    },
  },
  mounted() {
    this.emitter.on("CLEAR_PASSWORD", payload => {
      this.inputPassword = payload;
      this.pswdErr = false;
      this.borderColor = 'border border-gray-300';
    });
  }
}
</script>
