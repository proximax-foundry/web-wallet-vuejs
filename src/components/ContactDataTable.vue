<template>
  <div>
    <div class="flex">
      <div class="flex-grow transition ease-in duration-300 w-full rounded-full px-5 py-1 mb-5" :class="borderColor">
        <input v-model="filters['global'].value" type="text" class="w-full outline-none text-sm" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
      </div>
      <a href="#" @click="exportCSV($event)" class="export-icon border-gray-300 border rounded-lg bg-gray-100 w-9 h-9 ml-3 relative">
        <font-awesome-icon icon="download" class="w-5 h-5 text-gray-400 cursor-pointer inline-block absolute" style="top: 5px; left: 8px;" title="Download CSV file"></font-awesome-icon>
      </a>
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
      <Column field="name" header="Label" headerStyle="width:40%">
        <template #body="{data}">
          {{data.name}}
        </template>
      </Column>
      <Column field="address" header="Account Address" headerStyle="width:50%">
        <template #body="{data}">
          {{appStore.pretty(data.address)}}
        </template>
      </Column>
      <Column header="Action" headerStyle="width:10%">
        <template #body="{data}">
          <EditContactModal :data="data" class="inline-block" :key="data.address" />
          <ConfirmDeleteContactModal :data="data" />
        </template>
      </Column>
      <template #empty>
        No records found
      </template>
    </DataTable>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import ConfirmDeleteContactModal from '@/components/ConfirmDeleteContactModal.vue';
import EditContactModal from '@/components/EditContactModal.vue';

export default{
  components: { DataTable, Column, ConfirmDeleteContactModal, EditContactModal },
  name: 'ContactDataTable',
  props: {
    contacts: Array,
  },

  setup(){
    const appStore = inject("appStore");
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
      appStore,
      borderColor,
      filters,
      clickInputText,
      blurInputText,
      exportCSV,
    }
  },
}
</script>

<style lang="scss">
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
  svg{
    @apply text-white
  }
}
</style>