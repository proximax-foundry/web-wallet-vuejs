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
      <Column :style="{ width: '50px' }">
      </Column>
      <Column field="assetId" :header="$t('dashboard.assetid')" :style="{ width: '200px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="linkedNamespace" header="NAMESPACE" :style="{ width: '180px' }">
        <template #body="{data}">
          <diV v-for="namespace, item in data.linkedNamespace" :key="item">
            <div class="mb-1 text-txs">{{namespace.name}}</div>
          </div>
        </template>
      </Column>
      <Column field="supply" header="SUPPLY" :style="{ width: '180px' }">
        <template #body="{data}">
          <span class="uppercase text-txs">{{data.supply}}</span>
        </template>
      </Column>
      <Column field="amount" header="AMOUNT" :style="{ width: '180px' }">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{data.amount}}</span>
        </template>
      </Column>
      <Column field="creator" header="CREATOR" style="width: 180px;">
        <template #body="{data}">
          <span class="uppercase font-bold text-txs">{{ data.owner == currentPublicKey ? 'yes': 'no'}}</span>
        </template>
      </Column>
      <Column field="height" header="BLOCK HEIGHT" style="width: 180px;">
        <template #body="{data}">
          <span class="text-txs">{{data.height}}</span>
        </template>
      </Column>
      <Column style="width: 50px;">
        <template #body="">
          <div class="text-txs text-center lg:mr-2">
            <img src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block">
            <div  class="mt-1 pop-option absolute right-0 w-32 rounded-sm p-2 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40 text-left lg:mr-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div class="py-1" role="none">
                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange' }" class="block my-1">Asset Details</router-link>
                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange' }" class="block my-1">Modify Supply</router-link>
                <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace' }" class="block my-1">Linked to namespace</router-link>
              </div>
            </div>
          </div>
        </template>
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
}
</style>