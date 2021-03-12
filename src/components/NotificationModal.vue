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
    <div @click="close();" v-if="toggleModal" class="fixed inset-0 bg-opacity-30 bg-blue-primary"></div>
  </div>
</template>

<script>

export default{
  name: 'SignInModal',
  props:['name', 'toggleModal', 'msg', 'time'],
  data() {
    return {

    };
  },

  mounted(){
    if(this.toggleModal){
      setTimeout(() => {
        this.emitter.emit("CLOSE_NOTIFICATION", false);
      }, this.time);
    }
  },

  methods: {
    close: () => {
      this.emitter.emit("CLOSE_NOTIFICATION", false);
    }
  },
}
</script>
