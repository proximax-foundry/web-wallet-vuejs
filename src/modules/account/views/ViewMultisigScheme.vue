<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='w-9/12 ml-auto mr-auto '>
        <div class = 'flex text-xs font-semibold border-b-2'>
            <router-link :to="{name: 'ViewAccountDetails',params:{address:currentAccount.address}}" class= 'w-18 text-center '>Details</router-link>
            <router-link :to="{name:'ViewMultisigHome', params: { name: currentAccount.name}}" class= 'w-18 text-center'>Multisig</router-link>
            <div class= 'w-18 text-center border-b-4 pb-3 border-yellow-500'>Scheme</div>
            <router-link :to="{name:'ViewAccountSwap', params: { address: currentAccount.address}}" class= 'w-18 text-center'>Swap</router-link>
        </div>
        <div class="font-semibold mt-7">Account Scheme</div>

        <!-- <MultisigSchemeModal :multiSigAccount="acc" /> -->
    </div>
  </div>
</template>

<script>
import { walletState } from '@/state/walletState'
import { watch, ref, computed, getCurrentInstance } from "vue";
import MultisigSchemeModal from '@/modules/account/submodule/multisig/components/MultisigSchemeModal.vue';
import { networkState } from '@/state/networkState';
import { Address } from 'tsjs-xpx-chain-sdk';
export default {
name:"ViewMultisigScheme"
,props: {
    address: String,
},components:{
  /* MultisigSchemeModal */
},
setup(p){
    let levelOneGraph = []
    const wallet = walletState.currentLoggedInWallet 
    const currentAccount = computed(()=>{
      let currentAccount=wallet.accounts.find(account=> account.address == p.address)
      if (currentAccount!=undefined){
        return currentAccount
      }else{
        return wallet.others.filter(accounts=>accounts.type === "MULTISIG").find(account=>account.address == p.address)
      }
    })
    const multisigAccounts = currentAccount.value.multisigInfo.filter(accounts=>accounts.level>=0 | accounts.publicKey == currentAccount.value.publicKey)
    const networkType = networkState.currentNetworkProfile.network.type
    const convertAddress = publicKey =>{
        return Address.createFromPublicKey(publicKey, networkType)
    }
    const label = length =>{
      return length>0? 'MULTISIG-':'Cosigner-'
    }
    const findAccount = publicKey =>{
      return wallet.accounts.find(account=>account.address == convertAddress(publicKey).plain())
    }
    const getAccountName = (publicKey,length) =>{
      return findAccount(publicKey) ? findAccount(publicKey).name : label(length) + convertAddress(publicKey).plain().substr(-4)
    }
    const findCosignLength = publicKey =>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).cosignaturies.length
    };

    const findCosign = publicKey =>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).cosignaturies
    }

    const getApproveTx = publicKey=>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).minApproval
    }

     const getRemoval = publicKey=>{
      return multisigAccounts.find(account=>account.publicKey == publicKey).minRemoval
    }

    const getBalance = publicKey=>{
      let acc = wallet.accounts.find(acc=>acc.publicKey==publicKey)
      if(acc){
        return acc.balance
      }else{
        return -1
      }
    }

    //level3
    const getGrandChildObject = (cosignaturies)  =>{
      let tempArray = [] 
      for(let i =0; i < cosignaturies.length; i ++){
        tempArray.push( {
          address: convertAddress(cosignaturies[i]).plain(),
          name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i])),
          balance:getBalance(cosignaturies[i]),
          numApproveTx:getApproveTx(cosignaturies[i]),
          numRemoval:getRemoval(cosignaturies[i])})
      }
    return tempArray
    }
    //level2
    const getChildObject = (cosignaturies)  =>{
      let tempArray = []
      let cosigns = []
      let tempArray2 = []
      for(let i =0; i < cosignaturies.length; i ++){
        cosigns = findCosign(cosignaturies[i])
        tempArray2 = getGrandChildObject(cosigns)
        tempArray.push({
          address: convertAddress(cosignaturies[i]).plain(),
          name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i])),
          balance:getBalance(cosignaturies[i]),
          numApproveTx:getApproveTx(cosignaturies[i]),
          numRemoval:getRemoval(cosignaturies[i]),
          cosign: tempArray2})
      }
     return tempArray
    }
    //level 0 (selected account)
    let graph = {
      address: convertAddress(multisigAccounts[0].publicKey).plain(), 
      name: getAccountName(multisigAccounts[0].publicKey,multisigAccounts[0].cosignaturies.length),
      balance:getBalance(multisigAccounts[0].publicKey),
      numApproveTx:getApproveTx(multisigAccounts[0].publicKey),
      numRemoval:getRemoval(multisigAccounts[0].publicKey),
      cosign: multisigAccounts[0].cosignaturies
    }
    //level 1
    multisigAccounts[0].cosignaturies.forEach( (cosigner)=>{
      let cosigns = []
      let tempArray = []
      cosigns = findCosign(cosigner)
      tempArray =  getChildObject(cosigns)
      levelOneGraph.push({
        address: convertAddress(cosigner).plain(), 
        name: getAccountName(cosigner,findCosignLength(cosigner)),
        balance:getBalance(cosigner),
        numApproveTx:getApproveTx(cosigner),
        numRemoval:getRemoval(cosigner),
        cosign: tempArray
      })
     
    })
    //combine level 0,1,2,3
    graph.cosign = levelOneGraph
    console.log(graph)
    
    let isMultisig = computed(()=>{
      return currentAccount.value.getDirectParentMultisig>0? true: false
    })
   
    return{
        isMultisig,
        currentAccount
        /* acc, */
        /* multisigAccount */
    }
}
}
</script>

<style>

</style>