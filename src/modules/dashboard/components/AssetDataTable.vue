<template>
  <div>
    <DataTable
      :value="assets"
      :paginator="false"
      :rows="5"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      tableStyle=""
      >
      <Column :style="{ width: '100px' }">
      </Column>
      <Column field="assetId" :header="$t('dashboard.assetid')" :style="{ width: '250px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="linkedNamespace" header="NAMESPACE" :style="{ width: '200px' }">
        <template #body="{data}">
          <diV v-for="namespace, item in data.linkedNamespace" :key="item">
            <div class="mb-1 text-txs">{{namespace.name}}</div>
          </div>
        </template>
      </Column>
      <Column field="supply" header="SUPPLY" :style="{ width: '200px' }">
        <template #body="{data}">
          <span class="uppercase text-txs">{{data.supply}}</span>
        </template>
      </Column>
      <Column field="amount" header="AMOUNT" :style="{ width: '200px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.amount}}</span>
        </template>
      </Column>
      <Column field="creator" header="CREATOR" :style="{ width: '200px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{ data.owner == currentPublicKey ? 'yes': 'no'}}</span>
        </template>
      </Column>
      <Column field="block" header="BLOCK HEIGHT" >
      </Column>
      <template #empty>
        {{$t('services.norecord')}}
      </template>
      <template #loading>
         {{$t('dashboard.loadingmessage')}}
      </template>
    </DataTable>
  </div>
</template>

<script>
import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default{
  components: { DataTable, Column },
  name: 'AssetDataTable',
  props: {
    assets: Array,
    currentPublicKey: String
  },

  setup(p, context){
    const borderColor = ref('border border-gray-400');
    console.log(p.currentPublicKey);

    return {
      borderColor
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