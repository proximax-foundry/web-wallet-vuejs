<template>
  <div class="inline-block">
    <a href="#" class="action-icon border rounded-xl relative bg-gray-100 border-gray-400 w-10 h-8 inline-block shadow-md" @click="toggleModal = !toggleModal">
      <font-awesome-icon icon="trash-alt" class="w-5 h-5 text-gray-400 text-sm cursor-pointer inline-block absolute" title="Remove this contact" style="top: 5px; left: 11px;"></font-awesome-icon>
    </a>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104 font-normal">
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div class="mt-10 mb-5"><span class="text-lg text-gray-700">Remove this contact from Address Book?</span></div>
            <div class="flex justify-between p-4 rounded-xl bg-yellow-100 mb-4 text-gray-900">
              <div class="w-full text-left">
                <div class="text-sm mt-3">
                  <div class="inline-block w-20 font-bold">Name:</div>
                  <div class="inline-block">{{ data.name }}</div>
                </div>
                <div class="text-sm mt-3">
                  <div class="inline-block w-20 font-bold">Address:</div>
                  <div class="inline-block">{{ data.address }}</div>
                </div>
              </div>
            </div>
            <fieldset class="w-full">
              <div class="text-center mt-5">
                <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">Cancel</button>
                <button type="submit" class="default-btn py-1" @click="deleteContact(data);">Remove contact</button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary z-20"></div>
  </div>
</template>

<script>
import { inject, getCurrentInstance, ref } from 'vue';

export default{
  name: 'ConfirmDeleteContactModal',
  props:['data'],

  setup(){
    const appStore = inject("appStore");
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const err = ref(false);
    const toggleModal = ref(false);
    const deleteContact = (contact) => {
      var deleteStatus = appStore.deleteContact(contact);
      if(deleteStatus){
        toggleModal.value = !toggleModal.value;
        emitter.emit('REFRESH_CONTACT_LIST', true);
      }
    };
    return {
      err,
      deleteContact,
      toggleModal,
    };
  },
}
</script>
<style lang="scss" scoped>
.action-icon:hover{
  @apply border-blue-primary bg-blue-primary;
  svg{
    @apply text-white
  }
}
</style>
