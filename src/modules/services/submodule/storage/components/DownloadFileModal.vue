<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="showModal" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box relative">
          <div class="delete-position" style=" position: absolute; right: 15px;">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="closeModal();"></font-awesome-icon>
          </div>
          <div>
            <h1 class="default-title font-bold my-5">{{$t('download.download')}}</h1>
            <div>{{$t('download.yourfile')}}<b>{{ fileName }}</b> {{$t('download.isready')}}.</div>
            <div class="mt-10">
              <button type="button" class="default-btn mr-5 focus:outline-none">{{$t('download.download')}}</button>
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

  name: 'DownloadFileModal',
  components: {
  },
  props: {
    'fileName': String,
    'showModal': Boolean,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const closeModal = () => {
      emitter.emit("CLOSE_MODAL", false);
    };

    return {
      closeModal,
    };
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin: 15px auto;
  > div{
    @apply text-xs;
    margin-bottom: 5px;
    div:first-child{
      font-weight: bold;
    }
  }
}
</style>