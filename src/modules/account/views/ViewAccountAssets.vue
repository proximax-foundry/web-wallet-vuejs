<template>
  <div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6"/>
      <AccountTabs :address="address" selected="assets"/>
    <div class='border-2 border-t-0  '>
        <AssetDataTable :assets="mosaics" :address="address" />
        <div class="flex my-3 px-6 flex-col w-full ml-auto mr-auto gap-2 sm:flex-row sm:items-center">
             <router-link :to="{ name: 'ViewTransferCreate'}" class=" bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center "><img src="@/assets/img/icon-transfer-white.svg" class="  inline-block w-4 h-4 mt-0.5  cursor-pointer mr-1">{{$t('general.transfer')}}</router-link>
            <router-link :to="{ name: 'ViewServicesMainnetSwap'}" class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center  "><img src="@/assets/img/navi/icon-swap.svg" class="w-4 h-4 inline-block relative mr-1">{{$t('general.swap')}}</router-link>
            <router-link :to="{ name : 'ViewServicesAssetsCreate'}" class="bg-blue-primary px-5 py-2 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center" ><img src="@/assets/img/icon-plus.svg" class="inline-block w-4 h-4 mr-2">{{$t('asset.createNewAsset')}}</router-link>
        </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, onMounted } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { walletState } from '@/state/walletState';
import { Address, MosaicId } from "tsjs-xpx-chain-sdk"
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import AssetDataTable from "@/modules/account/components/AssetDataTable.vue";
export default {
    name:'ViewAccountAssets',
    components:{
        AccountComponent,
        AccountTabs,
        AssetDataTable
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
        const mosaics =ref([])

        const fetchMosaic = async()=>{
            if(!acc.value){
                return null
            }
            let z =[]
            let accInfo = await AppState.chainAPI.accountAPI.accountHttp.getAccountInfo(Address.createFromRawAddress(p.address)).toPromise()
            if(!mosaics.value.length){
                if(accInfo.mosaics.length<100){
                    for(let i=0;i<accInfo.mosaics.length;i++){
                    mosaics.value.push({
                        i: i,
                        id: accInfo.mosaics[i]?.id.toHex()
                    })
                    }
                }
                else{
                    for(let i=0;i<100;i++){
                    mosaics.value.push({
                        i: i,
                        id: accInfo.mosaics[i]?.id.toHex()
                    })
                    }
                }
            }
            else{
                if(mosaics.value.length<accInfo.mosaics.length){
                    let totalMosaics=mosaics.value.length
                    for(let i=mosaics.value.length;i<=totalMosaics+99;i++){
                        mosaics.value.push({
                        i: i,
                        id: accInfo.mosaics[i]?.id.toHex()
                    })
                    }  
                }
            } 

            let mosaicIds = mosaics.value.map(y=>new MosaicId(y.id) )
            let mosaicNames = await AppState.chainAPI.assetAPI.getMosaicsNames(mosaicIds)
            let mosaic = await AppState.chainAPI.assetAPI.getMosaics(mosaicIds)

            if(mosaics.value.length<=100){
            for(let i =0; i< mosaicNames.length; i++){
                let c=[]
                if(mosaicNames[i].names.length>1){
                    for(let j=mosaicNames[i].names.length-1; j>=0;j--){
                        c.push(mosaicNames[i]?.names[j]?.name)
                    }
                    z.push(c)
                }else{
                    c.push(mosaicNames[i]?.names[0]?.name)
                    z.push(c)
                }
            }
            for(let i =0 ; i < mosaics.value.length; i ++){
                let a = mosaics.value[i]
                a.name = (mosaicNames[i]?.names.length>0?formatNamespaceName(z[i]):'-')
                for(let j=0;j<mosaics.value.length; j ++){
                    let amount
                    if(accInfo.mosaics[i].id.toHex()===mosaic[j]?.mosaicId.id.toHex()){
                        if(mosaic[j].divisibility === 0){
                        amount = accInfo.mosaics[i].amount.compact();
                    }else if(mosaic[j].divisibility !== null){
                        amount = accInfo.mosaics[i].amount.compact() / Math.pow(10, mosaic[j].divisibility);
                    }
                    a.balance = Helper.toCurrencyFormat(amount,mosaic[j].divisibility) 
                    }
                }
                a.isCreator = acc.value? (mosaic[mosaics.value.length-1-i]?.owner.publicKey == acc.value.publicKey? true:false):false
            }
        }
        else{
            for(let i =mosaics.value.length-100; i< mosaics.value.length; i++){
                let c=[]
                if(mosaicNames[i]?.names.length>1){
                    for(let j=mosaicNames[i].names.length-1; j>=0;j--){
                        c.push(mosaicNames[i]?.names[j]?.name)
                    }
                    z.push(c)
                }else{
                    c.push(mosaicNames[i]?.names[0]?.name)
                    z.push(c)
                }
            }
            for(let i =mosaics.value.length-100 ; i < mosaics.value.length; i ++){
                let a = mosaics.value[i]
                a.name = (mosaicNames[i]?.names.length>0?formatNamespaceName(z[i]):'-')
                for(let j=0;j<mosaics.value.length; j ++){
                    let amount
                    if(accInfo.mosaics[i].id.toHex()===mosaic[j]?.mosaicId.id.toHex()){
                        if(mosaic[j].divisibility === 0){
                        amount = accInfo.mosaics[i].amount.compact();
                    }else if(mosaic[j].divisibility !== null){
                        amount = accInfo.mosaics[i].amount.compact() / Math.pow(10, mosaic[j].divisibility);
                    }
                    a.balance = Helper.toCurrencyFormat(amount,mosaic[j].divisibility) 
                    }
                }
                a.isCreator = acc.value? (mosaic[mosaics.value.length-1-i]?.owner.publicKey == acc.value.publicKey? true:false):false
            }
            }
        }

        onMounted(async () => {
            let accInfo = await AppState.chainAPI.accountAPI.accountHttp.getAccountInfo(Address.createFromRawAddress(p.address)).toPromise()
            if(!mosaics.value.length){
                let updateAccountMosaics = async() => {
                    await fetchMosaic()
                if(mosaics.value.length===accInfo.mosaics.length){
                        clearInterval(loadMosaics)
                }
                return ;
            }
            const loadMosaics = setInterval(updateAccountMosaics,5000)
            }       
        })


        const formatNamespaceName = (namespaceNames) => {
            return namespaceNames.join(" / ")
        }
       
        const splitBalance = balance=>{
            let split = balance.split(".")
            if (split[1]!=undefined){
                return {left:split[0],right:split[1]}
            }else{
                return {left:split[0], right:null}
            }
        }
       
       
        return{
            acc,
            isDelegate,
            isMultiSig,
            mosaics,
            splitBalance,
            currentNativeTokenName,
        }
    }
}
</script>

