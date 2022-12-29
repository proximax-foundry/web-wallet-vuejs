<template>
  <div>
    <!-- showing blue text of select assets -->
    <div class="h-5 text-left">
      <transition enter-active-class="animate__animated animate__fadeInUp">
        <span model-v="showSelectTitle" class="text-xs text-blue-400 ">{{ placeholder }}</span>
      </transition>
    </div>
    <!-- for the dropdown -->
    <div class="select mb-3" style="position: relative;">
      <Dropdown
      v-model="selectedMosaic"
      :options="this.options"
      :style="{'width':'100%'}"
      :showClear="true"
      :filter="true"
      :filterFields="label"
      optionLabel="text"
      option-disabled="disabled"
      :placeholder="this.placeholder"
      @change="makeSelection($event.value)"
      :virtualScrollerOptions="{
        itemSize:32,
        scrollHeight:`flex`,
        style:`max-height: ` + (this.options.length * 32 + 35) + `px;`,
      }">
      <template  #value="slotProps">
        <div v-if="slotProps.value">
          <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{slotProps.value.label}} <span class="text-tsm text-gray-400"> ({{slotProps.value.balance}})</span></div>
        </div>
        <span v-else>
          {{slotProps.placeholder}}
        </span>
      </template>
        <template #option="slotProps">
          <div style="display: flex;justify-content: space-between;">
            <span class="text-sm">{{slotProps.option.label}}</span>
            <span class="text-tsm text-gray-500">{{slotProps.option.balance}}</span>
          </div>
        </template>
      </Dropdown>
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
      label: ["label"],
      showSelectTitle: false,
      selectErr: false,
      selectModel: 0,
      displayClearIcon: false,
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
      if (value == null){
        this.clearSelection()
      }
      // if dropdown is pressed
      else{
        this.$emit('update:modelValue', value.val);
        this.$emit("show-mosaic-selection", {index: this.index});
        this.showSelectTitle = true;
        this.selectErr = false;
        this.displayClearIcon = true;
      }
    },
  },
  watch: {
    // watch the length of the disable options so that each components can be updated accordingly
    'disableOptions.length':{
      handler: function (val, old_val) { 
        // if the number of assets is reduced, need to update all value
        if (old_val-1 == val){
          for (let i in this.disableOptions){
            if (i == this.index){
              // check if there is no value in the index
              if (this.disableOptions[this.index].id == 0){
                this.selectedMosaic = 0
              }
              else{
                const i = this.options.findIndex(item => item.val === this.disableOptions[this.index].id);
                this.selectedMosaic = this.options[i]
              }
            }
          }
        }
      },
      deep: true
    }
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
</style>