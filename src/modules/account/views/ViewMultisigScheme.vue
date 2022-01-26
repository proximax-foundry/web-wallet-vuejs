<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <AccountComponent :address="address" class="mb-10"/>
      <div class = 'flex text-xs font-semibold mt-5'>
        <router-link :to="{name: 'ViewAccountDetails',params:{address:currentAccount.address}}" class= 'w-32 text-center '>Account Details</router-link>
        <router-link :to="{name:'ViewAccountAssets', params: { address: currentAccount.address}}" class= 'w-18 text-center'>Assets</router-link>
        <router-link :to="{name:'ViewMultisigHome', params: { name: currentAccount.name}}" class= 'w-18 text-center'>Multisig</router-link>
        <div class= 'w-18 text-center border-b-2 pb-3 border-yellow-500'>Scheme</div>
        <router-link :to="{name:'ViewAccountSwap', params: { address: currentAccount.address}}" class= 'w-18 text-center'>Swap</router-link>
        <MoreAccountOptions :address="address"/>
      </div>
      <div class="overflow-auto w-full border-2  " :style="`${viewType2==1?' transform: rotate(180deg);':'' }`">
        <blocks-tree :data="graph" :horizontal="viewType==0"  :collapsable="collapsable" :props="{label: 'label', name: 'name', balance: 'balance', numApproveTx:'numApproveTx',numRemoval:'numRemoval',children: 'children'}">
          <template #node="{data}">
            <div class="flex flex-col justify-center p-1.5 h-20" :style="`${viewType2==1?' transform: rotate(180deg);':'' }width: 16.5rem`" >
              <div class="text-xs text-left text-blue-500 font-bold">{{data.name}}</div>
              <div class="flex gap-1">
                <div :id="data.label" :copyValue="prettyAddress(data.label)" copySubject="Address" class="font-bold text-left text-xs mt-0.5">{{displayAddress(data.label)}}</div>
                <font-awesome-icon icon="copy" title='Copy' @click="copy(data.label)" class="w-5 h-5 text-blue-primary cursor-pointer "></font-awesome-icon>
              </div>
              <div v-if="data.balance!=-1" class="flex">
                  <div class = 'text-xs font-bold '>{{splitBalance(data.balance).left}} </div>
                  <div class = 'text-xs font-bold' v-if='splitBalance(data.balance).right!=null'>.</div>
                  <div class='text-xxs mt-0.5 '>{{splitBalance(data.balance).right}}</div>
                  <div class = 'ml-1 text-xs  font-bold'>{{currentNativeTokenName}}</div>
                  <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
              </div>
              <div class="flex gap-3">
                  <div class="text-xxs text-gray-500">S:{{data.numApproveTx}}-of-{{data.children.length}}</div>
                  <div class="text-xxs text-gray-500">D:{{data.numRemoval}}-of-{{data.children.length}}</div>
                  <div class="flex gap-1 ml-auto">
                      <div v-if='data.children.length>0' class = ' ml-auto bg-green-500 rounded-2xl' title='This is a multisig account'>
                      <img src="@/assets/img/icon-multisig.svg" class = 'h-4 w-5 mr-1' style= "transform: rotateY(180deg)" >
                      </div>
                      <div v-if='data.children.length>0 && findAccountWithAddress(data.label)!=undefined'  class = 'p-0.5 bg-purple-500 rounded-2xl' title='You own this multisig account' >
                      <img src="@/assets/img/icon-key.svg" class = 'h-3 w-3 mr-1' >
                      </div>
                  </div>
              </div>
            </div>
          </template>
        </blocks-tree>
      </div>
      <div class="font-semibold ">View Settings</div>
      <div>
        <input name = 'view-type' type='radio' value='0' v-model="viewType" :checked='true'>   
        <label  class = 'text-left py-3 text-xs pl-4'> Horizontal</label>
      </div>
      <input name = 'view-type' type='radio' value='1' v-model="viewType" >   
      <label  class = 'text-left py-3 text-xs pl-4'> Vertical</label>
      <div>
        <input name = 'view-type-2' type='radio' value='0' v-model="viewType2" :checked='true'>   
        <label v-if="viewType==0" class = 'text-left py-3 text-xs pl-4'> Right to left</label>
        <label v-if="viewType==1" class = 'text-left py-3 text-xs pl-4'> Top to Bottom</label>
      </div>
      <input name = 'view-type-2' type='radio' value='1' v-model="viewType2" >   
      <label v-if="viewType==0" class = 'text-left py-3 text-xs pl-4'> Left to right</label>
      <label v-if="viewType==1" class = 'text-left py-3 text-xs pl-4'> Bottom to Top</label>
      <div>
        <input type="checkbox" @click="collapsable=!collapsable">
        <label class = 'text-left py-3 text-xs pl-4'>Collapsible</label>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { walletState } from '@/state/walletState'
