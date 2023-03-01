<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp">
      <div v-if="toggleModal" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeConfirmModal();"></font-awesome-icon>
          </div>
          <div class="w-92">
            <div class="text-center">{{ $t('transfer.proceedWithZero') }}</div>
            <div class="mt-3">
              <div @click="proceedSend()"
                class='blue-btn py-2  font-semibold cursor-pointer text-center ml-auto mr-auto w-7/12'>
                {{ $t('general.confirm') }}</div>
              <div class='text-center cursor-pointer text-xs font-semibold text-blue-link mt-2'
                @click="closeConfirmModal()">{{ $t('general.cancel') }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeConfirmModal();" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-gray-100 z-20"></div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';


defineProps({
  toggleModal: Boolean
})
const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const closeConfirmModal = () => {
  emitter.emit('CLOSE_CONFIRM_SEND_MODAL', false);
}

const proceedSend = () => {
  emitter.emit('CONFIRM_PROCEED_SEND', true);
}




</script>
