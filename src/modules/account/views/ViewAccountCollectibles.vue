<template>
<div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
        <AccountComponent :address="address" class="mb-10"/>
        <AccountTabs :address="address" selected="collectibles"/>
        <div class='border-2 border-t-0 px-6 py-3'>
            <div v-if="allCollectibles.length==0" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div v-if="allCollectibles.length==0" class='text-txs w-9/12 ml-auto mr-auto text-gray-400 text-center'>
          <span >{{$t('account.noAssets')}}</span>
        </div>
        <div v-else class="grid grid-cols-7 text-gray-400 font-semibold text-xs uppercase mb-2">
            <div class="col-span-2">ID</div>
            <div class="col-span-2">Namespace</div>
            <div class="col-span-2">Owner</div>
            <div>Creator</div>
        </div>
        <div v-for="(collectible, index) in allCollectibles" :key="index">
            <div class="grid grid-cols-7 text-xs my-4">
                <a :href="explorerLink(collectible.id)" target=_new class="col-span-2"><div  class="inline-block text-xs mt-1.5 cursor-pointer transition-all duration-200 break-all pr-7 ">{{collectible.id}}</div></a>
                <div class="col-span-2 break-all pr-7 ">
                    <img v-if="collectible.name!='-'" src="@/modules/dashboard/img/icon-sda.svg" class='inline-block h-6 w-6 mr-2 '>
                    <div  class="inline-block text-xs ml-2 cursor-pointer mt-1">{{collectible.name}}</div>
                </div>
                <div class="col-span-2 break-all pr-7 ">
                    <div class="ml-2.5">
                            <img v-if="collectible.isOwner" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5">
                            <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5">
                        </div>
                </div>

                <div class="mt-1.5">
                    <div class="flex">
                        <div class="ml-2.5">
                            <img v-if="collectible.isCreator" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5">
                            <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5">
                        </div>
                        <img v-if="collectible.isCreator" src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5" @mouseover="isHover[index] = true" @mouseout="isHover[index] = false" @click="toggleMenu[index]=!toggleMenu[index]">
                        <div v-if="toggleMenu[index]==true" class="mt-5 pop-option inline-block w-36 absolute rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" >
                            <div class="my-2" >
                                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange', params: {assetId: collectible.id, address: address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.modifySupply')}}</router-link>
                                <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace', params: {assetId: collectible.id, address: address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.linkToNamespace')}}</router-link>
                                <router-link :to="{ name: 'ViewUpdateAssetMetadata', params: {targetId: collectible.id} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Update Metadata</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="index != (allCollectibles.length - 1)" class='my-2 gray-line' ></div>
        </div>
        <!-- <div class="flex mt-3" >
            <router-link :to="{ name: 'ViewTransferCreate'}" class=" bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-24 "><img src="@/assets/img/icon-transfer-white.svg" class="  inline-block w-4 h-4 mt-0.5  cursor-pointer mr-1">{{$t('general.transfer')}}</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwap'}" class="ml-3 bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-20 "><img src="@/assets/img/navi/icon-swap.svg" class="h-5 w-5 pt-0.5 inline-block relative mr-1">{{$t('general.swap')}}</router-link>
            <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="ml-3 bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-44"><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('asset.createNewAsset')}}</router-link>
        </div> -->
        </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { TransactionUtils } from "@/util/transactionUtils";
import { Helper } from "@/util/typeHelper";
import { computed, getCurrentInstance, ref, watch } from "@vue/runtime-core";
import { MosaicDefinitionTransaction, MosaicId, PublicAccount, TransactionGroupType, TransactionQueryParams, TransactionType } from "tsjs-xpx-chain-sdk";
import { MosaicDefinitionTransactionDTO } from "tsjs-xpx-chain-sdk/dist/src/infrastructure/api";

const props = defineProps({
    address :String
})

const wallet = walletState.currentLoggedInWallet  
const acc= computed(()=>{
    if(!wallet){
        return null
    }
    let currentAccount=wallet.accounts.find(account=> account.address == props.address)
    if (currentAccount!=undefined){
        return currentAccount
    }else{
        return wallet.others.filter(accounts=>accounts.type === "MULTISIG").find(account=>account.address == props.address)
    }
})

const allCollectibles = computed(()=>{
    return collectibles.value.concat(noBalanceCollectibles.value)
})

