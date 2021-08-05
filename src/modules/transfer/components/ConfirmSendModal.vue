<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeConfirmModal();"></font-awesome-icon>
          </div>
          <div class="w-104">
            <div>{{$t('services.proceed')}}}</div>
            <div class="mt-10">
              <button type="button" class="default-btn mr-5 focus:outline-none" @click="closeConfirmModal();">{{$t('deletewallet.cancel')}}}</button>
              <button type="button" class="default-btn py-1" @click="proceedSend()">{{$t('deletewallet.proceed')}}}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeConfirmModal();" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';


export default{
  name: 'ConfirmSendModal',
  props: ['toggleModal'],

  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const closeConfirmModal = () => {
      emitter.emit('CLOSE_CONFIRM_SEND_MODAL', false);
    }

    const proceedSend = () => {
      emitter.emit('CONFIRM_PROCEED_SEND', true);
    }

    return {
      closeConfirmModal,
      proceedSend,
    }
  }


}
</script>
