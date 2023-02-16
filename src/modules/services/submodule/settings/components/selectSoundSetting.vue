<template>
    <div>
      <img src="@/assets/img/globe-white.svg" class="h-4 w-4 inline-block relative mr-2 " style="top: -1px">
      <InputSwitch v-model="checkedValue" />
    </div>
  </template>
  
  <script lang="ts">
  import { computed, ref, WritableComputedRef } from 'vue';
  import InputSwitch from 'primevue/inputswitch';
  export default{
    name: 'selectSoundSetting',
    components:{
      InputSwitch,
    },
    setup(){
      const currentState = ref(JSON.parse(sessionStorage.getItem("soundSetting")));

      const checkedValue: WritableComputedRef<boolean> = computed({
            get(): boolean {
                sessionStorage.setItem("soundSetting", String(currentState.value));
                return currentState.value
            },
            set(newValue: boolean): void {
                currentState.value = newValue;
            },
        });

  
      return{
        checkedValue,
      };
    },
  };
  </script>