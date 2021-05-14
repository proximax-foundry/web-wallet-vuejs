<template>
  <div>
    <a href="#" class="action-icon border rounded-xl mr-5 relative bg-gray-100 border-gray-400 w-10 h-8 inline-block shadow-md" @click="openModal()">
      <font-awesome-icon icon="edit" class="w-5 h-5 text-gray-400 text-sm cursor-pointer inline-block absolute" title="Edit this contact" style="top: 5px; left: 11px;"></font-awesome-icon>
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
          <div class="w-104">
            <form @submit.prevent="create" class="mt-10 text-gray-800">
              <fieldset class="w-full">
                <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
                <div class="mb-5 text-center"><span class="text-lg text-gray-700">Edit this contact</span></div>
                <TextInput placeholder="Name" errorMessage="Name required" v-model="contactName" icon="id-card-alt" :showError="showNameErr" />
                <TextInput placeholder="Address" :errorMessage="addErr" v-model="address" icon="wallet" :showError="showAddErr" />
                <div class="mt-10 text-center">
                  <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">Cancel</button>
                  <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSave" @click="EditContact()">Save</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-90 bg-blue-primary z-20"></div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, inject, ref, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import { verifyAddress } from '../util/functions.js';

export default{
  name: 'EditContactModal',
  props:['data'],

  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const contactName = ref(p.data.name);
    const address = ref(appStore.pretty(p.data.address));
    const err = ref('');
    const addMsg = ref('');
    const toggleModal = ref(false);
    const verifyAdd = ref(true);

    const disableSave = computed(
      () => !(
        verifyAdd.value && contactName.value != ''
      )
    );

    const showAddErr = computed(
      () => !verifyAdd.value && address.value != ''
    );

    const showNameErr = computed(
      () => address.value != '' && contactName.value == ''
    );

    const addErr = computed(
      () => {
        let addErrDefault = 'Address required';
        return addMsg.value?addMsg.value:addErrDefault;
      }
    );

    watch(address, ()=>{
      const verifyContactAddress = verifyAddress(appStore.getCurrentAdd(appStore.state.currentLoggedInWallet.name), address.value);
      verifyAdd.value = verifyContactAddress.isPassed.value;
      addMsg.value = verifyContactAddress.errMessage.value;
    });

    const openModal = () => {
      contactName.value = p.data.name;
      address.value = appStore.pretty(p.data.address);
      toggleModal.value = !toggleModal.value;
    }

    const EditContact = () => {
      let status = appStore.editContact(p.data, contactName.value, address.value);
      if(status===true){
        toggleModal.value = !toggleModal.value;
        emitter.emit('REFRESH_CONTACT_LIST', true);
      }else if(status === -1){
        err.value = 'Edit operation failed';
      }else{
        err.value = status;
      }
    }

    return{
      err,
      addErr,
      toggleModal,
      contactName,
      address,
      disableSave,
      showAddErr,
      showNameErr,
      EditContact,
      openModal,
    };
  },

  components: {
    TextInput
  }
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
