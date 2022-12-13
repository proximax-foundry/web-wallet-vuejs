<template>
  <div>
    <div class="h-5 text-left">
      <transition enter-active-class="animate__animated animate__fadeInUp">
        <span model-v="showSelectTitle" class="text-xs text-blue-400 ">{{ placeholder }}</span>
      </transition>
    </div>
    <div class="select mb-3" style="position: relative">
      <Dropdown
      v-model="selectedMosaic"
      :options="options"
      :style="{'width':'100%'}"
      :showClear="true"
      option-disabled="disabled"
      optionLabel="text"
      @change="makeSelection($event.value)"
      />

      <!-- v-model="modelValue" -->
      <!-- @input="emit('update:modelValue', $event.value.val)" -->

      <!-- $emit('update:modelValue', $event.value.val);makeSelection($event.value.id) -->


      <!-- the clear button -->
      <!-- <font-awesome-icon icon="times" class="text-gray-400 hover:text-gray-600 cursor-pointer" style="display: inline-block; position: absolute; top: 9px; right: 25px;" @click="clearSelection()" v-if="displayClearIcon" />
      
      <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="text-gray-600 w-full border-solid border-b border-gray-200 p-2 mb-2 focus:outline-none" @change="makeSelection">
        <option value="0" disabled hidden key="0">{{ placeholder }}</option>
        <option v-for="i in options" :disabled="disableOptions.filter(obj => {return obj.id === i.val}).length >0" :value="i.val" :key="i.id" class="text-gray-800">{{ i.text }}</option>
      </select>
    -->
      </div>
    </div>
</template>

<script >
export default{
  props: [
    'placeholder',
    'errorMessage',
    'options',
    'modelValue',
    'disableOptions',
    'index',
  ],
  emits:[
    'update:modelValue', 'show-mosaic-selection', 'remove-mosaic-selected'
  ],
  name: 'MosaicInput',
  data() {
    return {
      selectedMosaic: this.modelValue,
      showSelectTitle: false,
      selectErr: false,
      selectModel: 0,
      displayClearIcon: false
    };
  },
  methods: {
    clearSelection: function() {
      this.selectModel = 0;
      this.$emit("remove-mosaic-selected", { index: this.index })
      this.showSelectTitle = false;
      this.selectErr = true;
      this.displayClearIcon = false;
    },

    makeSelection: function(value) {
      // if the clear button is pressed
      if (value === null){
        this.clearSelection()
      }
      else{
        this.$emit('update:modelValue', value.val);
        this.$emit("show-mosaic-selection", {index: this.index});
        this.showSelectTitle = true;
        this.selectErr = false;
        this.displayClearIcon = true;
      }
    },
  },
  mounted() {
    this.emitter.on( "CLEAR_SELECT", payload => {
      this.selectModel = payload;
      this.showSelectTitle = false;
      this.selectErr = false;
      this.displayClearIcon = false;
    });
  },
}
</script>
<style lang="scss">
option{
  padding: 13px; font: 15px calibri; display: block;
}
option:disabled{
  color: #dedede;
}
</style>