<template>
<div class="flex ml-auto flex-col w-40">
    <div class="flex  gap-1 cursor-pointer mb-3 ">
    <div @click="toggleModal=!toggleModal" class="text-xs pl-24">{{$t('general.more')}}</div>
    <img @click="toggleModal=!toggleModal" src="@/modules/account/img/icon-arrow-down.svg" class="w-3 mt-0.5 h-3">
    </div>
    <div v-if="selected" class="ml-20 border-b-2 border-yellow-500"></div>
    <div v-if="toggleModal" class="relative ">
    <div class='absolute border border-t-0 z-20 bg-white w-full p-3 '>
        <div  class="pb-2">
            <router-link class="hover:bg-gray-100" v-if="!otherAccount(address)" :to="{ name: 'ViewAccountDelegate', params: { address: address }}">{{$t('account.delegate')}}</router-link>
            <div v-else class="text-gray-300">{{$t('account.delegate')}}</div>
        </div>
        <router-link class="hover:bg-gray-100" v-if="!otherAccount(address)" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: address}}">{{$t('general.linkToNamespace')}}</router-link>
        <router-link class="hover:bg-gray-100" v-else-if="otherAccount(address) && other_acc.type =='MULTISIG'" :to="{ name: 'ViewAccountAliasAddressToNamespace', params: { address: address}}">{{$t('general.linkToNamespace')}}</router-link>
        <div  v-else class="text-gray-300">{{$t('general.linkToNamespace')}}</div>
    </div>
    </div>
</div>
</template>

<script>
import { watch, ref, computed, getCurrentInstance } from "vue";
import { walletState } from '@/state/walletState';
export default {
name:"MoreAccountOptions",
props:{
    address: String,
    selected: Boolean
},
setup(p){
    let toggleModal = ref(false)
    const account = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address)
    const other_acc = walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
    const otherAccount = (address) => {
      return walletState.currentLoggedInWallet.others.find(others => others.address == address);
    };
    return{
        toggleModal,
        otherAccount,
        account,
        other_acc
    }
}
}
</script>

<style>

</style>