<template>
  <div class="md:col-span-1 p-5 sm:pt-20 text-tsm md:text-sm text-gray-700 md:text-right xl:mr-32">
    <div class="text-sm my-2 md:text-xl md:my-7 text-white">{{$t('home.title')}} {{ versioning }}</div>
    <div class="xl:w-72 text-white md:inline-block">{{$t('home.titleDescription')}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from "vue";
import packageData from "../../package.json";

export default {
  name: 'IntroTextComponent',
  
  setup() {
    const versioning = ref('0.0.1');

    versioning.value = packageData.version;

    
    return {
      versioning
    }
  }


}

  
</script>
