<template>
  <div>
    <div class="flex">
      <div class="flex-grow transition ease-in duration-300 w-full rounded-full px-5 py-1 mb-5" :class="borderColor">
        <input v-model="filters['global'].value" type="text" class="w-full outline-none text-sm" :placeholder="$t('common.search')" @click="clickInputText()" @blur="blurInputText()">
      </div>
      <a @click="exportCSV($event)" class="export-icon border-gray-300 border rounded-lg bg-gray-100 w-18 h-9 ml-3 relative flex-none">
        <div class="absolute inline-block text-tsm text-gray-500" style="right: 10px; top: 6px;">{{$t('common.export')}}</div>
        <font-awesome-icon icon="file-export" class="w-5 h-5 text-gray-400 cursor-pointer inline-block absolute" style="top: 5px; left: 8px;" title="Download CSV file"></font-awesome-icon>
      </a>
      <DisplayImportContactModal class="inline-block w-24 ml-1 flex-none" />
    </div>
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
      <Column field="name" :header="$t('common.label')" headerStyle="width:30%">
        <template #body="{data}">
          {{data.name}}
        </template>
      </Column>
      <Column field="address" :header="$t('addressBook.accountAddress')" headerStyle="width:55%">
        <template #body="{data}">
          {{ Helper.createAddress(data.address).pretty() }}
        </template>
      </Column>
      <Column :header="$t('common.action')" headerStyle="width:15%">
        <template #body="{data}">
          <EditContactModal :data="data" class="inline-block" :key="data.address" />
          <ConfirmDeleteContactModal :data="data" />
        </template>
      </Column>
      <template #empty>
        {{$t('common.noRecord')}}
      </template>
    </DataTable>
  </div>
</template>

<script>
import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import ConfirmDeleteContactModal from '@/modules/services/submodule/addressbook/components/ConfirmDeleteContactModal.vue';
import EditContactModal from '@/modules/services/submodule/addressbook/components/EditContactModal.vue';
import { Helper } from "@/util/typeHelper";
import DisplayImportContactModal from '@/modules/services/submodule/addressbook/components/DisplayImportContactModal.vue'

export default{
  components: {
    DataTable,
    Column,
    ConfirmDeleteContactModal,
    EditContactModal,
    DisplayImportContactModal,
  },
  name: 'ContactDataTable',
  props: {
    contacts: Array,
  },

  setup(){
    const borderColor = ref('border border-gray-400');
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const exportCSV = () => {
      dt.value.exportCSV();
    };

    const dt = ref();

    return {
      dt,
      borderColor,
      filters,
      clickInputText,
      blurInputText,
      exportCSV,
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