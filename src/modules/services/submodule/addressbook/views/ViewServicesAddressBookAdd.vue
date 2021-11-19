<template>
  <div>
    <div class='w-9/12 ml-auto mr-auto mt-5'>
      <div class ='flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{ name: 'ViewServicesAddressBook' }" class= 'w-18 text-center border-b pb-3'>List</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookImport' }" class= 'w-18 text-center border-b pb-3'>Import</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }" class= 'w-18 text-center border-b pb-3'>Export</router-link>
      </div>
      <div class="border border-gray-400 p-5 filter drop-shadow-xl">
        <div class="text-md my-5 font-semibold">Add New Contact</div>
      </div>
      <input v-model="filters['global'].value" type="text" class="hidden">
        
      
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue";
import { walletState } from '@/state/walletState';
import { Helper } from "@/util/typeHelper";
import {FilterMatchMode} from 'primevue/api';
import {useI18n} from 'vue-i18n'

export default {
  name: 'ViewServicesAddressBookAdd',

  components: {

  },

  setup() {
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const list = ref([]);

    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

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
    });

    const dt = ref();

    const exportCSV = () => {
      dt.value.exportCSV();
    };


    return {
      dt,
      exportCSV,
      list,
      filters,
      Helper,
    };
  },
}
</script>
