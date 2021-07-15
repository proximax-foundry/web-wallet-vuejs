<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="showModal" class="popup-outer-center flex z-50">
        <div class="modal-popup-box-sm relative">
          <div class="delete-position" style=" position: absolute; right: 15px;">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal();"></font-awesome-icon>
          </div>
          <div>
            <h1 class="default-title font-bold my-5">{{ addressName }}</h1>
            <div>
              <img class="img-center" :src="qrDataString" width="250" >
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeModal();" v-if="showModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary"></div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";

export default{

  name: 'AddressQRModal',
  props: {
    'showModal': Boolean,
    'addressName': String,
    'qrDataString': String
  },
  setup(p) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    return {
      closeModal
    };
  }
}
</script>