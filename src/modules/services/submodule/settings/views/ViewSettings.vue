<template>
  <div>
    <div class="mx-auto w-9/12 mt-16">
      <div class="ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <div class="flex justify-between text-sm mb-5">
          <div><span class="text-gray-700">Settings</span></div>
        </div>
        <div class="border border-gray-200 filter drop-shadow-xl py-2 sm:py-14 px-2 sm:px-28 text-center bg-white">
            <div class="flex mb-3 gap-2 items-center">
              <div class="text-left  text-gray-700">Select Language:</div>
              <selectLanguageModal  />
            </div>
            <div class="flex">
              <div class="text-left mb-3 text-gray-700">Sound Volume:</div>
              <selectSoundSetting />
            </div>
            <div class="flex">
              <div class="text-left mt-1 mb-3 text-gray-700">Change Password:</div>
              <changeAccountPassword />
            </div>
            <div class="text-left mb-3 text-gray-700">Nodes</div>
            <NodeComponent />
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import selectLanguageModal from '@/modules/home/components/selectLanguageModal.vue';
import NodeComponent from "@/modules/services/submodule/settings/components/NodeComponent.vue"
import selectSoundSetting from '@/modules/services/submodule/settings/components/selectSoundSetting.vue'; 
import changeAccountPassword from '@/modules/services/submodule/settings/components/changeAccountPassword.vue';
</script>

