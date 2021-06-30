<template>
  <div>
    <div class="transition ease-in duration-300 w-full rounded-full px-5 py-1 mb-5" :class="borderColor">
      <input v-model="filterText" type="text" class="w-full outline-none text-sm" placeholder="Search" @click="clickInputText()" @blur="blurInputText()">
    </div>
    <DataTable
      :value="transactions"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column field="typeName" header="Type" headerStyle="width:110px">
        <template #body="{data}">
          {{data.typeName}}
        </template>
      </Column>
      <Column header="Details" >
        <template #body="{data}">
            <div v-for="innerTx in data.innerTransactions" :key="innerTx">
              <div> {{ innerTx.typeName }}</div>
              <div v-if="innerTx.displayList.size > 0"> {{ innerTx.displayList }}</div>
              <div v-if="innerTx.transferList.length > 0"> {{ innerTx.transferList }}</div>
            </div>
            <div v-if="data.displayList.size > 0"> {{ data.displayList }}</div>
            <div v-if="data.transferList.length > 0"> {{ data.transferList }}</div>
        </template>
      </Column>
      <Column v-if="showBlock" field="block" header="Block" :sortable="true" >
        <template #body="{data}">
          <div>{{ data.block }}</div>
          <div v-if="data.timestamp">{{ data.timestamp }}</div>
          <div v-if="data.fee">Fee: {{ data.fee}}</div>
        </template>
      </Column>
      <Column v-if="showAction" header="Action" >

      </Column>
      <template #empty>
        No records found
      </template>
      <template #loading>
          Loading transactions data. Please wait.
      </template>
    </DataTable>
    <DynamicModelComponent :modelName="dynamicModelComponentDisplay" :showModal="showTransactionModel" :transaction="modalData" />
  </div>
</template>

<script>
import { getCurrentInstance, ref, computed, watch  } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {FilterMatchMode} from 'primevue/api';
import DynamicModelComponent from '@/modules/dashboard/components/DynamicModelComponent.vue'
import { networkState } from "@/state/networkState";

export default{
  components: { DataTable, Column, DynamicModelComponent }, //DynamicModelComponent
  name: 'DashboardDataTable',
  props: {
    transactions: Array,
    showBlock: Boolean
  },

  setup(p, context){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');
    const showTransactionModel = ref(false);
    const modalData = ref(null);
    const filterText = ref("");
    /*
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    */
    watch(
     ()=> filterText.value, (newValue)=>{
       context.emit('confirmedFilter', newValue);
    });

    const explorerBaseURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.url);
    const blockExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.blockRoute);
    const publicKeyExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.publicKeyRoute);
    const addressExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.addressRoute);
    const hashExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.hashRoute);
    const namespaceExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute);
    const assetExplorerURL = computed(()=> networkState.currentNetworkProfile.chainExplorer.assetInfoRoute);

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
      filterText,
      clickInputText,
      blurInputText,
      modalData,
      rowClick,
      showTransactionModel,
      dynamicModelComponentDisplay,
      blockExplorerURL,
      addressExplorerURL,
      assetExplorerURL,
      namespaceExplorerURL,
      hashExplorerURL,
      publicKeyExplorerURL,
      explorerBaseURL
    }
  }
}
</script>

<style lang="scss" scoped>
.p-datatable-tbody{
  td{
    font-size: 11px;
  }
}
</style>