<template>
    <img  @click="generateQr(),toggleModal = true" src="@/assets/img/qr-scan.svg" class="w-12 h-12 mt-4 cursor-pointer" >
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box">
          <div class="flex justify-center"><div v-html="txnQr" class="inline-block"></div></div>
          <div class= 'text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="toggleModal = !toggleModal;">{{$t('general.close')}}</div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>

<script lang='ts'>
export default {
    name:"TxnQrModal"
}

</script>

<script setup lang='ts'>
import { defineComponent, getCurrentInstance,ref} from "vue";

const props = defineProps({
    txnQr :String,
})
const internalInstance = getCurrentInstance();
const emitter = internalInstance!.appContext.config.globalProperties.emitter;
const toggleModal = ref(false)
const generateQr = ()=>{
    emitter.emit('generateQr')
}
   
</script>