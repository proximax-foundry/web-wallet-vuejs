<template>
    <div :class="disabled?'opacity-50':''">
      <div class="border border-gray-200 px-2 py-1  rounded-md">
          <div class="flex flex-col">
              <div class="uppercase font-light text-gray-500 text-txs text-left mb-2">{{ placeholder }}</div>
              <div class="flex w-full">
                  <input 
                    :value="modelValue"
                    class="supply_input" v-maska:[options] :data-maska="maskaFormat()"
                    data-maska-tokens="0:\d:multiple|9:\d:optional" :placeholder="placeholder" 
                    @input="$emit('update:modelValue',parseFloat((<HTMLInputElement>$event.target).value.replace(/,/g, '')).toString() )"
                    @keydown="handleKeyDown"
                  />
              </div>
          </div>
      </div>
    </div>

  </template>
  
  <script setup lang="ts">

  
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
    disabled: {
      type: Boolean,
      required: false,
    },



  });


  
  const emit = defineEmits([
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

  const handleKeyDown = (event: KeyboardEvent) =>{
 // Check if the pressed key is either backspace or delete
 if (event.key === 'Backspace' || event.key === 'Delete') {
  event.preventDefault(); // Prevent the default behavior
        
  const cursorPosition = (event.target as HTMLInputElement).selectionStart!;
  const deletePosition = (event.key === 'Backspace') ? cursorPosition - 1 : cursorPosition;

  const inputValue = (event.target as HTMLInputElement).value;
    
    // Ensure delete position is within bounds
    if (deletePosition >= 0 && deletePosition < inputValue.length) {
      // Remove character at delete position
      const newText = inputValue.slice(0, deletePosition) + inputValue.slice(deletePosition + 1);

      // Emit updated modelValue back to the parent component
      emit('update:modelValue', newText);

      // Set the input value after deletion
      (event.target as HTMLInputElement).value = newText;

      // Set the cursor position after deletion
      (event.target as HTMLInputElement).setSelectionRange(deletePosition, deletePosition);
    }
  }
}
  
  
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