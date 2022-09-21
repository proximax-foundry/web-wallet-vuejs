<template>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box">
          <div>Select Token</div>
          <div class="w-full px-3 py-1 flex justify-between mb-3 mt-3 md:mt-0 md:mb-0 border-gray-300 border">
            <input v-model="token" type="text" class="w-28 outline-none text-xs float-left" :placeholder="$t('general.search')">
            <img src="@/modules/services/submodule/addressbook/img/icon-search_black.svg" class="inline-block">
          </div>
          <div class="flex justify-center">
          </div>
          <div class='text-center cursor-pointer text-xs font-semibold text-blue-link mt-2' @click="closeModal">{{$t('general.close')}}</div>
        </div>
      </div>
    </transition>
    <div v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
</template>
<script>
import { ref } from "vue";

export default {
  name: 'SelectTokenModal',
  emit: ['closeModal'],
  props:{
    toggleModal: Boolean
  },
  setup(props, {emit}){
    const closeModal = () => {
      emit('closeModal');
    }

    const token = ref('');

    return {
      token,
      closeModal,
    }
  }
}
</script>
