<template>
  <div class="my-2 flex items-center cursor-pointer" @click="toggleModal = !toggleModal"><img
      src="@/modules/dashboard/img/icon-qr_code.svg" class="w-4 h-4 cursor-pointer mr-1 inline-block"><span
      v-if="notIncludeWord != true" class="text-xs font-bold" style="margin-top: 1px">{{ $t('dashboard.scanQR') }}</span>
  </div>
  <transition enter-active-class="animate__animated animate__fadeInDown"
    leave-active-class="animate__animated animate__fadeOutUp">
    <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
      <div class="modal-popup-box">
        <div class="flex flex-col justify-center">
          <img :src="accountAddressQR" class="inline-block">
          <div class='text-center cursor-pointer text-xs font-semibold text-blue-link mt-2'
            @click="toggleModal = !toggleModal;">{{ $t('general.close') }}</div>
        </div>
      </div>
    </div>
  </transition>
  <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>
<script setup lang="ts">
import { ref, toRefs} from "vue";

const props = defineProps({
  accountAddressQR: {
    type: String,
    required:true
  },
  notIncludeWord: Boolean
})

const {accountAddressQR} = toRefs(props)



let toggleModal = ref(false)



</script>
