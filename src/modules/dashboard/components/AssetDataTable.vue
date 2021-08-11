<template>
  <div>
    <DataTable
      :value="assets"
      :paginator="true"
      :rows="5"
      responsiveLayout="scroll"
      scrollDirection="horizontal"
      :alwaysShowPaginator="false"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate=""
      >
      <Column field="owner" :header="$t('dashboard.owner')" >
        <template #body="{data}">
          <span class="uppercase">{{data.owner}}</span>
        </template>
      </Column>
      <Column field="assetId" :header="$t('dashboard.assetid')" >
        <template #body="{data}">
          <span class="uppercase">{{data.idHex}}</span>
        </template>
      </Column>
      <Column field="alias" :header="$t('dashboard.alias')" >
        <template #body="{data}">
          <diV v-for="value in data.alias" :key="value.idHex">
            <div>{{value.name}} - <span class="uppercase"> {{ value.idHex }} </span></div>
          </div>
        </template>
      </Column>
      <Column field="quantity" :header="$t('dashboard.quantity')" >
        <template #body="{data}">
          <span class="uppercase ">{{data.amount}}</span>
        </template>
      </Column>
      <Column field="Active" :header="$t('dashboard.active')" >
        <template #body="{data}">
          <span class="uppercase" :class="data.active ? 'text-green-500' : 'text-red-500'">{{ data.active ? 'true': 'false'}}</span>
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
import { getCurrentInstance, ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default{
  components: { DataTable, Column },
  name: 'AssetDataTable',
  props: {
    assets: Array
  },

  setup(p, context){
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const borderColor = ref('border border-gray-400');

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