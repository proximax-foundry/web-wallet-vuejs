<template>
  <div>
    <div class="block hover:bg-gray-100 transition duration-200 p-2 z-20 cursor-pointer text-red-600" @click="openRemoveModal()">{{$t('general.remove')}}</div>
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-if="toggleModal" class="popup-outer fixed flex z-50">
        <div class="modal-popup-box">
          <div class="delete-position">
            <font-awesome-icon icon="times" class="delete-icon-style" @click="toggleModal = !toggleModal"></font-awesome-icon>
          </div>
          <div class="w-104 font-normal">
            <div class="error error_box" v-if="err!=''">{{ err }}</div>
            <div class="mb-5"><span class="text-sm text-gray-700">{{$t('addressBook.removeContactFromAB')}}</span></div>
            <div class="flex justify-between rounded-xl mb-4 text-gray-600">
              <div class="w-full text-left">
                <div class="text-xs mt-3">
                  <div class="inline-block w-20 font-bold">{{$t('general.name')}}:</div>
                  <div class="inline-block">{{ data.name }}</div>
                </div>
                <div class="text-xs mt-3">
                  <div class="inline-block w-20 font-bold">{{$t('general.address')}}:</div>
                  <div class="inline-block mt-2">{{ data.address }}</div>
                </div>
                <div class="text-xs mt-3">
                  <div class="inline-block w-20 font-bold">Group:</div>
                  <div class="inline-block">{{ data.group }}</div>
                </div>
              </div>
            </div>
            <fieldset class="w-full">
              <div class="text-center mt-5">
                <div class="inline-block font-bold text-blue-primary mr-5 cursor-pointer" @click="closeRemoveModal">{{$t('general.cancel')}}</div>
                <button type="submit" class="bg-red-primary text-white text-xs py-2 px-4 rounded-md" @click="deleteContact(data);">{{$t('addressBook.removeContact')}}</button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </transition>
    <div @click="closeRemoveModal" v-if="toggleModal" class="fixed inset-0 bg-opacity-60 bg-gray-100 z-20"></div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import { Wallet } from "@/models/wallet";
import { walletState } from '@/state/walletState';
import { WalletStateUtils } from '@/state/utils/walletStateUtils';

export default{
  name: 'ConfirmDeleteContactModal',
  props:['data'],

  setup(p){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const err = ref(false);
    const toggleModal = ref(false);
    const deleteContact = (contact) => {
      const contactIndex = walletState.currentLoggedInWallet.contacts.findIndex((contact) => contact.address == p.data.address);
      walletState.currentLoggedInWallet.removeAddressBook(contactIndex);
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
      toggleModal.value = !toggleModal.value;
      emitter.emit('REFRESH_CONTACT_LIST', true);
      emitter.emit('CLOSE_CONTACTMENU_PANEL');
    };

    const openRemoveModal = () => {
      toggleModal.value = !toggleModal.value;
    }

    const closeRemoveModal = () => {
      toggleModal.value = !toggleModal.value;
      setTimeout(() => {
        emitter.emit('CLOSE_CONTACTMENU_PANEL');
      }, 500);
    }

    return {
      err,
      deleteContact,
      toggleModal,
      openRemoveModal,
      closeRemoveModal,
      emitter
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
