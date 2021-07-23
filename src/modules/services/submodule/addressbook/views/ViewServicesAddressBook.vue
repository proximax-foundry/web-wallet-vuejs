<template>
  <div class="flex justify-between text-xs sm:text-sm">
    <div><span class="text-gray-400">Address Book ></span> <span class="text-blue-primary font-bold">List</span></div>
    <div>
      <router-link :to="{name: 'ViewServicesAddressBookAddContacts'}" class="font-bold" active-class="accounts">Add New Contact</router-link> |
      <router-link :to="{name: 'ViewServices'}" class="font-bold" active-class="accounts">All Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <ContactDataTable :contacts="list" class="mt-10"></ContactDataTable>
  </div>

</template>
<script>
import ContactDataTable from '@/modules/services/submodule/addressbook/components/ContactDataTable.vue'

import { getCurrentInstance, ref } from "vue";
import { walletState } from '@/state/walletState';

export default {
  name: 'ViewServicesAddressBook',

  components: {
    ContactDataTable,
  },

  setup() {
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
