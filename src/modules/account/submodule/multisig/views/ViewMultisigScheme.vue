<template>
  <div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>{{$t('general.back')}}</router-link>
    </div>
    <div class='lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5'>
      <AccountComponent :address="address" class="mb-6"/>
     <AccountTabs :address="address" selected="multisig"/>
      <div class=' p-6 border-2 border-t-0 filter shadow-lg mb-6'>
        <div class="flex cursor-pointer">
          <router-link :to="{name:'ViewMultisigHome', params: { address: address}}" class="border-2 border-blue-primary p-1 mb-3 w-16 text-blue-primary text-xs text-center font-semibold ">{{$t('general.multisig')}}</router-link>
          <div  class="border-2 border-blue-primary p-1 mb-3 w-16 text-white bg-blue-primary text-xs text-center font-semibold ">{{$t('general.scheme')}}</div>
        </div>
        <div class="overflow-auto w-full border-2  " :style="`${viewType2==1?' transform: rotate(180deg);':'' }`">
          <blocks-tree :data="graph" :horizontal="viewType==0"  :collapsable="collapsable" :props="{label: 'label', name: 'name', balance: 'balance', numApproveTx:'numApproveTx',numRemoval:'numRemoval',children: 'children'}">
            <template #node="{data}">
              <div class="flex flex-col justify-center p-1.5 h-20 cursor-pointer " @click="navigate(prettyAddress(data.label));explorerLink(prettyAddress(data.label))"  :style="`${viewType2==1?' transform: rotate(180deg);':'' }width: 16.5rem`" >
                <div class="text-xs text-left text-blue-500 font-bold">{{data.name}}</div>
                <div class="flex gap-1">
                  <div :id="data.label" :copyValue="prettyAddress(data.label)"  :copySubject="$t('general.address')" class="font-bold text-left text-xs mt-0.5">{{displayAddress(data.label)}}</div>
                  <font-awesome-icon icon="copy" :title="$t('general.copy')" @mouseover="isHover = true" @mouseout="isHover = false"  @click="copy(data.label)" class="w-5 h-5 text-blue-primary cursor-pointer "></font-awesome-icon>
                </div>
                <div v-if="data.balance!=-1" class="flex">
                    <div class = 'text-xs font-bold '>{{splitBalance(data.balance).left}} </div>
                    <div class = 'text-xs font-bold' v-if='splitBalance(data.balance).right!=null'>.</div>
                    <div class='text-xxs mt-0.5 '>{{splitBalance(data.balance).right}}</div>
                    <div class = 'ml-1 text-xs  font-bold'>{{currentNativeTokenName}}</div>
                    <img src="@/modules/account/img/proximax-logo.svg" class='h-4 w-4 '>
                </div>
                <div class="flex gap-3">
                    <div class="text-xxs text-gray-500">{{$t('multisig.approvalScheme',{approval:data.numApproveTx,maxApproval:data.children.length})}}</div>
                    <div class="text-xxs text-gray-500">{{$t('multisig.deletionScheme',{deletion:data.numRemoval,maxDeletion:data.children.length})}}</div>
                    <div class="flex gap-1 ml-auto">
                        <div v-if='data.children.length>0' class = ' ml-auto bg-green-500 rounded-2xl' :title="$t('general.multisigTitle')">
                        <img src="@/assets/img/icon-multisig.svg" class = 'h-4 w-5 mr-1' style= "transform: rotateY(180deg)" >
                        </div>
                        <div v-if='data.children.length>0 && findAccountWithAddress(data.label)!=undefined'  class = 'p-0.5 bg-purple-500 rounded-2xl' :title="$t('general.ownerTitle')" >
                        <img src="@/assets/img/icon-key.svg" class = 'h-3 w-3 mr-1' >
                        </div>
                    </div>
                </div>
              </div>
            </template>
          </blocks-tree>
        </div>
      </div>
      <div class="font-semibold ">{{$t('multisig.viewSettings')}}</div>
      <div>
        <input name = 'view-type' type='radio' value='0' v-model="viewType" :checked='true'>   
        <label  class = 'text-left py-3 text-xs pl-4'>{{$t('multisig.horizontal')}}</label>
      </div>
      <input name = 'view-type' type='radio' value='1' v-model="viewType" >   
      <label  class = 'text-left py-3 text-xs pl-4'> {{$t('multisig.vertical')}}</label>
      <div>
        <input name = 'view-type-2' type='radio' value='0' v-model="viewType2" :checked='true'>   
        <label v-if="viewType==0" class = 'text-left py-3 text-xs pl-4'> {{$t('multisig.rightToLeft')}}</label>
        <label v-if="viewType==1" class = 'text-left py-3 text-xs pl-4'> {{$t('multisig.topToBottom')}}</label>
      </div>
      <input name = 'view-type-2' type='radio' value='1' v-model="viewType2" >   
      <label v-if="viewType==0" class = 'text-left py-3 text-xs pl-4'> {{$t('multisig.leftToRight')}}</label>
      <label v-if="viewType==1" class = 'text-left py-3 text-xs pl-4'> {{$t('multisig.bottomToTop')}}</label>
      <div>
        <input type="checkbox" @click="collapsable=!collapsable">
        <label class = 'text-left py-3 text-xs pl-4'>{{$t('multisig.collapsible')}}</label>
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
import AccountTabs from "@/modules/account/components/AccountTabs.vue";
import { AppState } from '@/state/appState';
import { copyToClipboard } from '@/util/functions';
import { useToast } from "primevue/usetoast";
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { setDefaultAccInStorage } from '@/models/account';
export default {
  name:"ViewMultisigScheme",
  components:{
    AccountComponent,
    AccountTabs
  },
  props: {
    address: String,
  },
setup(p){
  const toast = useToast();
  const {t} = useI18n();
  const isHover = ref(false)
  const wallet = walletState.currentLoggedInWallet 
  const currentAccount = computed(()=>{
    if(!wallet){
      return null
    }
    let currentAccount=wallet.accounts.find(account=> account.address == p.address) || wallet.others.filter(accounts=>accounts.type === "MULTISIG").find(account=>account.address == p.address)
    if (!currentAccount){
      return null
    }else{
      return currentAccount
    }
  })
  const multisigAccounts = computed(()=>{
    if(!currentAccount.value){
      return []
    }
    return currentAccount.value.multisigInfo.filter(accounts=>accounts.level>=0 )
  })
  const networkType = AppState.networkType
  const convertAddress = publicKey =>{
      let address = Address.createFromPublicKey(publicKey, networkType)
      try {
        return address
      } catch (err) {
        
      }
  }
  const label = length =>{
    return length>0? t('general.multisig').toUpperCase() +'-': t('general.cosigner') +'-'
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
    return multisigAccounts.value.find(account=>account.publicKey == publicKey).cosignaturies.length
  };

  const findAccountWithAddress = (address, includeOthers? :boolean) =>{
    let plainAddress = Address.createFromRawAddress(address).plain()
    if(includeOthers){
      return wallet.accounts.find(account=>account.address == plainAddress) || wallet.others.find(account=>account.address == plainAddress)
    }
    return wallet.accounts.find(account=>account.address == plainAddress)
  }

  const findCosign = publicKey =>{
    return multisigAccounts.value.find(account=>account.publicKey == publicKey).cosignaturies
  }

  const getApproveTx = publicKey=>{
    return multisigAccounts.value.find(account=>account.publicKey == publicKey).minApproval
  }

    const getRemoval = publicKey=>{
    return multisigAccounts.value.find(account=>account.publicKey == publicKey).minRemoval
  }

  const getBalance = publicKey=>{
    let acc = wallet.accounts.find(acc=>acc.publicKey==publicKey)?wallet.accounts.find(acc=>acc.publicKey==publicKey): wallet.others.find(acc=>acc.publicKey==publicKey)
    if(acc){
      return acc.balance
    }else{
      return -1
    }
  }

  //level1
  const getChildObject = (cosignaturies)  =>{
    let tempArray = []
    let cosigns = []
    for(let i =0; i < cosignaturies.length; i ++){
      cosigns = findCosign(cosignaturies[i])
      tempArray.push({
        label: convertAddress(cosignaturies[i]).pretty(),
        name: getAccountName(cosignaturies[i],findCosignLength(cosignaturies[i])),
        balance:getBalance(cosignaturies[i]),
        numApproveTx:getApproveTx(cosignaturies[i]),
        numRemoval:getRemoval(cosignaturies[i]),
        children: getChildObject(cosigns)}) //keep on looping to the end
    }
    return tempArray
  }
  //level 0 (selected account)
  let graph = {
    label: '', 
    name: '',
    balance: 0,
    numApproveTx: 0,
    numRemoval: 0,
    children: []
  }
  if(multisigAccounts.value[0]){
    graph = {
      label: convertAddress(multisigAccounts.value[0].publicKey).pretty(), 
      name: getAccountName(multisigAccounts.value[0].publicKey,multisigAccounts.value[0].cosignaturies.length),
      balance:getBalance(multisigAccounts.value[0].publicKey),
      numApproveTx:getApproveTx(multisigAccounts.value[0].publicKey),
      numRemoval:getRemoval(multisigAccounts.value[0].publicKey),
      children: getChildObject(multisigAccounts.value[0].cosignaturies)
    }
  }

  watch(()=>currentAccount,n=>{
    if(!multisigAccounts.value[0]){
      return
    }
    graph = {
      label: convertAddress(multisigAccounts.value[0].publicKey).pretty(), 
      name: getAccountName(multisigAccounts.value[0].publicKey,multisigAccounts.value[0].cosignaturies.length),
      balance:getBalance(multisigAccounts.value[0].publicKey),
      numApproveTx:getApproveTx(multisigAccounts.value[0].publicKey),
      numRemoval:getRemoval(multisigAccounts.value[0].publicKey),
      children: getChildObject(multisigAccounts.value[0].cosignaturies)
    }
  },{deep:true})
  
  
  
  let isMultisig = computed(()=>{
    if(!currentAccount.value){
      return false
    }
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

    toast.add({severity:'info', detail: copySubject +' '+ t('general.copied'), group: 'br-custom', life: 3000});
  };
  const prettyAddress = address => {
    try {
      return Address.createFromRawAddress(address).pretty()
    } catch (error) {
      
    }
  }
  const viewType = ref(0)
  const viewType2 = ref(1)
  const collapsable = ref(false)
  const router = useRouter() 
  const setDefaultAcc = (name)=>{
    if(walletState.currentLoggedInWallet.accounts.find(acc=>acc.name==name)){
      walletState.currentLoggedInWallet.setDefaultAccountByName(name)
    }
  }
  const getAccountNameByAddress = (address)=>{
    let findAcc = walletState.currentLoggedInWallet.accounts.find(acc=>acc.address ==address) || walletState.currentLoggedInWallet.others.find(acc=>acc.address ==address)
    return findAcc.name
  }

  const navigate = address =>{
    if(findAccountWithAddress(address,true) && !isHover.value ){
        setDefaultAcc(getAccountNameByAddress(Address.createFromRawAddress(address).plain()))
        setDefaultAccInStorage(Address.createFromRawAddress(address).plain())
        router.push({ name: 'ViewAccountDetails', params: { address:Address.createFromRawAddress(address).plain() }})
      }
  }

  const explorerLink = address =>{
    if(!networkState.currentNetworkProfile){
      return ''
    }
    if(!findAccountWithAddress(address,true)){
      window.open(networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.addressRoute + '/' + address)
    }
  }
  return{
    isHover,
    navigate,
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
    prettyAddress,
    explorerLink
  }
}
}
</script>

<style  scoped>

</style>