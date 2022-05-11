<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-10"/>
      <div class = 'flex text-xs font-semibold border-b-2 menu_title_div'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address:address}}" class= 'w-32 text-center '>{{$t('account.accountDetails')}}</router-link>
        <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>{{$t('general.asset',2)}}</div>
        <router-link v-if="!isDelegate()" :to="{name:'ViewAccountNamespaces', params: { address: address}}" class= 'w-24 text-center'>{{$t('general.namespace',2)}}</router-link>
        <router-link v-if="!isDelegate()" :to="{name:'ViewMetadata', params: { address: address}}" class= 'w-18 text-center'>Metadata</router-link>
        <router-link v-if="!isDelegate()" :to="{name:'ViewMultisigHome', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.multisig')}}</router-link>
        <router-link v-if="isMultiSig" :to="{name:'ViewMultisigScheme', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
    </div>
    <div class='border-2 border-t-0 px-6 py-3'>
        <div v-if="mosaics.length==0" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div v-if="mosaics.length==0" class='text-txs w-9/12 ml-auto mr-auto text-gray-400 text-center'>
          <span >{{$t('account.noAssets')}}</span>
        </div>
        <div v-else class="grid grid-cols-7 text-gray-400 font-semibold text-xs uppercase mb-2">
            <div class="col-span-2">ID</div>
            <div class="col-span-2">Namespace</div>
            <div class="col-span-2">Balance</div>
            <div>Creator</div>
        </div>
        <div v-for="(mosaic, index) in mosaics" :key="index">
            <div class="grid grid-cols-7 text-xs my-4">
                <a :href="explorerLink(mosaic.id)" target=_new class="col-span-2"><div  class="inline-block text-xs mt-1.5 cursor-pointer transition-all duration-200 break-all pr-7 ">{{mosaic.id}}</div></a>
                <div class="col-span-2 break-all pr-7 ">
                    <img v-if="displayTokenName(mosaic.name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <img v-else-if="displayTokenName(mosaic.name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <img v-else-if="displayTokenName(mosaic.name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
                    <div v-else-if="mosaic.name=='-'"/>
                    <img v-else  src="@/modules/dashboard/img/icon-sda.svg" class='inline-block h-6 w-6 mr-2 '>
                    <div v-if="displayTokenName(mosaic.name).registered" class="inline-block text-xs ml-2 mt-1">{{displayTokenName(mosaic.name).name}}</div>
                    <div v-else class="inline-block text-xs ml-2 cursor-pointer mt-1">{{mosaic.name}}</div>
                </div>
                <div class="col-span-2 break-all pr-7 ">
                    <div class="mt-1.5">{{mosaic.balance}}</div>
                </div>

                <div class="mt-1.5">
                    <div class="flex">
                        <div class="ml-2.5">
                            <img v-if="mosaic.isCreator" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5">
                            <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5">
                        </div>
                        <img v-if="mosaic.isCreator" src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5" @mouseover="isHover[index] = true" @mouseout="isHover[index] = false" @click="toggleMenu[index]=!toggleMenu[index]">
                        <div v-if="toggleMenu[index]==true" class="mt-5 pop-option inline-block w-32 absolute rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" >
                            <div class="my-2" >
                                <router-link :to="{ name: 'ViewServicesAssetsModifySupplyChange', params: {assetId: mosaic.id, address: address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.modifySupply')}}</router-link>
                                <router-link :to="{ name: 'ViewServicesAssetsLinkToNamespace', params: {assetId: mosaic.id, address: address} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.linkToNamespace')}}</router-link>
                                <router-link :to="{ name: 'ViewUpdateAssetMetadata', params: {targetId: mosaic.id} }" class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Update Metadata</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="index != (mosaics.length - 1)" class='my-2 gray-line' ></div>
        </div>
        <div class="flex mt-3" >
            <router-link :to="{ name: 'ViewTransferCreate'}" class=" bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-24 "><img src="@/assets/img/icon-transfer-white.svg" class="  inline-block w-4 h-4 mt-0.5  cursor-pointer mr-1">{{$t('general.transfer')}}</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwap'}" class="ml-3 bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-20 "><img src="@/assets/img/navi/icon-swap.svg" class="h-5 w-5 pt-0.5 inline-block relative mr-1">{{$t('general.swap')}}</router-link>
            <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="ml-3 bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-44"><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('asset.createNewAsset')}}</router-link>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed, getCurrentInstance } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
export default {
    name:'ViewAccountAssets',
    components:{
        AccountComponent
    },
    props:{
        address: String,
    },
    setup(p){
        const wallet = walletState.currentLoggedInWallet 
        const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
        const acc= computed(()=>{
            if(!wallet){
                return null
            }
            let currentAccount=wallet.accounts.find(account=> account.address == p.address)
            if (currentAccount!=undefined){
            return currentAccount
            }else{
            return wallet.others.filter(accounts=>accounts.type === "MULTISIG").find(account=>account.address == p.address)
            }
        })
        const isMultiSig = computed(() => {
            if(!acc.value){
                return false
            }
            let isMulti = acc.value.getDirectParentMultisig().length? true: false
            return isMulti;
        });  
        let isDelegate = ()=>{
            if(!walletState.currentLoggedInWallet){
                return false
            }
            let account = walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
            if(account){
                return account.type=="DELEGATE"?true:false
            }else{
                return false
            }
        }
        const mosaics = computed(() => {
            
            var mosaicOption = [];
            if(!walletState.currentLoggedInWallet){
                return mosaicOption;
            }
            const account = walletState.currentLoggedInWallet.accounts.find(
                (element) => element.address == p.address
            ) ||  walletState.currentLoggedInWallet.others.find(
                (element) => element.address == p.address)
            if(!account){
                return mosaicOption
            }
            account.assets.forEach((i) => {
            mosaicOption.push({
                id: i.idHex,
                name: (i.namespaceNames.length>0?i.namespaceNames[0]:'-'),
                balance: Helper.amountFormatterSimple(i.amount,i.divisibility),
                isCreator: acc.value? (i.owner == acc.value.publicKey? true:false):false
            });
            });
            
            return mosaicOption;
        });

        const toggleMenu = ref([])
        const isHover = ref([])
        for(let i = 0;i<mosaics.value.length;i++){
            isHover.value.push(false)
            toggleMenu.value.push(false)
        }
        const displayTokenName = name =>{
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
        const splitBalance = balance=>{
            let split = balance.split(".")
            if (split[1]!=undefined){
                return {left:split[0],right:split[1]}
            }else{
                return {left:split[0], right:null}
            }
        }
        const explorerLink = assetId=>{ 
            if(!networkState.currentNetworkProfile){
                return ''
            }
            return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.assetInfoRoute + '/' + assetId
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
        return{
            acc,
            isDelegate,
            isMultiSig,
            mosaics,
            displayTokenName,
            splitBalance,
            explorerLink,
            currentNativeTokenName,
            toggleMenu,
            isHover
        }
    }
}
</script>

<style>

</style>