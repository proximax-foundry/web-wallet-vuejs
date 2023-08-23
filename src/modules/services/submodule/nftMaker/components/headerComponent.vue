<template>
<div class="px-6 py-1 flex justify-between items-center border-b-[2px] border-blue-500 dark:border-blue-600 ">
    <sidebarComponentVue />
    <router-link to="/">
        <img src="@/modules/services/submodule/nftMaker/img/proximax-logo.png" class="w-12 h-12 cursor-pointer"/>
    </router-link>
    <connectComponentVue />
</div> 
</template>

<script setup lang="ts">
import connectComponentVue from './connectComponent.vue';
import sidebarComponentVue from './sidebarComponent.vue';

</script>

<style>

</style>