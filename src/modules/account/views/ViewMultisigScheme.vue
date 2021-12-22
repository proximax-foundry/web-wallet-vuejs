<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='w-9/12 ml-auto mr-auto '>
        <div class = 'flex text-xs font-semibold border-b-2'>
            <router-link :to="{name: 'ViewAccountDetails',params:{address:acc.address}}" class= 'w-18 text-center '>Details</router-link>
           <router-link :to="{name:'ViewMultisigHome', params: { name: acc.name}}" class= 'w-18 text-center'>Multisig</router-link>
            <div class= 'w-18 text-center border-b-4 pb-3 border-yellow-500'>Scheme</div>
        </div>
        <div class="font-semibold mt-7">Account Scheme</div>
    </div>
  </div>
</template>

<script>
import { walletState } from '@/state/walletState'
import { watch, ref, computed, getCurrentInstance } from "vue";

export default {
name:"ViewMultisigScheme"
,props: {
    address: String,
},
setup(p){
    let acc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address)?walletState.currentLoggedInWallet.accounts.find(acc=>acc.address==p.address): walletState.currentLoggedInWallet.others.find(acc=>acc.address==p.address)
    let multisigAccount = acc.multisigInfo.find(acc=>acc.level==0)
    let isMultisig = computed(()=>{
        return acc.getDirectParentMultisig.length>0? true: false
    })
    return{
        isMultisig,
        acc,
        multisigAccount
    }
}
}
</script>

<style>

</style>