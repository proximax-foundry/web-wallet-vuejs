<template>
    <div class="lg:ml-60 mt-10 lg:mt-16 flex-grow px-5 pt-5">
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
    </div>
    </template>
    
    <script lang="ts" setup>
    import { Convert, MetadataHttp, MetadataQueryParams, MetadataType, MosaicId, NetworkType, PublicAccount } from 'tsjs-xpx-chain-sdk'
    import { computed, getCurrentInstance, ref, shallowRef, watch, defineProps } from 'vue'
    import UTF8 from 'utf-8'
    import { useRouter } from 'vue-router';
    import { AppState } from '@/state/appState';
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
    let targetPublicAccount = ref(null);
    const router = useRouter()
    //functions to get publicKey value from assetid
    const getPublicAccountInfo = async ()=> {
        let assetId = new MosaicId(props.assetId);
        let assetInfo = await AppState.chainAPI.assetAPI.getMosaic(assetId);
        targetPublicAccount.value = assetInfo.owner;
    }
    
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
        let publicAccount = PublicAccount.createFromPublicKey(targetPublicAccount.value.publicKey,NetworkType.TEST_NET)
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
    const init = async () => {
        await getPublicAccountInfo()
        fetchMetadata()
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
    
    <style scoped>
    .img {
      border-radius: 4px;
      padding: 5px;
    }
    </style>