<template>
  <div>
    <div class='lg:w-9/12 ml-2 mr-2 w-full lg:ml-auto lg:mr-auto mt-5'>
      <div class ='flex text-xs font-semibold border-b-2 menu_title_div'>
        <div class='w-18 text-center border-b-2 pb-3 border-yellow-500'>List</div>
        <router-link :to="{ name: 'ViewServicesAddressBookImport' }" class= 'w-18 text-center border-b pb-3'>Import</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }" class= 'w-18 text-center border-b pb-3'>Export</router-link>
      </div>
      <ContactDataTable class="mt-10"></ContactDataTable>
    </div>
  </div>
</template>
<script>
import ContactDataTable from '@/modules/services/submodule/addressbook/components/ContactDataTable.vue';
import { getCurrentInstance, ref } from "vue";


export default {
  name: 'ViewServicesAddressBook',

  components: {
    ContactDataTable,
  },

  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    emitter.on('REFRESH_CONTACT_LIST', status => {
      if(status){
        // refresh list
        setTimeout(()=> {
          refreshList();
        }, 1000);
      }
    });

  },
}
</script>
