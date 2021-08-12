<template>
  <div>
    <a class="action-icon border rounded-xl mr-5 relative bg-gray-100 border-gray-400 w-10 h-8 inline-block shadow-md" @click="openModal()">
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
            <form @submit.prevent="EditContact" class="mt-10 text-gray-800">
              <fieldset class="w-full">
                <div class="error error_box mb-5" v-if="err!=''">{{ err }}</div>
                <div class="mb-5 text-center"><span class="text-lg text-gray-700">{{$t('addressBook.editContact')}}</span></div>
                <TextInput :placeholder="$t('common.name')" :errorMessage="$t('addressBook.nameRequired')" v-model="contactName" icon="id-card-alt" :showError="showNameErr" />
                <TextInput :placeholder="$t('common.address')" :errorMessage="addErr" v-model="address" icon="wallet" :showError="showAddErr" />
                <div class="mt-10 text-center">
                  <button type="button" class="default-btn mr-5 focus:outline-none" @click="toggleModal = !toggleModal">{{$t('common.cancel')}}</button>
                  <button type="submit" class="default-btn py-1 disabled:opacity-50" :disabled="disableSave" @click="EditContact()">{{$t('common.save')}}</button>
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
import { computed, getCurrentInstance, ref, watch } from 'vue';
import TextInput from '@/components/TextInput.vue';
import { useToast } from "primevue/usetoast";
import { Helper } from "@/util/typeHelper";
import { AddressBookUtils } from '@/util/addressBookUtils';
import { walletState } from '@/state/walletState';
import {useI18n} from 'vue-i18n'
export default{
  name: 'EditContactModal',
  props:['data'],

  setup(p){
    const {t} = useI18n();
    const toast = useToast();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const contactName = ref(p.data.name);
    const address = ref(p.data.address);
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
        let addErrDefault = t('addressBook.addressRequired');
        return addMsg.value?addMsg.value:addErrDefault;
      }
    );

    watch(address, ()=>{
      if(!walletState.currentLoggedInWallet){
        return;
      }
      const defaultAccount = walletState.currentLoggedInWallet.accounts.find((account) => account.default == true);
      const verifyContactAddress = AddressBookUtils.verifyNetworkAddress(defaultAccount.address, address.value);
      verifyAdd.value = verifyContactAddress.isPassed;
      addMsg.value = verifyContactAddress.errMessage;
    });

    const openModal = () => {
      contactName.value = p.data.name;
      address.value = Helper.createAddress(p.data.address).pretty();
      toggleModal.value = !toggleModal.value;
    }

    const EditContact = () => {
      // @param index, AddressBook
      if(!walletState.currentLoggedInWallet){
        return;
      }
      const contactIndex = walletState.currentLoggedInWallet.contacts.findIndex((contact) => contact.address == p.data.address);
      walletState.currentLoggedInWallet.updateAddressBook(contactIndex, { name: contactName.value, address: address.value });
      walletState.wallets.saveMyWalletOnlytoLocalStorage(walletState.currentLoggedInWallet);
      toggleModal.value = !toggleModal.value;
      emitter.emit('REFRESH_CONTACT_LIST', true);
      toast.add({severity:'info', summary: t('services.addressBook'), detail: t('addressBook.contactUpdated'), group: 'br', life: 5000});
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