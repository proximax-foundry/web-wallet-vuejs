<template>
  <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
    <div class="w-11/12 ml-auto mr-auto">
      <div class="flex">
        <div class='py-3 px-6 lg:flex items-center'>
          <div class="text-xl mr-2 mb-2">Create Nft</div>
        </div>        
      </div>
    </div>
      <div class='mt-2 py-3 '>
        <div class="w-11/12 ml-auto mr-auto border-2">
          <CreateNftForm/>
        </div>
      </div>
    <div class="mb-36"/>
  </div>
</template>

<script setup lang="ts">
import CreateNftForm from '@/modules/services/submodule/nftMaker/components/CreateNftForm.vue'
</script>