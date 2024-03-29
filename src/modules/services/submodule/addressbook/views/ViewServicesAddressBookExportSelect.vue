<template>
    <div>
      <div class='w-9/12 ml-auto mr-auto mt-5'>
        <div class='flex text-xs font-semibold border-b-2 menu_title_div'>
          <router-link :to="{ name: 'ViewServicesAddressBook' }"
            class='w-18 text-center border-b pb-3'>{{ $t('general.list') }}</router-link>
          <router-link :to="{ name: 'ViewServicesAddressBookImport' }"
            class='w-18 text-center border-b pb-3'>{{ $t('general.import') }}</router-link>
          <div class='w-18 text-center border-b-2 pb-3 border-yellow-500'>{{ $t('general.export') }}</div>
        </div>
        <div class="mt-10">
          <div class="text-md my-5 font-semibold">{{ $t('addressBook.exportContacts') }}</div>
          <div class="flex cursor-pointer">
            <router-link :to="{ name: 'ViewServicesAddressBookExport' }"
                class="border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold "> {{ $t('general.group') }}
            </router-link>
            <div class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold ">
                {{ $t('general.name') }}
            </div>
          </div>
        </div>
        <div>
          <div class="text-tsm">{{ $t('addressBook.selectExportContacts') }}</div>
          <div class="mt-4">
            <MultiSelect v-model="nameFilters" :options="list" optionLabel="name" placeholder="Contacts" class="w-60  mr-2" />
          </div>
        </div>
        <div @click="exportCSV($event)"
          class="cursor-pointer mt-5 py-2 px-5 rounded-md w-36 bg-blue-primary text-white text-tsm drop-shadow-lg filter hover:bg-blue-600 transition-all duration-500">
          <img src="@/modules/services/submodule/addressbook/img/icon-upload.svg"
            class="inline-block mr-4 relative top-1">{{ $t('general.export') }}</div>
        <DataTable class="hidden" :value="nameFilters" ref="dt" :paginator="true" :rows="10"
          responsiveLayout="scroll" scrollDirection="horizontal"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="">
          <Column field="name" :header="$t('general.label')" headerStyle="width:30%">
            <template #body="{ data }">
              {{ data.name }}
            </template>
          </Column>
          <Column field="address" :header="$t('general.address')" headerStyle="width:55%">
            <template #body="{ data }">
              {{ Helper.createAddress(data.address).pretty() }}
            </template>
          </Column>
          <Column field="group" :header="$t('general.group')" headerStyle="width:30%">
            <template #body="{ data }">
              {{ data.group }}
            </template>
          </Column>
          <Column field="publicKey" :header="$t('general.publicKey')" headerStyle="width:55%">
            <template #body="{ data }">
              {{ data.publicKey }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    </template>
    <script lang="ts" setup>
    import { getCurrentInstance, ref} from "vue";
    import { walletState } from '@/state/walletState';
    import { Helper } from "@/util/typeHelper";
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import { useI18n } from 'vue-i18n';
    import MultiSelect from 'primevue/multiselect';
    
    const {t} = useI18n();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance?.appContext.config.globalProperties.emitter;
    const list = ref<{name: string;address: string;group: string;publicKey: string | null}[]>([]);
    const nameFilters = ref();
    const contactGroupsList = ref<string[]>([]);
    
    const refreshList = () => {
    if (!walletState.currentLoggedInWallet) {
      return
    }
    list.value  = [];
    if (walletState.currentLoggedInWallet.contacts != undefined) {
      if (walletState.currentLoggedInWallet.contacts.length > 0) {
        walletState.currentLoggedInWallet.contacts.forEach((contact) => {
          list.value.push(contact);
          contactGroupsList.value.push(contact.group);
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
    
    emitter.on('REFRESH_CONTACT_LIST', (status :boolean)=> {
    if (status) {
      // refresh list
      setTimeout(() => {
        refreshList();
      }, 1000);
    }
    });
    
    const dt = ref();
    
    const exportCSV = (e :any) => {
    dt.value.exportCSV(e);
    };
    
    </script>
