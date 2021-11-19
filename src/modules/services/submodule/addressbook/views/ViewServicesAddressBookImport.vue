<template>
  <div>
    <div class='w-9/12 ml-auto mr-auto mt-5'>
      <div class ='flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{ name: 'ViewServicesAddressBook' }" class= 'w-18 text-center border-b pb-3'>List</router-link>
        <div class='w-18 text-center border-b-2 pb-3 border-yellow-500'>Import</div>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }" class= 'w-18 text-center border-b pb-3'>Export</router-link>
      </div>
      <div class="mt-10">
        <div class="text-md my-5 font-semibold">Import Contacts</div>
        <div class="text-tsm">Add contacts from a contact backup file</div>
        <DisplayImportContactModal class="inline-block w-36 flex-none" />
      </div>
  </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
import { walletState } from '@/state/walletState';
import DisplayImportContactModal from '@/modules/services/submodule/addressbook/components/DisplayImportContactModal.vue';
import {useI18n} from 'vue-i18n';

export default {
  name: 'ViewServicesAddressBook',

  components: {
    DisplayImportContactModal,
  },

  setup() {
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const list = ref([]);

    const refreshList = () => {
      list.value = [];
      if(walletState.currentLoggedInWallet.contacts != undefined){
        if(walletState.currentLoggedInWallet.contacts.length > 0){
          walletState.currentLoggedInWallet.contacts.forEach((contact) => {
            list.value.push(contact);
          });
          list.value.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          });
        }
      }
    }
    refreshList();

    emitter.on('REFRESH_CONTACT_LIST', status => {
      if(status){
        // refresh list
        setTimeout(()=> {
          refreshList();
        }, 1000);
      }
    })

    return {      
      list,
    };
  },
}
</script>
