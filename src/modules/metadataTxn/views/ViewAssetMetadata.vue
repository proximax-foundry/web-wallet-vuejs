<template>
  <div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6"/>
      <AccountTabs :address="address" selected="assets"/>
    <div class='border-2 border-t-0 '>
        <router-link :to="{ name: 'ViewAccountAssets',params:{address:address}}">
            <div class="flex cursor-pointer items-center pt-3 px-3">
                <img src='@/assets/img/chevron_left.svg'>
                <div class="text-blue-primary text-xs">{{$t('general.back')}}</div>
            </div>
        </router-link>
        <div class="border border-blue-primary p-4 bg-blue-100 flex flex-col rounded mt-5 mx-6 mb-5">
            <div >
                <div class="uppercase text-blue-primary font-semibold text-xxs">ASSET ID</div>
                <div class="text-black text-sm font-bold">{{ assetId }}</div>
            </div>
            <div >
                <div class="uppercase text-blue-primary font-semibold text-xxs mt-3">Namespace</div>
                <div class="text-black text-sm font-bold">{{ namespaceName }}</div>
            </div>
        </div>
        <DataTable 
            :value="assetMetadata"
            :paginator="true"  :rows="10"
            dataKey="id" 
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" :rowsPerPageOptions="[10,20,30,40,50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            responsiveLayout="scroll"
        >
            <Column field="scopedMetadataKey" header="Scoped Metadata Key"  style="`wideScreen?'min-width: 200px'?'width: 200px'  ` " >
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
            <Column field="currentValue" header="Current Value"  style="`wideScreen?'min-width: 180px'?'width: 180px'`" >
                <template #body="{data}">
                <span class="  text-xs">{{data.value}}</span>
                </template>
            </Column>
            <Column field="action" header="Action"  style="`wideScreen?'min-width: 180px'?'width: 180px'`" >
                <template #body="{data}">
                    <router-link :to="{name: 'ViewUpdateAssetMetadata',params:{targetId:assetId ,scopedMetadataKey:data.scopedMetadataKeyUtf8?data.scopedMetadataKeyUtf8:data.scopedMetadataKeyHex}}">
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
    </div>
  </div>
    
</template>

<script lang="ts" setup>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, watch } from 'vue';
import { Address, Convert, MetadataQueryParams, MetadataType, MosaicId } from 'tsjs-xpx-chain-sdk';
import { AppState } from '@/state/appState';
import UTF8 from 'utf-8';

const props = defineProps({
    assetId: String,
    address: String

})
const namespaceName = ref('-')
const getAssetNamespace = async() =>{
    let mosaicNames = await AppState.chainAPI.assetAPI.getMosaicsNames([new MosaicId(props.assetId)])
    namespaceName.value = mosaicNames[0].names[0]? mosaicNames[0].names[0].name : '-'
}
const assetMetadata = ref([]) 
const publicKey = ref('')
const getPublicKey = async() =>{
    let accInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(props.address))
    publicKey.value = accInfo.publicKey
}
const delay = (ms :number )=> new Promise(res => setTimeout(res, ms));
const removeDoubleZero = (string :string) =>{
        let isZero = string.endsWith('00')
        if(isZero){
            string = string.substring(0, string.length - 2);
            string = removeDoubleZero(string)
        }
        return string
    }

const convertUtf8 = (scopedMetadataKey :string)=>{
    scopedMetadataKey =  removeDoubleZero(scopedMetadataKey )
    let bytes = Convert.hexToUint8(scopedMetadataKey );
    if(!UTF8.isNotUTF8(bytes)){ 
        scopedMetadataKey  = Convert.decodeHexToUtf8(scopedMetadataKey)
    }
    return scopedMetadataKey
    
}
const fetchAssetMetadata = async()=>{
    let metadataQueryParams = new MetadataQueryParams() 
    metadataQueryParams.metadataType = MetadataType.MOSAIC 
    metadataQueryParams.pageSize = 100;
    metadataQueryParams.pageNumber = 1; 
    metadataQueryParams.targetId = props.assetId
    metadataQueryParams.targetKey = publicKey.value
    let searchedMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
    for(let i = 0; i< searchedMetadata.metadataEntries.length; i++){
        let metadataEntry = searchedMetadata.metadataEntries
        assetMetadata.value.push({
            scopedMetadataKeyUtf8: metadataEntry[i].scopedMetadataKey.toHex() == convertUtf8(metadataEntry[i].scopedMetadataKey.toHex())?null:convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()),
            scopedMetadataKeyHex: metadataEntry[i].scopedMetadataKey.toHex() ,
            value: metadataEntry[i].value
        })
    }
    let totalPageNumber = searchedMetadata.pagination.totalPages
    await delay(250)
    for (let i = 2; i <= totalPageNumber; i++) {   
        let metadataQueryParams = new MetadataQueryParams() 
        metadataQueryParams.metadataType = MetadataType.MOSAIC 
        metadataQueryParams.pageSize = 100
        metadataQueryParams.pageNumber = i;
        metadataQueryParams.targetId = props.assetId
        metadataQueryParams.targetKey = publicKey.value
        let searchedMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
        for(let i = 0; i< searchedMetadata.metadataEntries.length; i++){
            let metadataEntry = searchedMetadata.metadataEntries
            assetMetadata.value.push({
                scopedMetadataKeyUtf8: metadataEntry[i].scopedMetadataKey.toHex() == convertUtf8(metadataEntry[i].scopedMetadataKey.toHex())?null:convertUtf8(metadataEntry[i].scopedMetadataKey.toHex()),
                scopedMetadataKeyHex: metadataEntry[i].scopedMetadataKey.toHex() ,
                value: metadataEntry[i].value
            })
            await delay(250)
        }
    }
}

const init = async() =>{
    await getPublicKey()
    await getAssetNamespace()
    fetchAssetMetadata() 
    
}

if(AppState.isReady){
    init();
}
else{ 
    let readyWatcher = watch(AppState, (value) => {
    if(value.isReady){
        init();
        readyWatcher();
    }
    });
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