<template>
  <div class="flex justify-between text-sm">
    <div><span class="text-gray-400">Address Book ></span> <span class="text-blue-primary font-bold">List</span></div>
    <div>
      <router-link :to="{name: 'ViewAddressBookAddContacts'}" class="font-bold" active-class="accounts">Add New Contact</router-link> |
      <router-link :to="{name: 'ViewServices'}" class="font-bold" active-class="accounts">Services</router-link>
    </div>
  </div>
  <div class='mt-2 py-3 gray-line'>
    <ContactDataTable :contacts="list" class="mt-10"></ContactDataTable>
  </div>

</template>
<script>
import ContactDataTable from '@/modules/addressbook/components/ContactDataTable.vue'
import { inject, getCurrentInstance, ref } from "vue";

export default {
  name: 'ViewAddressBook',

  components: {
    ContactDataTable,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const appStore = inject("appStore");
    const wallet = appStore.getWalletByName(appStore.state.currentLoggedInWallet.name);
    const list = ref([]);

    const refreshList = () => {
      list.value = [];
      if(wallet.contacts != undefined){
        if(wallet.contacts.length > 0){
          wallet.contacts.forEach((contact) => {
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
      appStore,
      wallet,
      list,
    };
  },
}
</script>
