<template>
  <div>
    <div class="transition ease-in duration-300 w-full rounded-full px-5 py-1 mb-5" :class="borderColor">
      <input v-model="filters['global'].value" type="text" class="w-full outline-none text-sm" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
    </div>
    <DataTable
      :value="transactions"
      v-model:filters="filters"
      @row-click="rowClick"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      :globalFilterFields="['isSigned', 'formattedDeadline', 'linkedAccount', 'linkedAccountName', 'hash']">
      <Column field="isSigned" header="Sign/add" headerStyle="width:30px">
        <template #body="{data}">
          <font-awesome-icon icon="circle" :class="data.isSigned?'text-green-800':'text-red-600'" class="h-2 w-2 inline-block"></font-awesome-icon> - ({{ data.totalSigned }})
        </template>
      </Column>
      <Column field="formattedDeadline" header="Deadline" headerStyle="width:200px">
        <template #body="{data}">
          {{data.formattedDeadline + ' - UTC'}}
        </template>
      </Column>
      <Column field="linkedAccount" header="Account linked to the transaction" headerStyle="width:400px">
        <template #body="{data}">
          <span :title="data.linkedAccount" v-if="data.linkedAccountName">{{data.linkedAccountName}}</span>
          <span v-else>{{data.linkedAccount}}</span>
        </template>
      </Column>
      <Column field="hash" header="Hash" headerStyle="width:150px"></Column>
      <template #empty>
        No records found
      </template>
    </DataTable>
    <PartialTransactionModal :showModal="showTransactionModel" :transaction="modalData" />
  </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import PartialTransactionModal from '@/modules/dashboard/components/DashboardModels/PartialTransactionModal.vue'

export default{
  components: {
    DataTable,
    Column,
    PartialTransactionModal,
  },
  name: 'PartialDashboardDataTable',
  props: {
    transactions: Array,
  },

  setup(){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');
    const showTransactionModel = ref(false);
    const modalData = ref(null);
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const rowClick = (e) => {
      modalData.value = Object.assign({}, e.data);
      showTransactionModel.value = true;
      // console.log(e.data);
    };

    emitter.on("CLOSE_MODAL", payload => {
      showTransactionModel.value = payload;
    });

    return {
      borderColor,
      filters,
      clickInputText,
      blurInputText,
      modalData,
      rowClick,
      showTransactionModel,
    }
  },
}
</script>

<style lang="scss">
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}
</style>