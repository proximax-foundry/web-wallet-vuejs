<template>
  <div>
    <!-- showing blue text of select assets -->
    <div class="h-5 text-left">
      <transition enter-active-class="animate__animated animate__fadeInUp">
        <span class="text-xs text-blue-400 ">{{ placeholder }}</span>
      </transition>
    </div>
    <!-- for the dropdown -->
    <div class="select mb-3" style="position: relative;">
      <Dropdown v-model="modelValue" :options="options" :style="{ 'width': '100%' }" :showClear="true" :filter="true"
         optionLabel="text" option-disabled="disableOptions" :placeholder="placeholder"
        @change="makeSelection($event.value)" :virtualScrollerOptions="{
          itemSize: 32,
          scrollHeight: `flex`,
          style: `max-height: ` + (options.length * 32 + 35) + `px;`,
        }">
        <template #value="slotProps">
          <div v-if="slotProps.value">
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ slotProps.value.label }} <span
                class="text-tsm text-gray-400"> ({{ slotProps.value.balance }})</span></div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div style="display: flex;justify-content: space-between;">
            <span class="text-sm">{{ slotProps.option.label }}</span>
            <span class="text-tsm text-gray-500">{{ slotProps.option.balance }}</span>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script lang=ts setup>
import { ref } from 'vue';
interface mosaicOption {
  val: string,
  balance: string,
  label: string,
  disabled: boolean
}

interface selectedMosaic{
  id:string,
  amount:string,
  namespace:string
}
const props = defineProps({
  placeholder: String,
  options: {
    type:Array<mosaicOption>,
    required:true
  },
  modelValue: {
    type:String,
    required:true
  },
  disableOptions:{
    type: Array<selectedMosaic>,
    required:true
  },
  index:{
    type:Number,
    required:true
  }
})
  const selectedMosaic = ref(props.modelValue)

  const emit = defineEmits([
    'update:modelValue', 'show-mosaic-selection', 'remove-mosaic-selected'
  ])

  const clearSelection = () => {
    emit("remove-mosaic-selected", { index: props.index })
  }
  const makeSelection = (value :mosaicOption | null) => {
    // if the clear button is pressed
    if (value == null) {
      clearSelection()
    }
    // if dropdown is pressed
    else {
      emit('update:modelValue', value.val);
      emit("show-mosaic-selection", { index: props.index });
    }
  }



</script>