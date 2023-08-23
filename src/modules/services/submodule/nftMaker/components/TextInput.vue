<template>
<div>
    <div>
        <input :disabled="disabled" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" :placeholder="placeholder" class="w-full px-3 py-1.5 focus:outline-none border border-black">
    </div>
    <div class="text-red-500 text-left my-2 text-xs" v-if="showError">{{ errorMessage }}</div>
</div>

</template>

<script lang="ts" setup>
    defineProps({ 
        placeholder: String,
        errorMessage: String,
        showError: Boolean,
        disabled: Boolean,
        modelValue: String,
    })

</script>
