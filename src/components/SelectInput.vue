<template>
  <div>
    <div class="h-5 text-left">
      <transition enter-active-class="animate__animated animate__fadeInUp">
        <span v-if="showSelectTitle" class="text-xs text-blue-400 ">{{ placeholder }}</span>
      </transition>
    </div>
    <div class="select mb-3" style="position: relative">
      <font-awesome-icon icon="times" class="text-gray-400 hover:text-gray-600 cursor-pointer" style="display: inline-block; position: absolute; top: 9px; right: 25px;" @click="clearSelection()" v-if="displayClear" />
      <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="text-gray-600 w-full border-solid border-b border-gray-200 p-2 mb-2 focus:outline-none" @change="makeSelection">
        <option value="0" disabled hidden key="0">{{ placeholder }}</option>
        <option v-for="i in options" :value="i.val" :key="i.id">{{ i.text }}</option>
      </select>
      <div class="h-3 mb-2"><div class="error text-left" v-if="selectErr">{{ errorMessage }}</div></div>
    </div>
  </div>
</template>

<script>
export default{
  props: [
    'placeholder',
    'errorMessage',
    'options',
    'modelValue'
  ],
  emits:[
    'update:modelValue', 'show-selection', 'default-selected'
  ],
  name: 'SelectInput',
  data() {
    return {
      showSelectTitle: false,
      selectErr: false,
      selectModel: 0,
      displayClear: false
    };
  },
  methods: {
    clearSelection: function() {
      this.selectModel = 0;
      this.$emit("default-selected", 0)
      this.showSelectTitle = false;
      this.selectErr = true;
      this.displayClear = false;
    },

    makeSelection: function(e) {
      this.$emit("show-selection", e.target.value)
      this.showSelectTitle = true;
      this.selectErr = false;
      this.displayClear = true;
    },
  },
  mounted() {
    this.emitter.on("CLEAR_SELECT", payload => {
      this.selectModel = payload;
      this.showSelectTitle = false;
      this.selectErr = false;
      this.displayClear = false;
    });
  }
}
</script>
