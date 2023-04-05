<template>
    <div>
        <img src="@/assets/img/globe-white.svg" class="h-4 w-4 inline-block relative mr-2 " style="top: -1px">
        <InputSwitch v-model="checkedValue" />
    </div>
</template>
  
<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { WritableComputedRef } from 'vue'
import InputSwitch from 'primevue/inputswitch';

const currentState = ref(JSON.parse(sessionStorage.getItem("soundSetting") || '{}'));

const checkedValue: WritableComputedRef<boolean> = computed({
    get(): boolean {
        sessionStorage.setItem("soundSetting", String(currentState.value));
        return currentState.value
    },
    set(newValue: boolean): void {
        currentState.value = newValue;
    },
});

</script>