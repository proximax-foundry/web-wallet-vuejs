<template>
  <div :class="disabled ? 'opacity-50' : ''" class="flex flex-col ">
    <div class="border border-gray-200 px-2 py-1 h-12 flex flex-col">
      <div class="uppercase text-gray-400 font-light text-txs text-left mb-2">
        {{ placeholder }}
      </div>
      <input
        :disabled="disabled"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        class="text_input"
      />
    </div>

    <div class="error error-text text-left " v-if="textErr || showError">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    errorMessage: String,
    icon: String,
    showError: Boolean,
    disabled: Boolean,
    modelValue: String,
    imgRequired: Boolean,
  },
  emits: ["update:modelValue"],
  name: "TextInputClean",
  data() {
    return {
      inputText: "",
      borderColor: "border border-gray-300",
      textErr: false,
    };
  },
  methods: {
    clickInputText: function () {
      if (!this.showError && !this.disabled) {
        this.borderColor = "border-2 border-blue-primary";
      }
    },

    getIcon() {
      return require(`@/${this.icon}`);
    },

    blurInputText: function () {
      if (!this.disabled) {
        if (this.modelValue == "") {
          this.borderColor = "border-2 border-red-primary";
          this.textErr = true;
        } else {
          this.borderColor = "border-2 border-gray-300";
          this.textErr = false;
        }
      }
    },

    focusInputText: function () {
      this.borderColor = "border-2 border-blue-primary";
      this.textErr = false;
    },
  },
  mounted() {
    this.emitter.on("CLEAR_TEXT", (payload) => {
      this.inputText = payload;
      this.textErr = false;
      this.borderColor = "border border-gray-300";
    });
  },
};
</script>

<style lang="scss">
.text_input {
  @apply w-full flex border-0 outline-none border-white drop-shadow-none filter focus:outline-none text-tsm text-gray-600 font-bold disabled:opacity-50;
}
</style>