const collectibles = computed(() => {
            
    var collectibles = [];
    if(!walletState.currentLoggedInWallet){
        return collectibles;
    }
    const account = walletState.currentLoggedInWallet.accounts.find(
        (element) => element.address == props.address
    ) ||  walletState.currentLoggedInWallet.others.find(
        (element) => element.address == props.address)
    if(!account){
        return collectibles
    }
    account.assets.forEach((i) => { 
        if(i.supplyMutable == false && i.supply==1 && i.transferable==true && i.divisibility==0){
            collectibles.push({
            id: i.idHex,
            name: (i.namespaceNames.length>0?i.namespaceNames[0]:'-'),
            isOwner: true,
            isCreator: acc.value? (i.owner == acc.value.publicKey? true:false):false
        });
        }
    });
    
    return collectibles;
});
 const publicAccount = PublicAccount.createFromPublicKey(acc.value?acc.value.publicKey:'0'.repeat(64),AppState.networkType)
const noBalanceCollectibles = ref([])
const fetchNoBalanceCollectibles = async()=>{
    if(!acc.value){
        return  
    }
    let txnAPI = AppState.chainAPI.transactionAPI 
    let txnQueryParams = new TransactionQueryParams 
    txnQueryParams.embedded = true
    txnQueryParams.type = [TransactionType.MOSAIC_DEFINITION]
    txnQueryParams.publicKey = publicAccount
    let searchedTxn = await txnAPI.searchTransactions(TransactionGroupType.CONFIRMED,txnQueryParams)
    searchedTxn.transactions.forEach(async(txn)=>{ 
        let castedTxn = txn as MosaicDefinitionTransaction
        let mosaicId = new MosaicId([castedTxn.mosaicId.id.lower,castedTxn.mosaicId.id.higher])
        let findAsset =  acc.value.assets.find(asset=>asset.idHex == mosaicId.id.toHex())
        if(!findAsset){
            
            noBalanceCollectibles.value.push({
                id: mosaicId.id.toHex(),
                isOwner:false,
                isCreator: true
            });
        }
    })
    let mosaicIds = []
    noBalanceCollectibles.value.forEach(mosaic=>{
        mosaicIds.push(new MosaicId(mosaic.id))
    })
    let mosaicNames = await AppState.chainAPI.assetAPI.getMosaicsNames(mosaicIds)
    noBalanceCollectibles.value.forEach((mosaic,index)=>{
        mosaic.name = mosaicNames[index].names.length>0?mosaicNames[index].names[0].namespaceId.fullName:'-'
    })
    let mosaicInfo = await AppState.chainAPI.assetAPI.getMosaics(mosaicIds)
    noBalanceCollectibles.value.forEach((mosaic,index)=>{
        mosaic.transferable = mosaicInfo[index].isTransferable(),
        mosaic.supplyMutable = mosaicInfo[index].isSupplyMutable()
        mosaic.divisibility = mosaicInfo[index].divisibility
        mosaic.supply = mosaicInfo[index].supply.compact()
    })
    noBalanceCollectibles.value = noBalanceCollectibles.value.filter(element=>{
        return element.transferable == true && element.supplyMutable == false && element.divisibility == 0 && element.supply ==1
    })
}
if(AppState.isReady){
    fetchNoBalanceCollectibles();
}else{
    let readyWatcher = watch(AppState, (value) => {
        if(value.isReady){
        fetchNoBalanceCollectibles();
        readyWatcher();
        }
    });
}

const explorerLink = assetId=>{ 
    if(!networkState.currentNetworkProfile){
        return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
}
const toggleMenu = ref([]) 
const isHover = ref([])
for(let i = 0;i<collectibles.value.length;i++){
    isHover.value.push(false)
    toggleMenu.value.push(false)
}
const internalInstance = getCurrentInstance();
const emitter = internalInstance.appContext.config.globalProperties.emitter;
emitter.on('PAGE_CLICK', () => {
    if(isHover.value.every(value=>value==false) && toggleMenu.value.includes(true)){
        for(let i=0;i<toggleMenu.value.length;i++){
            toggleMenu.value[i] = false
        }
    } else if(isHover.value.includes(true) && toggleMenu.value.includes(true)){
        let hoverIndexes = []
        let menuIndexes = []
        isHover.value.filter((elem, index)=>{
            if(elem == true) {
                hoverIndexes.push(index);
            } 
        });
        toggleMenu.value.filter((elem, index)=>{
            if(elem == true) {
                menuIndexes.push(index);
            }
        });
        if(hoverIndexes!=menuIndexes){
            for(let i=0;i<toggleMenu.value.length;i++){
                toggleMenu.value[i] = false
            }
            toggleMenu.value[hoverIndexes[0]] = true
        }
            } 

        });
</script>

<style>

</style>