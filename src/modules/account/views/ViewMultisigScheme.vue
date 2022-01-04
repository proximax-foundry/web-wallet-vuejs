<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <div class = 'flex text-xs font-semibold border-b-2 mt-5'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address:currentAccount.address}}" class= 'w-18 text-center '>Details</router-link>
        <router-link :to="{name:'ViewMultisigHome', params: { name: currentAccount.name}}" class= 'w-18 text-center'>Multisig</router-link>
        <div class= 'w-18 text-center border-b-4 pb-3 border-yellow-500'>Scheme</div>
        <router-link :to="{name:'ViewAccountSwap', params: { address: currentAccount.address}}" class= 'w-18 text-center'>Swap</router-link>
      </div>
      <div class="font-semibold mt-7 mb-3">Account Scheme</div>
      <div class="overflow-auto w-full border bg-gray-50 p-10 ">
        <ul>
          <li class="flex items-center" >
            <AccountSchemeTile 
              :first="true"
              :name="graph.name"
              :address="graph.address"
              :balance ="graph.balance"
              :numApproveTx="graph.numApproveTx"
              :numRemoval="graph.numRemoval"
              :cosign="graph.cosign"
            />
            <ul :class ="`${graph.cosign.length>1?'vline':''}`">
              <li v-for="(item, index) in graph.cosign" :key="index" class="flex items-center ">
                <AccountSchemeTile 
                  :first="false"
                  :name="item.name"
                  :address="item.address"
                  :balance ="item.balance"
                  :numApproveTx="item.numApproveTx"
                  :numRemoval="item.numRemoval"
                  :cosign="item.cosign"
                />
                <ul :class ="`${item.cosign.length>1?'vline':''}`">
                  <li v-for="(childItem, childIndex) in item.cosign" :key="childIndex"  class="flex items-center ">
                    <AccountSchemeTile 
                      :first="false"
                      :name="childItem.name"
                      :address="childItem.address"
                      :balance ="childItem.balance"
                      :numApproveTx="childItem.numApproveTx"
                      :numRemoval="childItem.numRemoval"
                      :cosign="childItem.cosign"
                    />
                    <ul :class ="`${childItem.cosign.length>1?'vline':''}`"> 
                      <li v-for="(grandChildItem, grandChildIndex) in childItem.cosign" :key="grandChildIndex" >
                        <AccountSchemeTile 
                          :first="false"
                          :name="grandChildItem.name"
                          :address="grandChildItem.address"
                          :balance ="grandChildItem.balance"
                          :numApproveTx="childItem.numApproveTx"
                          :numRemoval="grandChildItem.numRemoval"
                          :cosign="[]"
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>        
            </ul>
          </li>
        </ul>
      </div>
  </div>
</div>
</template>

<script>
import { walletState } from '@/state/walletState'
import { watch, ref, computed, getCurrentInstance } from "vue";
import AccountSchemeTile from '@/modules/account/components/AccountSchemeTile.vue';
import { networkState } from '@/state/networkState';
import { Address } from 'tsjs-xpx-chain-sdk';
import { Helper } from '@/util/typeHelper';

export default {
  name:"ViewMultisigScheme",
  components:{
    AccountSchemeTile
  },
  props: {
    address: String,
  },
setup(p){
  networkState.currentNetworkProfileConfig
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

  const findAccountWithAddress = address =>{
    let plainAddress = Address.createFromRawAddress(address).plain()
    return wallet.accounts.find(account=>account.address == plainAddress)
  }

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
        address: convertAddress(cosignaturies[i]).pretty(),
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
        address: convertAddress(cosignaturies[i]).pretty(),
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
    address: convertAddress(multisigAccounts[0].publicKey).pretty(), 
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
      address: convertAddress(cosigner).pretty(), 
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
  let displayAddress = address=>{
    let part1 = address.slice(0,13)
    let part2 = address.slice(35,46)
    return part1+"..."+part2
  }
  const currentNativeTokenName = computed(()=> networkState.currentNetworkProfile.network.currency.name);
  const currentNativeTokenDivisibility = computed(()=> networkState.currentNetworkProfile.network.currency.divisibility);
  const splitBalance = balance =>{   
    let formattedBalance =  Helper.toCurrencyFormat(balance, currentNativeTokenDivisibility.value);
    let split = formattedBalance.split(".")
    if (split[1]!=undefined){
      return {left:split[0],right:split[1]}
    }else{
      return {left:split[0], right:null}
    }
  }
  
  return{
    findAccountWithAddress,
    splitBalance,
    currentNativeTokenName,
    displayAddress,
    isMultisig,
    currentAccount,
    graph
  }
}
}
</script>

<style  scoped>
.vline { 
    margin-right:20px;
    width:2px; 
    height:100%; 
    background: rgb(209 213 219)
}
</style>