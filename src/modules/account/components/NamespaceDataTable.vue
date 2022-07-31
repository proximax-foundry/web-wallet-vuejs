<template>
<div>
    <DataTable :value="namespaces" :paginator="true"  :rows="10"
        dataKey="id" 
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        responsiveLayout="scroll">
        <template #empty>
            No namespaces found.
        </template>
        <template #loading>
            Loading namespaces data. Please wait.
        </template>


        <Column style="width: 200px" headerClass="hidden" v-if="!wideScreen">
        <template #body="{data}">
          <div>
            <div class="uppercase text-xxs font-bold mb-1">ID</div>
            <div class="uppercase cursor-pointer font-bold text-txs ">
                <a :href="explorerLink(data.id)" target=_new class="col-span-2"><div  class=" uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7 ">{{data.id}}</div></a>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Namespace</div>
            <div class="flex items-center">
              <div class="uppercase font-bold text-txs mr-2">{{data.name}}</div>
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Linked Asset/Address</div>
            <div class="uppercase font-bold text-txs truncate">{{data.linkedAssetAddress}}</div>
          </div>
        </template>
      </Column>
      <Column style="width: 200px" headerClass="hidden" v-if="!wideScreen">
        <template #body="{data,index}">
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1">Expiry</div>
            <div class="uppercase font-bold text-txs">{{data.expiringBlock}}</div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Active</div>
            <div class="uppercase font-bold text-txs">
                <img v-if="data.isActive" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 ml-1">
                <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5 ml-1">
            </div>
          </div>
          <div>
            <div class="uppercase text-xxs text-gray-300 font-bold mb-1 mt-5">Actions</div>
            <img v-if="data.isActive" src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5" @click="showMenu(index)"  @mouseover="hoverOverMenu(index)" @mouseout="hoverOutMenu">
                <div v-if="isMenuShow[index]" class=" w-36 absolute rounded-sm shadow-lg bg-white focus:outline-none z-10 text-left " >
                    <div class="my-2" >
                        <router-link :to="{ name: 'ViewServicesNamespaceExtend', params: { address: address, namespaceId:data.id} }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.extendDuration')}}</router-link>
                        <router-link :to="{ name: 'ViewNamespaceMetadata', params: { namespaceId: data.name, address: address } }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">View Metadata</router-link>
                    </div>
                </div>
          </div>
        </template>
      </Column>


        <Column field="id" header="ID" v-if="wideScreen">
            <template #body="{data}" bodyStyle="	min-width: max-content;">
                <a :href="explorerLink(data.id)" target=_new class="col-span-2"><div  class="min-w-min uppercase inline-block text-xs mt-1.5 cursor-pointer text-blue-primary pr-7 ">{{data.id}}</div></a>
            </template>
        </Column>
        <Column field="name" header="Name" v-if="wideScreen" >
            <template #body="{data}">
                {{data.name}}
            </template>
            
        </Column>
        <Column field="linked" header="Linked Asset/Address" v-if="wideScreen">
            <template #body="{data}">
                <div class="truncate">{{data.linkedAssetAddress}}</div>
            </template>
        </Column>
        <Column field="expiry" header="Expiry" v-if="wideScreen">
            <template #body="{data}">
               {{data.expiringBlock}}
            </template>
        </Column>
        <Column field="active" header="Active" v-if="wideScreen" >
            <template #body="{data}">
               <img v-if="data.isActive" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 ml-1">
                <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5 ml-1">
            </template>
        </Column>
        <Column field="actions" header="Actions" v-if="wideScreen">
            <template #body="{data,index}">
                <img v-if="data.isActive" src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5" @click="showMenu(index)"  @mouseover="hoverOverMenu(index)" @mouseout="hoverOutMenu">
                <div v-if="isMenuShow[index]" class=" w-36 absolute rounded-sm shadow-lg bg-white focus:outline-none z-10 text-left " >
                    <div class="my-2" >
                        <router-link :to="{ name: 'ViewServicesNamespaceExtend', params: { address: address, namespaceId:data.id} }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.extendDuration')}}</router-link>
                        <router-link :to="{ name: 'ViewNamespaceMetadata', params: { namespaceId: data.name, address: address } }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">View Metadata</router-link>
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
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';

const wideScreen = ref(false);
const screenResizeHandler = () => {
    if(window.innerWidth < 1024){
    wideScreen.value = false;
    }else{
    wideScreen.value = true;
    }
};
screenResizeHandler();

onUnmounted(() => { 
    window.removeEventListener("resize", screenResizeHandler);
});

onMounted(() => {
    window.addEventListener("resize", screenResizeHandler);
});
const props = defineProps({
    namespaces: Array,
    address: String
})
const explorerLink = assetId=>{  
    if(!networkState.currentNetworkProfile){
        return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + assetId
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

.transform{
     
}


    



   
</style>