<template>
  <div>
    <font-awesome-icon icon="id-card-alt" class="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-pointer ml-3 mt-3" @click="toggleModal = !toggleModal"></font-awesome-icon>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer absolute flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <h1 class="default-title font-bold my-0">Contacts</h1>
          <SelectInputPlugin placeholder="Contact" errorMessage="" v-model="selectContact" :options="contact" @default-selected="selectContact=0" @show-selection="selectCosign" />
        </div>
      </div>
    </transition>
    <div @click="toggleModal = !toggleModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-50 bg-blue-primary z-30"></div>
  </div>
</template>

<script>
import { computed, ref, getCurrentInstance } from 'vue'; 
import SelectInputPlugin from '@/components/SelectInputPlugin.vue';
import { multiSign } from '@/util/multiSignatory';

export default{
  name: 'AddCoSignModal',

  props: {
    cosignPublicKeyIndex: Number,
    selectedAddress: Array,
  },

  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    // const appStore = inject("appStore");
    const toggleModal = ref(false);
    const selectContact = ref("0");

    const contact = computed(() => {
      return multiSign.generateContact(p.selectedAddress);
    });

    const selectCosign = (address) =>{
      toggleModal.value = !toggleModal.value;
      emitter.emit('ADD_CONTACT_COSIGN', {
        address: address,
        index: p.cosignPublicKeyIndex
      });
      selectContact.value = '';
    }

    return{
      contact,
      toggleModal,
      selectContact,
      selectCosign,
    };
  },

  components: {
    SelectInputPlugin,
  }
}
</script>
