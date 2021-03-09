<template>
  <div>
    <div class="text-outline" :class="borderColor">
      <div class="text-icon-outline text-icon">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position"></font-awesome-icon>
      </div>
      <input v-model="inputText" type="text" class="text-placeholder" :placeholder="placeholder" @click="clickInputText()" @blur="blurInputText()">
      <div class="w-1/12 flex-none"></div>
    </div>
    <div class="h-3 mb-2"><div class="error error-text text-left" v-if="textErr">{{ errorMessage }}</div></div>
  </div>
</template>

<script>
export default{
  props: [
    'placeholder',
    'errorMessage',
    'icon',
  ],
  name: 'TextInput',
  data() {
    return {
      inputText: "",
      borderColor: 'border border-gray-100',
      textErr: false,
    };
  },
  methods: {
    clickInputText: function() {
      if(!this.pswdErr){
        this.borderColor = 'border-2 border-blue-primary';
      }
    },

    blurInputText: function() {
      this.borderColor = 'border-2 border-red-primary';
      if(this.inputText == ''){
        this.textErr = true;
      }
    },
  },
  mounted() {
    this.emitter.on("CLEAR_TEXT", payload => {
      this.inputText = payload;
      this.textErr = false;
      this.borderColor = 'border border-gray-100';
    });

  }
}
</script>
