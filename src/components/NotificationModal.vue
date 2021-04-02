<template>
  <div class="inline-block">
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="close()"></font-awesome-icon>
          </div>
          <div class="w-104">
            {{ msg }}
          </div>
        </div>
      </div>
    </transition>
    <div @click="close();" v-if="toggleModal" :class="`fixed inset-0 bg-opacity-30 ${bgColor}`"></div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, watch } from 'vue';

export default{
  name: 'SignInModal',
  props:['name', 'toggleModal', 'msg', 'time', 'notiType'],

  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const bgColor = computed(()=>{
      if(p.notiType == 'warn'){
        return 'bg-yellow-200';
      }else if(p.notiType == 'err'){
        return 'bg-pink-200';
      }else{
        return 'bg-blue-primary';
      }
    });

    if(p.toggleModal){
      setTimeout(() => {
        emitter.emit("CLOSE_NOTIFICATION", false);
      }, p.time);
    }

    const close= () => {
      emitter.emit("CLOSE_NOTIFICATION", false);
    }

    watch(() => p.toggleModal, () => {
      setTimeout(() => {
        emitter.emit("CLOSE_NOTIFICATION", false);
      }, p.time);
    });


    return{
      bgColor,
      close,
    };
  },
}
</script>
