<template>
    <div class="min-h-screen dark:bg-[#121212]" >
      <headerComponentVue />
      <router-view />
      <div class="h-24"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import headerComponentVue from '../components/headerComponent.vue';
  
  
  
  
  </script>
  
  <style scoped>
  
  </style>