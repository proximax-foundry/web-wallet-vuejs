<template>
<div>
    <DataTable
    :value="accMetadata"
     :paginator="true"  :rows="10"
        dataKey="id" 
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll"
      >
      <Column field="scopedMetadataKey" header="Scoped Metadata Key"   >
        <template #body="{data}">
            <div class="flex">
                <div>{{data.scopedMetadataKeyHex}}</div>
                <div class="ml-3 text-gray-400 font-semibold" v-if="data.scopedMetadataKeyUtf8">hex</div>
            </div>
            <div class="flex" v-if="data.scopedMetadataKeyUtf8">
                <div>{{data.scopedMetadataKeyUtf8}}</div>
                <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
        </div>
        </template>
      </Column>
      <Column field="currentValue" header="Current Value"  >
        <template #body="{data}">
          <span class="  text-xs">{{data.value}}</span>
        </template>
      </Column>
      <Column field="action" header="Action"  >
        <template #body="{data}">
            <router-link :to="{name: 'ViewUpdateAccountMetadata',params:{targetPublicKey:publicKey,scopedMetadataKey:data.scopedMetadataKeyUtf8?data.scopedMetadataKeyUtf8:data.scopedMetadataKeyHex}}">
                <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
            </router-link>
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

const props = defineProps({
  accMetadata: Array,
  publicKey: String
})
</script>

<style lang="scss" scoped>

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
   
}
</style>