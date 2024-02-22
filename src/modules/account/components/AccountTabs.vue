<template>
<div class = 'flex text-xs flex-wrap font-semibold border-b-2 menu_title_div'>
    <router-link :class="`${selected=='details'?'border-b-2  text-blue-primary border-blue-primary':''}`" :to="{name:'ViewAccountDetails', params: { address: address}}" class= 'w-32 text-center py-3 word-break'>{{$t('account.accountDetails')}}</router-link>
    <router-link :class="`${selected=='assets'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="showTabs" :to="{name:'ViewAccountAssets', params: { address: address}}" class= 'w-18 py-3 text-center word-break'>{{$t('general.asset',2)}}</router-link>
    <router-link :class="`${selected=='namespaces'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="showTabs" :to="{name:'ViewAccountNamespaces', params: { address: address}}" class= 'w-24 py-3 text-center word-break'>{{$t('general.namespace',2)}}</router-link>
    <router-link :class="`${selected=='metadata'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="showTabs" :to="{name:'ViewAccountMetadata', params: { address: address}}" class= 'w-18 text-center py-3  word-break'>Metadata</router-link>
    <router-link :class="`${selected=='multisig'?'border-b-2  text-blue-primary border-blue-primary':''}`" v-if="showTabs" :to="{name:'ViewMultisigHome', params: { address: address}}" class= 'w-18 py-3 text-center word-break'>{{$t('general.multisig')}}</router-link>
    <router-link :class="`${selected=='txn'?'border-b-2  text-blue-primary border-blue-primary':''}`" :to="{name:'ViewAccountConfirmedTransactions', params: { address: address}}" class= 'w-18 py-3 text-center word-break'>{{$t('general.transaction',2)}}</router-link>
</div>
</template>

<script lang='ts'>
import { AppState } from '@/state/appState';
import { walletState } from '@/state/walletState'
import { AccountType, Address } from 'tsjs-xpx-chain-sdk';
import { onMounted, ref } from 'vue';
export default {
    name:"AccountTabs"
}
</script>

<script setup lang="ts">
const props = defineProps({
    address: String,
    selected: String
})

const showTabs = ref(false);

onMounted(()=>{
  checkAccType()
})

const checkAccType = async () => {
  if (!AppState.isReady) {
    setTimeout(checkAccType, 1000);
    return
  }
  try {
    let accInfo = await AppState.chainAPI!.accountAPI.getAccountInfo(Address.createFromRawAddress(props.address));
    switch (accInfo.accountType) {
      case AccountType.Remote:
        showTabs.value = false;
        break;
      case AccountType.Remote_Unlinked:
        showTabs.value = false;
        break;
      default:
        showTabs.value = true;
        break;
    }
  } catch (error) {
    console.log('Error retrieving account type')
    showTabs.value = false
  }
}
</script>
