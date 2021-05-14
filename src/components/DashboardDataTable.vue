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
      :globalFilterFields="['typeName','transferType','senderAddress', 'senderName','recipientAddress', 'recipientName', 'block']">
      <Column field="typeName" header="Type" headerStyle="width:110px">
        <template #body="{data}">
          {{data.typeName}}
        </template>
      </Column>
      <Column field="transferType" header="In/Out" headerStyle="width:10px">
        <template #body="{data}">
          <img src="../assets/img/arrow-transaction-receive-in-green-proximax-sirius-explorer.svg" class="w-5 h-5 inline-block" v-if="data.transferType=='in'">
          <img src="../assets/img/arrow-transaction-sender-out-orange-proximax-sirius-explorer.svg" class="w-5 h-5 inline-block" v-else>
        </template>
      </Column>
      <Column field="senderName" header="Sender" headerStyle="width:300px">
        <template #body="{data}">
          <span :title="data.senderAddress" v-if="data.senderName">{{data.senderName}}</span>
          <span v-else>{{data.senderAddress}}</span>
        </template>
      </Column>
      <Column field="recipient" header="Recipient" headerStyle="width:300px">
        <template #body="{data}">
          <span :title="data.recipientAddress" v-if="data.recipientName">{{data.recipientName}}</span>
          <span v-else>{{data.recipientAddress}}</span>
        </template>
      </Column>
      <Column field="block" header="Block" headerStyle="width:100px"></Column>
      <template #empty>
        No records found
      </template>
    </DataTable>
    <DynamicModelComponent :modelName="dynamicModelComponentDisplay" :showModal="showTransactionModel" :transaction="modalData" />
  </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import DynamicModelComponent from '@/components/DynamicModelComponent.vue'


export default{
  components: { DataTable, Column, DynamicModelComponent }, //DynamicModelComponent
  name: 'DashboardDataTable',
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

    const dynamicModelComponentDisplay = ref('TransferTransactionModal');

    const clickInputText = () => {
      borderColor.value = 'border border-white-100 drop-shadow';
    };

    const blurInputText = () => {
      borderColor.value = 'border border-gray-400';
    };

    const rowClick = (e) => {
      // console.log(e.data.typeName);
      console.log(e.data);
      switch(e.data.typeName){
        case 'Transfer':
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
          break;
        case 'LockFund':
          dynamicModelComponentDisplay.value = 'LockFundModal';
          break;
        case 'Aggregate Bonded':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        case 'Aggregate Complete':
          dynamicModelComponentDisplay.value = 'AggregateBondedModal';
          break;
        default:
          dynamicModelComponentDisplay.value = 'TransferTransactionModal';
      }
      showTransactionModel.value = true;
      // modalData.value = Object.assign({}, e.data);
      modalData.value = e.data;
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
      dynamicModelComponentDisplay,
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