import { watch, ref, computed, getCurrentInstance, reactive } from "vue";

import { networkState } from '@/state/networkState';
import { Address, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { Helper } from '@/util/typeHelper';
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import MoreAccountOptions from "@/modules/account/components/MoreAccountOptions.vue";
import { AppState } from '@/state/appState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
export default {
  name:"ViewMultisigScheme",
  components:{
    AccountComponent,
    MoreAccountOptions
  },
  props: {
    address: String,
  },
setup(p){
  const toast = useToast();
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
  const multisigAccounts = currentAccount.value.multisigInfo.filter(accounts=>accounts.level>=0 || accounts.publicKey == currentAccount.value.publicKey)
  const networkType = AppState.networkType
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
    const address = PublicAccount.createFromPublicKey(publicKey,networkType).address.plain()
    const contact = walletState.currentLoggedInWallet.contacts.find((contact) => contact.address==address);
    if (contact){
      return contact.name
    }else{
      return findAccount(publicKey) ? findAccount(publicKey).name : label(length) + convertAddress(publicKey).plain().substr(-4)
    }
    
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
    let acc = wallet.accounts.find(acc=>acc.publicKey==publicKey)?wallet.accounts.find(acc=>acc.publicKey==publicKey): wallet.others.find(acc=>acc.publicKey==publicKey)
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
        label: convertAddress(cosignaturies[i]).pretty(),
        name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i])),
        balance:getBalance(cosignaturies[i]),
        numApproveTx:getApproveTx(cosignaturies[i]),
        numRemoval:getRemoval(cosignaturies[i]),
        children: []})
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
        label: convertAddress(cosignaturies[i]).pretty(),
        name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i])),
        balance:getBalance(cosignaturies[i]),
        numApproveTx:getApproveTx(cosignaturies[i]),
        numRemoval:getRemoval(cosignaturies[i]),
        children: tempArray2})
    }
    return tempArray
  }
  //level 0 (selected account)
  let graph = {
    label: convertAddress(multisigAccounts[0].publicKey).pretty(), 
    name: getAccountName(multisigAccounts[0].publicKey,multisigAccounts[0].cosignaturies.length),
    balance:getBalance(multisigAccounts[0].publicKey),
    numApproveTx:getApproveTx(multisigAccounts[0].publicKey),
    numRemoval:getRemoval(multisigAccounts[0].publicKey),
    children: multisigAccounts[0].cosignaturies
  }
  //level 1
  multisigAccounts[0].cosignaturies.forEach( (cosigner)=>{
    let cosigns = []
    let tempArray = []
    cosigns = findCosign(cosigner)
    tempArray =  getChildObject(cosigns)
    levelOneGraph.push({
      label: convertAddress(cosigner).pretty(), 
      name: getAccountName(cosigner,findCosignLength(cosigner)),
      balance:getBalance(cosigner),
      numApproveTx:getApproveTx(cosigner),
      numRemoval:getRemoval(cosigner),
      children: tempArray
    })
    
  })
  //combine level 0,1,2,3
  graph.children = levelOneGraph
  
  let isMultisig = computed(()=>{
    return currentAccount.value.getDirectParentMultisig().length>0? true: false
  })
  let displayAddress = address=>{
    let part1 = address.slice(0,13)
    let part2 = address.slice(35,46)
    return part1+"..."+part2
  }
  const currentNativeTokenName = computed(()=> AppState.nativeToken.label);
  const currentNativeTokenDivisibility = computed(()=> AppState.nativeToken.divisibility);
  const splitBalance = balance =>{   
    let formattedBalance =  Helper.toCurrencyFormat(balance, currentNativeTokenDivisibility.value);
    let split = formattedBalance.split(".")
    if (split[1]!=undefined){
      return {left:split[0],right:split[1]}
    }else{
      return {left:split[0], right:null}
    }
  }
  const copy = (id) =>{
    let stringToCopy = document.getElementById(id).getAttribute("copyValue");
    let copySubject = document.getElementById(id).getAttribute("copySubject");
    copyToClipboard(stringToCopy);

    toast.add({severity:'info', detail: copySubject + ' copied', group: 'br', life: 3000});
  };
  const prettyAddress = address => Address.createFromRawAddress(address).pretty()
  const viewType = ref(0)
  const viewType2 = ref(1)
  const collapsable = ref(false)
  return{
    viewType,
    viewType2,
    collapsable,
    findAccountWithAddress,
    splitBalance,
    currentNativeTokenName,
    displayAddress,
    isMultisig,
    currentAccount,
    graph,
    copy,
    prettyAddress
  }
}
}
</script>

<style  scoped>

</style>