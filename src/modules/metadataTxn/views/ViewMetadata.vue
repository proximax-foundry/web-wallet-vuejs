<template>
    <div>
        
        <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
            <AccountComponent :address="address" class="mb-6"/>
            <AccountTabs :address="address" selected="metadata"/>
            <div class="border-2 border-t-0 px-6" >
                <select class=" my-4" v-model="filterSelection">
                    <option value=0>ACCOUNT</option>
                    <option value=1>NAMESPACE</option>
                    <option value=2>ASSET</option>
                </select>
                <div v-if="filterSelection==0">
                    <div v-if="!accountMetadata.length" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
                    <div class="text-txs text-gray-400 my-1 text-center" v-if="!accountMetadata.length">You do not have any existing metadatas on record.</div>
                    <div v-else>
                        <div class="grid grid-cols-2 text-gray-400 font-semibold text-xs uppercase mb-2">
                            <div>Scoped Metadata Key</div>
                            <div>Current Value</div>
                        </div>
                        <div v-for="(metadata,index) in accountMetadata" :key="index">
                            <div class="grid grid-cols-2 text-xs mb-2">
                                <div>
                                    <div class="flex">
                                        <div>{{metadata.scopedMetadataKeyHex}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold" v-if="metadata.scopedMetadataKeyUtf8">hex</div>
                                    </div>
                                    <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
                                        <div>{{metadata.scopedMetadataKeyUtf8}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                                    </div>
                                </div>
                                <div class="break-all">
                                    {{metadata.value}} 
                                    <router-link :to="{name: 'ViewUpdateAccountMetadata',params:{targetPublicKey:acc?acc.publicKey:'0'.repeat(64),scopedMetadataKey:metadata.scopedMetadataKeyUtf8?metadata.scopedMetadataKeyUtf8:metadata.scopedMetadataKeyHex}}">
                                        <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
                                    </router-link>
                                </div>
                            </div>
                            <div v-if="index != (accountMetadata.length - 1)" class='my-2 gray-line' ></div>
                        </div>
                    </div>
                </div>
                <div v-else-if="filterSelection==1">
                    <div v-if="!namespaceMetadata.length" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
                    <div class="text-txs text-gray-400 my-1 text-center" v-if="!namespaceMetadata.length">You do not have any existing metadatas on record.</div>
                    <div v-else>
                        <div class="grid grid-cols-3 text-gray-400 font-semibold text-xs uppercase mb-2">
                            <div>Scoped Metadata Key</div>
                            <div>Target ID</div>
                            <div>Current Value</div>
                        </div>
                        <div v-for="(metadata,index) in namespaceMetadata" :key="index">
                            <div class="grid grid-cols-3 text-xs mb-2">
                                <div>
                                    <div class="flex">
                                        <div>{{metadata.scopedMetadataKeyHex}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold" v-if="metadata.scopedMetadataKeyUtf8">hex</div>
                                    </div>
                                    <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
                                        <div>{{metadata.scopedMetadataKeyUtf8}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                                    </div>
                                </div>
                                <div>{{metadata.id}}</div>
                                <div class="break-all">
                                    {{metadata.value}}
                                    <router-link :to="{name: 'ViewUpdateNamespaceMetadata',params:{targetId:metadata.id,scopedMetadataKey:metadata.scopedMetadataKeyUtf8?metadata.scopedMetadataKeyUtf8:metadata.scopedMetadataKeyHex}}">
                                        <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
                                    </router-link>
                                </div>
                            </div>
                            <div v-if="index != (namespaceMetadata.length - 1)" class='my-2 gray-line' ></div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="!assetMetadata.length" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
                    <div class="text-txs text-gray-400 my-1 text-center" v-if="!assetMetadata.length">You do not have any existing metadatas on record.</div>
                    <div v-else>
                        <div class="grid grid-cols-3 text-gray-400 font-semibold text-xs uppercase mb-2">
                            <div>Scoped Metadata Key</div>
                            <div>Target ID</div>
                            <div>Current Value</div>
                        </div>
                        <div v-for="(metadata,index) in assetMetadata" :key="index">
                            <div class="grid grid-cols-3 text-xs mb-2">
                                <div>
                                    <div class="flex">
                                        <div>{{metadata.scopedMetadataKeyHex}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold" v-if="metadata.scopedMetadataKeyUtf8">hex</div>
                                    </div>
                                    <div class="flex" v-if="metadata.scopedMetadataKeyUtf8">
                                        <div>{{metadata.scopedMetadataKeyUtf8}}</div>
                                        <div class="ml-3 text-gray-400 font-semibold">utf-8</div>
                                    </div>
                                </div>
                                <div>{{metadata.name}}</div>
                                <div class="break-all">
                                    {{metadata.value}}
                                    <router-link :to="{name: 'ViewUpdateAssetMetadata',params:{targetId:metadata.id,scopedMetadataKey:metadata.scopedMetadataKeyUtf8?metadata.scopedMetadataKeyUtf8:metadata.scopedMetadataKeyHex}}">
                                        <img src="@/modules/account/img/edit-icon.svg" title="Update Metadata" class="inline-block w-3 h-3 text-black cursor-pointer  ml-1" >
                                    </router-link>
                                </div>
                            </div>
                            <div v-if="index != (assetMetadata.length - 1)" class='my-2 gray-line' ></div>
                        </div>
                    </div>
                </div>
                <router-link :to="{name: 'ViewUpdateAccountMetadata',params:{targetPublicKey:acc?acc.publicKey:'0'.repeat(64)}}"><button  class="my-4 blue-btn py-3 px-3 " >Create New Account Metadata</button></router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { AppState } from "@/state/appState"
import { walletState } from "@/state/walletState"
import { Convert, MetadataQueryParams, MetadataType, MosaicId, NamespaceId, PublicAccount } from "tsjs-xpx-chain-sdk"
import { computed, ref, watch } from "vue"
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import UTF8 from 'utf-8';
    const props = defineProps({
        address: String
    })
    const filterSelection = ref(0)
    const acc = computed(()=>{
        if(!walletState.currentLoggedInWallet){
            return null
        }
        let acc =  walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==props.address) 
                || walletState.currentLoggedInWallet.others.find(acc=>acc.address==props.address)
        if(!acc){
            return null
        }
        return acc
    })

    const isMultisig = computed(()=>{
        if(!acc.value){
            return false
        }
        return acc.value.getDirectParentMultisig().length>0
    })
    const accountMetadata = ref<{scopedMetadataKeyUtf8:string,scopedMetadataKeyHex: string,value:string}[]>([])
    const namespaceMetadata = ref<{scopedMetadataKeyUtf8:string,scopedMetadataKeyHex: string, id:string,value:string}[]>([])
    const assetMetadata = ref<{scopedMetadataKeyUtf8:string,scopedMetadataKeyHex: string,name:string,id:string,value:string}[]>([])
    const fetchAccountMetadata = async()=>{
        if(!acc.value){
            return
        }
        let metadataQueryParams = new MetadataQueryParams()
        metadataQueryParams.metadataType = MetadataType.ACCOUNT
        metadataQueryParams.targetKey = PublicAccount.createFromPublicKey(acc.value.publicKey,AppState.networkType)
        let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
        fetchMetadata.metadataEntries.forEach(metadataEntry=>{
            accountMetadata.value.push({
                scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())?null:convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex() ,
                value: metadataEntry.value
            })
        })
    }

    const fetchNamespaceMetadata = async()=>{
        if(!acc.value){
            return
        }
        let namespaces :string[] = [] 
        acc.value.namespaces.forEach(namespace=>{
            namespaces.push(namespace.name)
        })
        let metadataQueryParams = new MetadataQueryParams()
        metadataQueryParams.metadataType = MetadataType.NAMESPACE
        namespaces.forEach( async(namespace)=>{
            metadataQueryParams.targetId = new NamespaceId(namespace)
            let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
            fetchMetadata.metadataEntries.forEach(metadataEntry=>{
                namespaceMetadata.value.push({
                    scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())?null:convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                    scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex() ,
                    id: namespace,
                    value: metadataEntry.value
                })
            })
        })
    }

    const fetchAssetMetadata = ()=>{
        if(!acc.value){
            return
        }
        let assets :{id:string,name:string}[] = [] 
        acc.value.assets.forEach(asset=>{
            if(asset.owner==acc.value.publicKey){
                assets.push({
                    id:asset.idHex,
                    name:asset.namespaceNames[0]??''
                })
            }
        })
        let metadataQueryParams = new MetadataQueryParams()
        metadataQueryParams.metadataType = MetadataType.MOSAIC
        assets.forEach( async(asset)=>{
            metadataQueryParams.targetId = new MosaicId(asset.id)
            let fetchMetadata = await AppState.chainAPI.metadataAPI.searchMetadatas(metadataQueryParams)
            fetchMetadata.metadataEntries.forEach(metadataEntry=>{
                assetMetadata.value.push({
                    scopedMetadataKeyUtf8: metadataEntry.scopedMetadataKey.toHex() == convertUtf8(metadataEntry.scopedMetadataKey.toHex())?null:convertUtf8(metadataEntry.scopedMetadataKey.toHex()),
                    scopedMetadataKeyHex: metadataEntry.scopedMetadataKey.toHex() ,
                    name: asset.name.length?asset.name:asset.id,
                    id: asset.id,
                    value: metadataEntry.value
                })
            })
        })
    }

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
     const init = async() =>{
        fetchAccountMetadata()
        fetchNamespaceMetadata()
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
