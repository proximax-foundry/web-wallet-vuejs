<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center">
        <div class='font-semibold mr-10'>Address Book</div>
        <SelectInputAddressBookPlugin v-model="selectContactGroups" :options="contactGroups" selectDefault="" class="w-60 mr-4" />
        <div class="w-30 px-3 py-1" :class="borderColor">
          <input v-model="filters['global'].value" type="text" class="w-26 outline-none text-xs" :placeholder="$t('services.search')" @click="clickInputText()" @blur="blurInputText()">
          <img src="@/modules/services/submodule/addressbook/img/icon-search_black.svg" class="inline-block">
        </div>
      </div>
      <router-link :to="{ name: 'ViewServicesAddressBookAddContacts' }"  class="bg-blue-primary text-gray-50 text-tsm px-5 py-3 rounded-lg">+ Add New Address</router-link>
    </div>
    <div class='mt-2 py-3 gray-line'>
      <DataTable
        :value="contacts"
        ref="dt"
        v-model:filters="filters"
        :paginator="true"
        :rows="10"
        responsiveLayout="scroll"
        scrollDirection="horizontal"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate=""
        :globalFilterFields="['name','address']">
        <Column field="name" :header="$t('services.label')" headerStyle="width:30%">
          <template #body="{data}">
            {{data.name}}
          </template>
        </Column>
        <Column field="address" :header="$t('services.accountaddress')" headerStyle="width:55%">
          <template #body="{data}">
            {{ Helper.createAddress(data.address).pretty() }}
          </template>
        </Column>
        <Column :header="$t('services.action')" headerStyle="width:15%">
          <template #body="{data}">
            <EditContactModal :data="data" class="inline-block" :key="data.address" />
            <ConfirmDeleteContactModal :data="data" />
          </template>
        </Column>
        <template #empty>
          {{$t('services.norecord')}}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import SelectInputAddressBookPlugin from "@/modules/services/submodule/addressbook/components/SelectInputAddressBookPlugin.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import ConfirmDeleteContactModal from '@/modules/services/submodule/addressbook/components/ConfirmDeleteContactModal.vue';
import EditContactModal from '@/modules/services/submodule/addressbook/components/EditContactModal.vue';
import { Helper } from "@/util/typeHelper";

export default{
  components: {
    SelectInputAddressBookPlugin,
    DataTable,
    Column,
    ConfirmDeleteContactModal,
    EditContactModal,
  },
  name: 'ContactDataTable',
  props: {
    contacts: Array,
  },

  setup(){
    const selectContactGroups = ref('');
    const borderColor = ref('border border-gray-200');
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow-md';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-200';
    };

    
    const dt = ref();

    const contactGroups = computed(() => {
      let action = [];
      action.push(
        {value: '', label: 'Show All'},
        {value: '-n-', label: 'No Group'},
        {value: 'Work', label: 'Work'},
        {value: 'Friend', label: 'Friend'},
        {value: 'Family', label: 'Family'},
        {value: 'Employee', label: 'Employee'},
        {value: 'Director', label: 'Director'},
      );
      return action;
    });

    return {
      selectContactGroups,
      contactGroups,
      dt,
      borderColor,
      filters,
      clickInputText,
      blurInputText,
      Helper,
    }
  },
}
</script>

<style lang="scss" scoped>
.p-datatable-tbody{
  td > div{
    font-size: 13px;
  }

  tr:hover td{
    @apply bg-blue-100 ;cursor: auto;

    > div > svg{
      @apply text-gray-200;
    }

    > div > svg:hover{
      @apply text-white;
    }
  }
}

.export-icon:hover {
  @apply border-blue-primary bg-blue-primary;
  >div{
    @apply text-white;
  }
  svg{
    @apply text-white
  }
}
</style>