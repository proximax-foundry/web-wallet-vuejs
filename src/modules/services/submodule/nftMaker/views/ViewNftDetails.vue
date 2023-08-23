<template>
<div class="mx-12 md:mx-36 lg:mx-60 xl:mx-84 pt-8">
    <img class="img ml-auto mr-auto border border-black dark:border-white" :src="asset.image" >
    <div class="text-2xl font-semibold mt-2 dark:text-white">{{asset.name}}</div>
    <div class="text-sm text-gray-500  my-2">Asset ID: {{assetId}}</div>
    <div :class="asset.description.length?'dark:text-white font-semibold':'text-gray-500 text-xs'">{{asset.description.length?'Description':'This asset has no descriptions'}}</div>
    <div class="border border-black dark:border-white p-3 mt-2 dark:text-white"  v-if="asset.description.length">{{asset.description}}</div>
    <div class=" my-2" :class="propertyKeys.length?'font-semibold dark:text-white':'text-gray-500 text-xs'">{{propertyKeys.length?'Properties':'This asset has no properties'}}</div>
    <div class="border border-black dark:border-white p-3 mt-2 " v-if="propertyKeys.length">
        <div v-for="(property,index) of propertyKeys" :key="index" >
            <div class="grid grid-cols-2">
                <div  v-html="property" class="dark:text-white"/>
                <div  v-html="propertyValues[index]" class="dark:text-white"/>
            </div>
        </div>
    </div>
    <div class="flex mt-2">
        <router-link :to="`/edit-nft/${assetId}`">
            <button class="bg-blue-600 text-white rounded-md px-6 py-1.5">Edit</button>
        </router-link>
        <router-link :to="`/transfer-nft/${assetId}`">
            <button class="ml-2 bg-blue-600 text-white rounded-md px-6 py-1.5">Send</button>
        </router-link>
    </div>
</div>
</template>

<script lang="ts" setup>
import { Convert, MetadataHttp, MetadataQueryParams, MetadataType, MosaicId, NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk'
import { computed, getCurrentInstance, ref, shallowRef, watch } from 'vue'
import UTF8 from 'utf-8'
import { useRouter } from 'vue-router';

//property passed from parent page
const props = defineProps({
    assetId: String
})

//initializing variables
interface imageType{
    name:string,
    description:string,
    image:string
}
const asset = shallowRef<imageType>({
    name:'',
    description:'',
    image:''
})  
let attributes = ref()  
const testnetUrl = 'https://api-2.testnet2.xpxsirius.io'
const publicKey = shallowRef('')
const internalInstance = getCurrentInstance() 
const emitter = internalInstance!.appContext.config.globalProperties.emitter
const router = useRouter()

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
//display property
const propertyKeys = computed(()=>{ 
    if(!attributes.value){
        return []
    }
    let properties = Object.keys(attributes.value).map((key)=> {
        return  key 
    })
    return properties
})

const propertyValues = computed(()=>{ 
    if(!attributes.value){
        return []
    }
    let properties = Object.keys(attributes.value).map((key)=> {
        return attributes.value[key] 
    })
    return properties
})

//fetch asset details
const fetchMetadata = async() =>{ 
    if(props.assetId == undefined){
        return
    }
    let publicAccount = PublicAccount.createFromPublicKey(publicKey.value,NetworkType.TEST_NET)
    const metadataHttp = new MetadataHttp(testnetUrl) 
    let metadataQueryParams = new MetadataQueryParams()  
    try {
        metadataQueryParams.metadataType = MetadataType.MOSAIC 
        metadataQueryParams.targetKey = publicAccount
        metadataQueryParams.targetId = new MosaicId(props.assetId)
    } catch (error) {
        router.push('/view-nft')
    }
    let searchedMetadata = await metadataHttp.searchMetadata(metadataQueryParams).toPromise() 
    let metadataEntry = searchedMetadata.metadataEntries[0]
    if(!metadataEntry){
        router.push('/view-nft')
    }
    if(convertUtf8(metadataEntry.scopedMetadataKey.toHex()) == 'nft.json'){
        asset.value = ({
            name: JSON.parse(metadataEntry.value).name,
            image: JSON.parse(metadataEntry.value).image,
            description: JSON.parse(metadataEntry.value).description,
        })
        attributes.value = JSON.parse(metadataEntry.value).attributes
    }
}

//check if wallet is connected
watch(publicKey,n=>{ 
    if(n.length){
        fetchMetadata ()
    }else{
        router.push('/view-nft')
    }
},{immediate:true})
</script>

<style scoped>
.img {
  border-radius: 4px;
  padding: 5px;
}
</style>