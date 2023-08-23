<template>
<div class="mx-12 justify-center pt-8">
    <div v-if="!isConnected" class="text-center text-red-600 bg-red-300 rounded-lg ml-auto mr-auto w-52 py-1.5">Wallet is not connected</div>
    <div class="font-semibold  dark:text-white mb-2">My items</div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 items-center ">
        <div v-for="(asset,index) of assets" :key="index" >
            <div class="flex flex-col ">
                <router-link :to="`nft-details/${asset.id}`">
                    <img class="img" :src="asset.image" >
                 </router-link>
                <div class="dark:text-white">{{asset.name}}</div>
                <div class="dark:text-white">Asset ID:</div>
                <div class="dark:text-white break-all">{{asset.id}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { AccountHttp, Convert, MetadataHttp, MetadataQueryParams, MetadataType, MosaicHttp, MosaicId, NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { getCurrentInstance, ref, shallowRef, watch } from 'vue';
import UTF8 from 'utf-8';

//initialize variables
const publicKey = shallowRef('')
const isConnected = shallowRef(false)
const internalInstance = getCurrentInstance() 
const emitter = internalInstance!.appContext.config.globalProperties.emitter
const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
interface displayAsset{
    image: string,
    name: string,
    id: string
}
const assets = ref<displayAsset[]>([]) 

//get public key from session storage
const fetchSessionStorage = () =>{
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
})

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
    let publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
    const accountHttp = new AccountHttp(testnetUrl)
    const metadataHttp = new MetadataHttp(testnetUrl)
    const mosaicHttp = new MosaicHttp(testnetUrl)
    const accountInfo = await accountHttp.getAccountInfo(publicAccount.address).toPromise()
    const mosaicIds :MosaicId[] = accountInfo.mosaics.map(mosaic=>mosaic.id) //get all account mosaics
    let numOfRequest = Math.ceil(mosaicIds.length / dataPerRequest)
    let nftIds :string[] = [] //filter nft ids
    for (let i = 0; i < numOfRequest; i++) { //max 100 requests per api call
        let startIndex = i * dataPerRequest
        let endIndex = (i + 1) * dataPerRequest
        let requestData = mosaicIds.slice(startIndex, endIndex) 
        let mosaicInfos = await mosaicHttp.getMosaics(requestData).toPromise()
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
    let searchedMetadata = await metadataHttp.searchMetadata(metadataQueryParams).toPromise()
    for(let i = 0; i< searchedMetadata.metadataEntries.length; i++){
        let metadataEntry = searchedMetadata.metadataEntries[i]
        if(convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json'){
            assets.value.push({
                name: JSON.parse(metadataEntry.value).name,
                image: JSON.parse(metadataEntry.value).image,
                id:metadataEntry.targetId.toHex()
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
        let searchedMetadata = await metadataHttp.searchMetadata(metadataQueryParams).toPromise()
        for(let i = 0; i< searchedMetadata.metadataEntries.length; i++){
            let metadataEntry = searchedMetadata.metadataEntries[i]
            if(convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json'){
            assets.value.push({
                name: JSON.parse(metadataEntry.value).name,
                image: JSON.parse(metadataEntry.value).image,
                id:metadataEntry.targetId.toHex()
            })
        }
            await delay(250)
        }
    }   
}

//check if wallet is connected
watch(publicKey,n=>{ 
    if(n.length){
        isConnected.value= true
        fetchNft()
    }else{
        isConnected.value = false
        assets.value = []
    }
},{immediate:true})

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