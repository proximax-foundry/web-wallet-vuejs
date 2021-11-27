<template>
  <div :class="`${(!disabled)?'cursor-pointer':''}`">
    <div class="border border-gray-200 px-2 py-1 h-14 flex items-center justify-between rounded-md">
      <div>
        <div class="inline-block font-bold text-tsm" :class="`${ disabled?'text-gray-500':'text-black' }`">{{ title }}</div>
        <img src="@/assets/img/icon-info.svg" class="inline-block ml-2 relative" style="top: -1px;" v-tooltip.bottom="'<tiptext>' + toolTip + '</tiptext>'" v-if="toolTip">
      </div>
      <img src="@/assets/img/icon-done.svg" class="inline-block" v-if="modelValue">
      <img src="@/assets/img/icon-undone.svg" class="inline-block" v-else>
    </div>
  </div>
</template>

<script>
import Tooltip from 'primevue/tooltip';
export default{
  directives: { 'tooltip': Tooltip },
  props: {
    title: String,
    disabled: Boolean,
    modelValue: Boolean,
    toolTip: String,
  },
  emits:[
    'update:modelValue'
  ],
  name: 'CheckInput',
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
