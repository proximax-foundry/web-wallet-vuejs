<template>
  <div>
    <div class='w-9/12 ml-auto mr-auto mt-5'>
      <div class='flex text-xs font-semibold border-b-2 menu_title_div'>
        <div class='w-18 text-center border-b-2 pb-3 border-yellow-500'>{{ $t('general.list') }}</div>
        <router-link :to="{ name: 'ViewServicesAddressBookImport' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.import') }}</router-link>
        <router-link :to="{ name: 'ViewServicesAddressBookExport' }"
          class='w-18 text-center border-b pb-3'>{{ $t('general.export') }}</router-link>
      </div>
      <ContactDataTable class="mt-10"></ContactDataTable>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ContactDataTable from '@/modules/services/submodule/addressbook/components/ContactDataTable.vue';
import { getCurrentInstance, ref } from "vue";
import { walletState } from '@/state/walletState';



const internalInstance = getCurrentInstance();
const emitter = internalInstance?.appContext.config.globalProperties.emitter;
const list = ref<{name:string,address:string,group:string,publicKey:string | null}[]>([]);

const refreshList = () => {
  if (!walletState.currentLoggedInWallet) {
    return
  }
  list.value = [];
  if (walletState.currentLoggedInWallet.contacts != undefined) {
    if (walletState.currentLoggedInWallet.contacts.length > 0) {
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

emitter.on('REFRESH_CONTACT_LIST', (status :boolean) => {
  if (status) {
    // refresh list
    setTimeout(() => {
      refreshList();
    }, 1000);
  }
});


</script>
