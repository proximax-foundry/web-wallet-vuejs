<template>
<div class="mx-12 justify-center pt-8">
    <SelectInputAccount />
    <SelectInputMultisigAccount class="md:mt-3 " :selected-address="selectedAddress" />
    <div class="font-semibold  dark:text-white mb-2">My Nfts</div>
    <div v-if="assets.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
        <div v-for="(asset,index) of assets" :key="index" >
            <div class="flex flex-col ">
                <img class="img ml-auto mr-auto border border-black dark:border-white" :src="asset.image" >
                <div class="text-2xl font-semibold mt-2 dark:text-white">{{asset.name}}</div>
                <div class="text-sm text-gray-500  my-2">Asset ID: {{asset.id}}</div>
                <div :class="asset.description.length?'dark:text-white font-semibold':'text-gray-500 text-xs'">{{asset.description.length?'Description':'This asset has no descriptions'}}</div>
                <div class="border border-black dark:border-white p-3 mt-2 dark:text-white"  v-if="asset.description.length">{{asset.description}}</div>
                <div class=" my-2" :class="Object.keys(asset.property).length?'font-semibold dark:text-white':'text-gray-500 text-xs'">{{Object.keys(asset.property).length?'Properties':'This asset has no properties'}}</div>
                <div class="border border-black dark:border-white p-3 mt-2 " v-if="Object.keys(asset.property).length">
                    <div v-for="(value,key) in asset.property" :key="index" >
                        <div class="grid grid-cols-2 border-b">
                            <div  v-html="key" class="dark:text-white"/>
                            <div  v-html="value" class="dark:text-white"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="mb-3 rounded-md bg-red-200 w-full p-2 flex items-center justify-center">
        <div class="rounded-full w-5 h-5 border border-red-500 inline-block relative mr-2">
            <font-awesome-icon icon="times" class="text-red-500 h-3 w-3 absolute"
            style="top: 3px; left:4px"></font-awesome-icon></div>
        <div class="inline-block text-xs">No Nft</div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { Address, Convert, MetadataQueryParams, MetadataType, MosaicId, NetworkType } from 'tsjs-xpx-chain-sdk';
import { computed, getCurrentInstance, ref, shallowRef } from 'vue';
import UTF8 from 'utf-8';
import { AppState } from '@/state/appState';
import SelectInputAccount from "@/modules/services/submodule/nftMaker/components/SelectInputAccount.vue";
import SelectInputMultisigAccount from "@/modules/services/submodule/nftMaker/components/SelectInputMultisigAccount.vue";

//initialize variables
const selectedAddress = ref<string | null>(null)
const selectedMultisigAddress = ref<string | null>(null)
const publicKey = shallowRef('')
const internalInstance = getCurrentInstance() 
const emitter = internalInstance!.appContext.config.globalProperties.emitter
interface displayAsset{
    image: string,
    name: string,
    id: string,
    description:string,
    property: Object
}
const assets = ref<displayAsset[]>([]) 

//get public key from session storage
/*const fetchSessionStorage = () =>{
  const searchStorage = sessionStorage.getItem('userPublicKey') 
  if(searchStorage!=null){
    publicKey.value = PublicAccount.createFromPublicKey(searchStorage, NetworkType.TEST_NET).publicKey
  }else{
    publicKey.value = ""  
  }
}

fetchSessionStorage()

//listens to wallet connection events, update publicKey
emitter.on('Mobile Wallet Connected',()=>{
    fetchSessionStorage()
})

emitter.on('Mobile Wallet Disconnected',()=>{
    fetchSessionStorage()
})*/

//functions to get convert utf8 from hex
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

//fetch nfts from account
const delay =( ms :number)=> new Promise(res => setTimeout(res, ms))

const fetchNft = async() =>{
    let dataPerRequest = 100
    const metadataHttp = AppState.chainAPI.metadataAPI
    const mosaicHttp = AppState.chainAPI.assetAPI
    const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedAddress.value))
    const mosaicIds :MosaicId[] = accountInfo.mosaics.map(mosaic=>mosaic.id) //get all account mosaics
    let numOfRequest = Math.ceil(mosaicIds.length / dataPerRequest)
    let nftIds :string[] = [] //filter nft ids
    for (let i = 0; i < numOfRequest; i++) { //max 100 requests per api call
        let startIndex = i * dataPerRequest
        let endIndex = (i + 1) * dataPerRequest
        let requestData = mosaicIds.slice(startIndex, endIndex) 
        let mosaicInfos = await mosaicHttp.getMosaics(requestData)
        let filteredMosaicInfos = mosaicInfos.filter(mosaicInfo=>{
            return mosaicInfo.supply.compact() == 1 && 
            mosaicInfo.divisibility == 0 && 
            mosaicInfo.isTransferable() == true && 
            mosaicInfo.isSupplyMutable() == false
        })
        let tempNftHexIds = filteredMosaicInfos.map(mosaicInfo=> mosaicInfo.mosaicId.id.toHex())
        
        nftIds = nftIds.concat(tempNftHexIds)
    }
    let metadataQueryParams = new MetadataQueryParams() 
    metadataQueryParams.metadataType = MetadataType.MOSAIC 
    metadataQueryParams.pageSize = 100;
    metadataQueryParams.pageNumber = 1;
    metadataQueryParams.targetKey = publicKey.value
    let searchedMetadata = await metadataHttp.searchMetadatas(metadataQueryParams)
    for(let i = 0; i< searchedMetadata.metadataEntries.length; i++){
        let metadataEntry = searchedMetadata.metadataEntries[i]
        if(convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json'){
            assets.value.push({
                name: JSON.parse(metadataEntry.value).name,
                image: JSON.parse(metadataEntry.value).image,
                id:metadataEntry.targetId.toHex(),
                description: JSON.parse(metadataEntry.value).description,
                property: JSON.parse(metadataEntry.value).attributes
            })
        }
    }
    let totalPageNumber = searchedMetadata.pagination.totalPages
    await delay(250)
    for (let i = 2; i <= totalPageNumber; i++) {   
        let metadataQueryParams = new MetadataQueryParams() 
        metadataQueryParams.metadataType = MetadataType.MOSAIC 
        metadataQueryParams.pageSize = 100
        metadataQueryParams.pageNumber = i;
        metadataQueryParams.targetKey = publicKey.value
        let searchedMetadata = await metadataHttp.searchMetadatas(metadataQueryParams)
        for(let i = 0; i< searchedMetadata.metadataEntries.length; i++){
            let metadataEntry = searchedMetadata.metadataEntries[i]
            if(convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json'){
            assets.value.push({
                name: JSON.parse(metadataEntry.value).name,
                image: JSON.parse(metadataEntry.value).image,
                id:metadataEntry.targetId.toHex(),
                description: JSON.parse(metadataEntry.value).description,
                property: JSON.parse(metadataEntry.value).attributes
            })
        }
            await delay(250)
        }
    }   
}

emitter.on("select-account", async (address: string) => {
    selectedAddress.value = address
    const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedAddress.value))
    publicKey.value = accountInfo.publicKey
    assets.value = []
    fetchNft()
})

emitter.on("select-multisig-account", async (address: string) => {
    selectedMultisigAddress.value = address
    const accountInfo = await AppState.chainAPI.accountAPI.getAccountInfo(Address.createFromRawAddress(selectedMultisigAddress.value))
    publicKey.value = accountInfo.publicKey
    assets.value = []
    fetchNft()
})

</script>

<style scoped>
.img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 200px;
  height:150px;
}
</style>