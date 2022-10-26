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
        <Column field="assetId" :header="$t('general.assetId')">
            <template #body="{data}">
                <span class="uppercase font-semibold text-xs">{{ data.id }}</span>
            </template>
        </Column>
        <Column field="alias" header="Alias">
            <template #body="{data}">
                <div class="flex items-center  pr-7 ">
                    <img v-if="data.name=='prx.xpx'" src="@/modules/account/img/proximax-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <img v-else-if="data.name=='xarcade.xar'" src="@/modules/account/img/xarcade-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <img v-else-if="data.name=='prx.metx'" src="@/modules/account/img/metx-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <div v-else-if="!data.name"/>
                    <img v-else  src="@/modules/dashboard/img/icon-proximax-logo-gray.svg" class='inline-block h-6 w-6 mr-2 '>
                    <div v-if="displayTokenName(data.name).registered" class="inline-block text-xs ml-2 mt-1">{{displayTokenName(data.name).name}}</div>
                    <div v-else class="inline-block text-xs ml-2 cursor-pointer mt-1">{{data.name}}</div>
                </div>
            </template> 
        </Column>
        <Column field="amount" :header="$t('general.amount')">
        <template #body="{data}">
          <span class="uppercase font-semibold text-xs">{{ Helper.toCurrencyFormat(data.balance, data.divisibility)}}</span>
        </template>
      </Column>
        </DataTable>
    </div>
</template>

<script lang="ts" setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {Helper} from '@/util/typeHelper';

defineProps({
  assets: Array
})

const displayTokenName = (name : string) =>{
    if (name=='prx.xpx'){
        return {name:'XPX',registered:true}
    }else if (name=='prx.metx'){
        return {name:'METX',registered:true}
    }else if (name=='xarcade.xar'){
        return {name:'XAR',registered:true}
    }else{
        return {name:name,registered:false}
    }
}

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
    .p-highlight{
      border-radius: 9999px;
    }
   
}
</style>