<template>
  <div>
    <DataTable
    :value="assets"
     :paginator="true"  :rows="10"
        dataKey="id" 
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll"
      >
      <Column field="assetId" :header="$t('general.assetId')"  style="`wideScreen?'min-width: 200px'?'width: 200px'  ` " >
        <template #body="{data}">
          <span class="uppercase font-semibold text-xs">{{data.namespaceNames[0]? data.namespaceNames[0] : data.idHex}}</span>
        </template>
      </Column>
      <Column field="amount" :header="$t('general.amount')"  style="`wideScreen?'min-width: 180px'?'width: 180px'`" >
        <template #body="{data}">
          <span class="uppercase font-semibold text-xs">{{ Helper.toCurrencyFormat(data.amount, data.divisibility)}}</span>
        </template>
      </Column>
      <template #empty>
        {{$t('general.noRecord')}}
      </template>
      <template #loading>
         {{$t('dashboard.fetchingTx')}}
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';
import {Helper} from '@/util/typeHelper';

defineProps({
  assets: Array
})
</script>

<style lang="scss" scoped>
.pop-option:after {
  content: '';
  display: block;
  position: absolute;
  top: -6px;
  right: 20px;
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-left:1px solid #E4E4E4;
  border-top:1px solid #E4E4E4;
  -moz-transform:rotate(45deg);
  -webkit-transform:rotate(45deg);
  z-index: 2;
}

::v-deep(.p-paginator) {
    .p-paginator-current {
        
        padding: 1rem;
        padding-right:0.5rem;
        font-size: 12px;
        
    }
    .p-paginator-bottom {
        display:flex;
        align-items: center;
        justify-content: space-between;
    }
    .p-dropdown{
        margin-top:0px;
    }
    .p-highlight{
      border-radius: 9999px;
    }
   
}
</style>