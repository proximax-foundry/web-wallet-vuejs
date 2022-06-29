<template>
<div class = 'flex text-xs flex-wrap font-semibold border-b-2 menu_title_div'>
    <router-link :class="`${selected=='details'?'border-b-2  text-blue-primary border-blue-primary':''}`" :to="{name:'ViewAccountDetails', params: { address: address}}" class= 'w-32 text-center py-3 word-break'>{{$t('account.accountDetails')}}</router-link>
    <router-link :class="`${selected=='assets'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewAccountAssets', params: { address: address}}" class= 'w-18 py-3 text-center word-break'>{{$t('general.asset',2)}}</router-link>
    <router-link :class="`${selected=='namespaces'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewAccountNamespaces', params: { address: address}}" class= 'w-24 py-3 text-center word-break'>{{$t('general.namespace',2)}}</router-link>
    <router-link :class="`${selected=='metadata'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewMetadata', params: { address: address}}" class= 'w-18 text-center py-3  word-break'>Metadata</router-link>
    <router-link :class="`${selected=='multisig'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewMultisigHome', params: { address: address}}" class= 'w-18 py-3 text-center word-break'>{{$t('general.multisig')}}</router-link>
    <router-link :class="`${selected=='txn'?'border-b-2  text-blue-primary border-blue-primary':''}`" :to="{name:'ViewAccountConfirmedTransactions', params: { address: address}}" class= 'w-18 py-3 text-center word-break'>{{$t('general.transaction',2)}}</router-link>
</div>
<!-- <div class = 'flex flex-col sm:flex-row text-xs font-semibold border-b-2 menu_title_div'>
  <div class="flex">
    <router-link :class="`${selected=='details'?'border-b-2  text-blue-primary border-blue-primary':''}`" :to="{name:'ViewAccountDetails', params: { address: address}}" class= 'w-32 text-center pb-3'>{{$t('account.accountDetails')}}</router-link>
    <router-link :class="`${selected=='assets'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewAccountAssets', params: { address: address}}" class= 'w-18 text-center pb-3'>{{$t('general.asset',2)}}</router-link>
    <router-link :class="`${selected=='namespaces'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewAccountNamespaces', params: { address: address}}" class= 'w-24 text-center pb-3'>{{$t('general.namespace',2)}}</router-link>
  </div>
  <div class="flex"> 
    <router-link :class="`${selected=='metadata'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewMetadata', params: { address: address}}" class= 'w-18 text-center py-3'>Metadata</router-link>
    <router-link :class="`${selected=='multisig'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="!isDelegate()" :to="{name:'ViewMultisigHome', params: { address: address}}" class= 'w-18 text-center py-3'>{{$t('general.multisig')}}</router-link>
    <router-link :class="`${selected=='txn'?'border-b-2  text-blue-primary border-blue-primary':''}`" :to="{name:'ViewAccountConfirmedTransactions', params: { address: address}}" class= 'w-18 text-center py-3'>{{$t('general.transaction',2)}}</router-link>
  </div>
   
</div> -->

</template>

<script lang='ts'>
import { walletState } from '@/state/walletState'
export default {
    name:"AccountTabs"
}
</script>

<script setup lang="ts">
const props = defineProps({
    address: String,
    selected: String
})

const isDelegate = ()=>{ 
      if(!walletState.currentLoggedInWallet){
        return false
      }
      let account = walletState.currentLoggedInWallet.others.find(acc=>acc.address==props.address)
      if(account){
        return account.type=="DELEGATE"?true:false
      }else{
        return false
      }
    }

</script>
