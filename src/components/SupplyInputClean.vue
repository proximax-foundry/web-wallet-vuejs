<template>
  <div :class="disabled ? 'opacity-50' : ''">
    <div class="border border-gray-200 px-2 py-1 h-14 rounded-md">
      <div class="uppercase text-gray-500 text-txs text-left mb-2">{{ placeholder }}
        <img src="@/assets/img/icon-info.svg" v-if="toolTip" class="inline-block ml-1 relative cursor-pointer"
          style="top: -1px;" v-tooltip.bottom="{
            value: '<tiptext>' + toolTip + '</tiptext>',
            escape: true
          }">
      </div>
      <input  :value="modelValue" class="supply_input" v-maska:[options] :data-maska="maskaFormat()"
        data-maska-tokens="0:\d:multiple|9:\d:optional" :placeholder="placeholder" />
    </div>
    <div class="h-3 mb-2">
      <div class="error error-text text-left" v-if="showError">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  divisibility: {
    type: Number,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  toolTip: {
    type: String,
    required: false,
  },
  disabled: {
    type: String,
    required: false,
  },
  showError: {
    type: String,
    required: false,
  },
  errorMessage: {
    type: String,
    required: false,
  },
});

const maskaFormat = () => {
  let maskaFormat = "0";
  if (props.divisibility > 0) {
    maskaFormat = maskaFormat + "." + "9".repeat(props.divisibility);
  }
  return maskaFormat;
};

const options = {
  preProcess: (val: string) => {
    return val.replace(/,/g, "");
  },
  postProcess: (val: string) => {
    if (!val) return "";
    let sub = 0;
    if (props.divisibility > 0) {
      sub =
        1 +
        props.divisibility -
        (val.includes(".") ? val.length - val.indexOf(".") : 0);
    }
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: props.divisibility,
    })
      .format(parseFloat(val))
      .slice(0, sub ? -sub : undefined);
  },
};
</script>

<style lang="scss" scoped>
.supply_input {
  @apply w-full flex border-0 border-white drop-shadow-none filter focus:outline-none text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>
