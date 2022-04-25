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
        <router-link v-if="!isDelegate()" :to="{name:'ViewMetadata', params: { address: address}}" class= 'w-18 text-center'>Metadata</router-link>
        <router-link v-if="!isDelegate()" :to="{name:'ViewMultisigHome', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.multisig')}}</router-link>
        <router-link v-if="isMultiSig" :to="{name:'ViewMultisigScheme', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.scheme')}}</router-link>
        <router-link :to="{name:'ViewAccountSwap', params: { address: address}}" class= 'w-18 text-center'>{{$t('general.swap')}}</router-link>
        <MoreAccountOptions :address="address"/>
    </div>
    <div class='border-2 border-t-0  p-6'>
        <div v-if="mosaics.length==0" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div class='text-txs w-9/12 ml-auto mr-auto text-gray-400 mt-1 text-center'>
          <span v-if="mosaics.length==0">{{$t('account.noAssets')}}</span>
        </div>
        <div v-for="(mosaic, index) in mosaics" :key="index">
            <img v-if="displayTokenName(mosaic.name).name=='XPX'" src="@/modules/account/img/proximax-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
            <img v-else-if="displayTokenName(mosaic.name).name=='XAR'" src="@/modules/account/img/xarcade-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
            <img v-else-if="displayTokenName(mosaic.name).name=='METX'" src="@/modules/account/img/metx-logo.svg" class='inline-block h-7 w-7 mr-2 border-2 rounded-3xl'>
            <img v-else src="@/modules/dashboard/img/icon-sda.svg" class='inline-block h-6 w-6 mr-2 '>
            <div class = 'inline-block text-md font-bold '>{{splitBalance(mosaic.balance).left}} </div>
            <div class = 'inline-block text-md font-bold' v-if='splitBalance(mosaic.balance).right!=null'>.</div>
            <div class='inline-block text-xs mt-1.5 font-bold'>{{splitBalance(mosaic.balance).right}}</div>
            <div v-if="displayTokenName(mosaic.name).registered" class="inline-block text-md font-bold ml-2">{{displayTokenName(mosaic.name).name}}</div>
            <a v-else :href="explorerLink(mosaic.name)" target=_new><div  class="inline-block text-xs text-gray-400 font-semibold ml-2 hover:text-black cursor-pointer transition-all duration-200">{{mosaic.name}}</div></a>
            <router-link v-if="index==0" :to='{name:"ViewTransferCreate"}' class='cursor-pointer float-right'>
              <img src="@/assets/img/icon-transfer.svg" class="  inline-block w-5 h-5 mt-0.5  cursor-pointer mr-1">
              <div class='inline-block text-xs mt-1 font-semibold '>{{$t('general.transfer')}} {{currentNativeTokenName}}</div>
            </router-link>
            <div v-if="index != (mosaics.length - 1)" class='my-6 gray-line' ></div>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed, getCurrentInstance } from "vue";
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import { walletState } from '@/state/walletState';
import { Helper } from '@/util/typeHelper';
import { AppState } from '@/state/appState';
import { networkState } from '@/state/networkState';
export default {
    name:'ViewAccountAssets',
    components:{
        AccountComponent,
        MoreAccountOptions
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
                name: (i.namespaceNames.length>0?i.namespaceNames[0]:i.idHex),
                balance: Helper.amountFormatterSimple(i.amount,i.divisibility)
            });
            });
            
            return mosaicOption;
        });
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
        return{
            acc,
            isDelegate,
            isMultiSig,
            mosaics,
            displayTokenName,
            splitBalance,
            explorerLink,
            currentNativeTokenName
        }
    }
}
</script>

<style>

</style>