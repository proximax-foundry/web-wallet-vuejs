<template>
    <div class="mt-10 flex-grow px-5">
      <div class="w-11/12 ml-auto mr-auto">
        <div class="flex">
          <div class='py-3 px-6 lg:flex items-center'>
            <div class="text-xl mr-2 mb-2">Airdrop Token Utility</div>
          </div>        
        </div>
      </div>
        <div class='mt-2 py-3 '>
          <div class="w-11/12 ml-auto mr-auto border-2">
            <SiriusDistributionForm/>
          </div>
        </div>
      <div class="mb-36"/>
    </div>
  </template>

<script setup lang="ts">
import SiriusDistributionForm from '@/modules/services/submodule/airdropToken/components/SiriusDistributionForm.vue'
</script>
