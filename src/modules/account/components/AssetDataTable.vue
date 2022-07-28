<template>
<div>
    <DataTable :value="assets" :paginator="true"  :rows="10"
        dataKey="id" 
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll">
        <template #empty>
            No assets found.
        </template>
        <template #loading>
            Loading assets data. Please wait.
        </template>
        <Column field="id" header="ID" >
            <template #body="{data}" headerClass="w-96">
                <a :href="explorerLink(data.id)" target=_new class="col-span-2"><div  class="uppercase w-min-max text-xs mt-1.5 cursor-pointertext-blue-primary pr-7 ">{{data.id}}</div></a>
            </template>
        </Column>
        <Column field="namespace" header="Namespace" >
            <template #body="{data}">
                <div class="flex items-center  pr-7 ">
                    <img v-if="displayTokenName(data.name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <img v-else-if="displayTokenName(data.name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <img v-else-if="displayTokenName(data.name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <div v-else-if="data.name=='-'"/>
                    <img v-else  src="@/modules/dashboard/img/icon-proximax-logo-gray.svg" class='inline-block h-6 w-6 mr-2 '>
                    <div v-if="displayTokenName(data.name).registered" class="inline-block text-xs ml-2 mt-1">{{displayTokenName(data.name).name}}</div>
                    <div v-else class="inline-block text-xs ml-2 cursor-pointer mt-1">{{data.name}}</div>
                </div>
            </template>
            
        </Column>
        
        <Column field="balance" header="Balance" >
            <template #body="{data}">
                {{data.balance}}
            </template>
        </Column>
        <Column field="creator" header="Creator" >
            <template #body="{data}">
                <img v-if="data.isCreator" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5">
                <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5">
            </template>
            
        </Column>
        <Column field="actions" header="Actions" >
            <template #body="{data}">
                <img v-if="data.isCreator" src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5" @click="showMenu(data.i)"  @mouseover="hoverOverMenu(data.i)" @mouseout="hoverOutMenu">
                <div v-if="isMenuShow[data.i]" class="mt-5 pop-option inline-block w-36 absolute rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" >
                    <div class="my-2" >
                        <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange', params: {assetId: data.id, address: address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.modifySupply')}}</router-link>
                        <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace', params: {assetId: data.id, address: address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.linkToNamespace')}}</router-link>
                        <router-link :to="{ name: 'ViewUpdateAssetMetadata', params: {targetId: data.id} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Update Metadata</router-link>
                    </div>
                </div>
            </template>
            
        </Column>
    </DataTable>
</div>
</template>

<script lang="ts" setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { networkState } from '@/state/networkState';
import { getCurrentInstance, ref } from 'vue';


const props = defineProps({
    assets: Array,
    address: String
})
const explorerLink = assetId=>{  
    if(!networkState.currentNetworkProfile){
        return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
}
const displayTokenName = (name :string) =>{
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
const isMenuShow = ref([]);

const currentMenu = ref(0); 
const showMenu = (i) => {
    currentMenu.value = i;
    isMenuShow.value[i] = !isMenuShow.value[i];
} 
const internalInstance = getCurrentInstance(); 
const emitter = internalInstance.appContext.config.globalProperties.emitter; 
    // emitted from App.vue when click on any part of the page
emitter.on('PAGE_CLICK', () => {
    var k = 0;
    while(k < isMenuShow.value.length){
    if(k != currentMenu.value){
        isMenuShow.value[k] = false;
    }
    k++;
    }
});

const hoverOverMenu = (i) => {
    currentMenu.value = i;
};

const hoverOutMenu = () => {
    currentMenu.value = -1;
};

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