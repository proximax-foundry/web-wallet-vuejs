<template>
  <div :class="disabled ? 'opacity-50' : ''">
    <div class="border border-gray-200 px-2 py-1  rounded-md">
      <div class="flex flex-col">
        <div class="uppercase font-light text-gray-500 text-txs text-left mb-2">{{ placeholder }}</div>
        <div class="flex w-full">
          <img v-if="logo" src="@/modules/account/img/proximax-logo.svg" class='h-5 w-5 mt-0.5'>
          <input 
            :value="modelValue"
            class="supply_input" v-maska:[options] :data-maska="maskaFormat()"
            data-maska-tokens="0:\d:multiple|9:\d:optional" :placeholder="placeholder" 
            @input="$emit('update:modelValue',parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')).toString() )"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  decimal: {
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
    type: Boolean,
    required: false,
  },
  showError: {
    type: Boolean,
    required: false,
  },

  logo: {
    type: Boolean,
    required: false
  },
  balance: {
    type: Number,
    required: false
  }
});

defineEmits([
    'update:modelValue', 'show-error'
  ])

const maskaFormat = () => {
  let maskaFormat = "0";
  if (props.decimal > 0) {
    maskaFormat = maskaFormat + "." + "9".repeat(props.decimal);
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
    if (props.decimal > 0) {
      sub =
        1 +
        props.decimal -
        (val.includes(".") ? val.length - val.indexOf(".") : 0);
    }
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: props.decimal,
    })
      .format(parseFloat(val))
      .slice(0, sub ? -sub : undefined);
  },
};


</script>
<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.supply_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter  text-sm text-gray-600 font-bold disabled:opacity-50;
}
</style>