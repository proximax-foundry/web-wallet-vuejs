<template>
  <div>
    <div class="text-outline bg-white" :class="borderColor">
      <div class="text-icon-outline text-icon" v-if="icon">
        <img v-if="imgRequired" :src="getIcon()">
        <font-awesome-icon :icon="icon" class="text-blue-primary text-txs text-icon-position" v-else></font-awesome-icon>
      </div>
      <div v-else class="mr-4"></div>
      <div class="ml-1 text-xs mt-1 text-gray-500 text-left" style="width: 80px;">{{ title }}</div>
      
      <Calendar :showTime="true" hourFormat="12"  :touchUI="true" class="w-full" v-model="endDate" @date-select="$emit('update:modelValue', endDate);" dateFormat="dd/mm/yy"></Calendar>
      
      <div class="w-1/12 flex-none"></div>
    </div>
  </div>
</template>

<script>
import Calendar from 'primevue/calendar';
import { ref } from 'vue';
export default{
  components: {
    Calendar,
  },
  emits:[
    'update:modelValue'
  ],

  props: [
    'placeholder',
    'errorMessage',
    'icon',
    'title',
    'disabled',
    'modelValue',
    'imgRequired',
  ],

  name: 'CalanderInput',
  setup(p){
    const borderColor = ref('border border-gray-300');
    const textErr = ref(false);
    const endDate = ref('');

    const getIcon = () => {
      return require(`@/${p.icon}`);
    };

    return {
      borderColor,
      textErr,
      endDate,
      getIcon
    }
  }
}
</script>
<style lang="scss">

.p-inputtext{
  border: 0px;
  padding: 0;
  font-size: 14px;
  text-align: right;
}

.p-datepicker {
  padding: 0.5rem;
  background: #ffffff;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: 3px;
}
.p-datepicker:not(.p-datepicker-inline) {
  background: #ffffff;
  border: 0 none;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
}
.p-datepicker:not(.p-datepicker-inline) .p-datepicker-header {
  background: #ffffff;
}
.p-datepicker .p-datepicker-header {
  padding: 0.5rem;
  color: #495057;
  background: #ffffff;
  font-weight: 600;
  margin: 0;
  border-bottom: 1px solid #dee2e6;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.p-datepicker .p-datepicker-header .p-datepicker-prev,
.p-datepicker .p-datepicker-header .p-datepicker-next {
  width: 2rem;
  height: 2rem;
  color: #6c757d;
  border: 0 none;
  background: transparent;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}
.p-datepicker .p-datepicker-header .p-datepicker-prev:enabled:hover,
.p-datepicker .p-datepicker-header .p-datepicker-next:enabled:hover {
  color: #495057;
  border-color: transparent;
  background: #e9ecef;
}
.p-datepicker .p-datepicker-header .p-datepicker-prev:focus,
.p-datepicker .p-datepicker-header .p-datepicker-next:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
}
.p-datepicker .p-datepicker-header .p-datepicker-title {
  line-height: 2rem;
}
.p-datepicker .p-datepicker-header .p-datepicker-title select {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.p-datepicker .p-datepicker-header .p-datepicker-title select:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
  border-color: #2196F3;
}
.p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month {
  margin-right: 0.5rem;
}
.p-datepicker table {
  font-size: 1rem;
  margin: 0.5rem 0;
}
.p-datepicker table th {
  padding: 0.5rem;
}
.p-datepicker table th > span {
  width: 2.5rem;
  height: 2.5rem;
}
.p-datepicker table td {
  padding: 0.5rem;
}
.p-datepicker table td > span {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  transition: box-shadow 0.2s;
  border: 1px solid transparent;
}
.p-datepicker table td > span.p-highlight {
  color: #495057;
  background: #E3F2FD;
}
.p-datepicker table td > span:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
}
.p-datepicker table td.p-datepicker-today > span {
  background: #ced4da;
  color: #495057;
  border-color: transparent;
}
.p-datepicker table td.p-datepicker-today > span.p-highlight {
  color: #495057;
  background: #E3F2FD;
}
.p-datepicker .p-datepicker-buttonbar {
  padding: 1rem 0;
  border-top: 1px solid #dee2e6;
}
.p-datepicker .p-datepicker-buttonbar .p-button {
  width: auto;
}
.p-datepicker .p-timepicker {
  border-top: 1px solid #dee2e6;
  padding: 0.5rem;
}
.p-datepicker .p-timepicker button {
  width: 2rem;
  height: 2rem;
  color: #6c757d;
  border: 0 none;
  background: transparent;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}
.p-datepicker .p-timepicker button:enabled:hover {
  color: #495057;
  border-color: transparent;
  background: #e9ecef;
}
.p-datepicker .p-timepicker button:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
}
.p-datepicker .p-timepicker button:last-child {
  margin-top: 0.2em;
}
.p-datepicker .p-timepicker span {
  font-size: 1.25rem;
}
.p-datepicker .p-timepicker > div {
  padding: 0 0.5rem;
}
.p-datepicker.p-datepicker-timeonly .p-timepicker {
  border-top: 0 none;
}
.p-datepicker .p-monthpicker {
  margin: 0.5rem 0;
}
.p-datepicker .p-monthpicker .p-monthpicker-month {
  padding: 0.5rem;
  transition: box-shadow 0.2s;
  border-radius: 3px;
}
.p-datepicker .p-monthpicker .p-monthpicker-month.p-highlight {
  color: #495057;
  background: #E3F2FD;
}
.p-datepicker.p-datepicker-multiple-month .p-datepicker-group {
  border-right: 1px solid #dee2e6;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  padding-top: 0;
  padding-bottom: 0;
}
.p-datepicker.p-datepicker-multiple-month .p-datepicker-group:first-child {
  padding-left: 0;
}
.p-datepicker.p-datepicker-multiple-month .p-datepicker-group:last-child {
  padding-right: 0;
  border-right: 0 none;
}
.p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover {
  background: #e9ecef;
}
.p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
}
.p-datepicker:not(.p-disabled) .p-monthpicker .p-monthpicker-month:not(.p-highlight):not(.p-disabled):hover {
  background: #e9ecef;
}
.p-datepicker:not(.p-disabled) .p-monthpicker .p-monthpicker-month:not(.p-highlight):not(.p-disabled):focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 0 0.2rem #a6d5fa;
}

.p-datepicker-mask.p-component-overlay {
  background: rgba(0, 0, 0, 0.4);
}

@media screen and (max-width: 769px) {
  .p-datepicker table th, .p-datepicker table td {
    padding: 0;
  }
}
</style>