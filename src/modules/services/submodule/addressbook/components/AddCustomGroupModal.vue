<template>
  
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer-lang fixed flex z-50">
        <div class="modal-popup-box text-center">
          <div class= 'ml-auto mr-auto mt-2 text-xs  font-semibold' style='width:62%'>{{$t('addressBook.addCustomGroup')}}</div>
          <div class="error error_box mb-3" v-if="err!=''">{{ err }}</div>
          <input type="text" v-model="customGroup" :placeholder="$t('addressBook.customGroup')" class="border border-gray-300 p-3 my-5 text-tsm text-center focus:outline-none" />
          <button class='rounded-md cursor-pointer text-xs text-white py-2 text-center ml-auto mr-auto btn-default bg-blue-primary w-14 mb-2 disabled:opacity-50' @click="addCustomGroup" :disabled="disableAdd">{{$t('general.add')}}</button>
          <div class='text-center cursor-pointer font-semibold text-xs text-gray-500 mt-2' @click="closePanel">{{$t('general.cancel')}}</div>
        </div>
      </div>
    </transition>
    <div class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20" v-if="toggleModal" @click="closePanel"></div>
</template>
<script>
import { computed, getCurrentInstance, toRefs } from "vue";
import { walletState } from '@/state/walletState';

import { ref } from "vue";
import { useI18n } from 'vue-i18n';
export default {
  name: 'DeleteAccountModal',
  props: {
    toggleModal: Boolean,
    groups: Object
  },

  setup(props){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const {t} = useI18n();
    const err = ref('');

    const customGroupPattern = "^[0-9A-Za-z]{1,}$";
    const disableAdd = computed(() => !(customGroup.value.match(customGroupPattern)) );

    let customGroup = ref('');

    const closePanel = () => {
      emitter.emit('CLOSE_ADDCUSTOMGROUP_PANEL');
    }

    // generate group labels
    const groupList = ref([]);
    if(walletState.currentLoggedInWallet){
      if(walletState.currentLoggedInWallet.contacts != undefined){
      if(walletState.currentLoggedInWallet.contacts.length > 0){
        walletState.currentLoggedInWallet.contacts.forEach((contact) => {
          if(contact.group != undefined){
            groupList.value.push(contact.group.toLowerCase());
          }
        });
      }
    }
    }
    

    const {groups} = toRefs(props);
    const addCustomGroup = () => {
      // check existing group
      if(groups.value.find( (({value}) => value.toLowerCase() === customGroup.value.toLowerCase())) || groupList.value.includes(customGroup.value.toLowerCase())){
        err.value = t('addressBook.groupValidation');
      }else{
        emitter.emit('ADD_CUSTOM_GROUP', customGroup.value);
        customGroup.value = '';
      }
    }

    return{
      err,
      customGroup,
      closePanel,
      addCustomGroup,
      disableAdd,
    }
  }
}
</script>
