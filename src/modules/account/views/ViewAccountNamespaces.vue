<template>
<div>
    <div class='flex cursor-pointer'>
      <img src='@/assets/img/chevron_left.svg'>
      <router-link :to='{name:"ViewDashboard"}' class='text-blue-primary text-xs mt-0.5'>Back</router-link>
    </div>
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-10"/>
      <AccountTabs :address="address" selected="namespaces"/>
      <div class="border-2 border-t-0 filter shadow-lg px-6 py-3" >
        <div v-if="namespaces.length==0" class='text-blue-primary text-xs text-center font-semibold'>{{$t('general.ntgToShow')}}</div>
        <div v-if="namespaces.length==0" class='text-txs w-9/12 ml-auto mr-auto text-gray-400 text-center'>
          <span >You do not own any namespaces.</span>
        </div>
        <div v-else class="grid grid-cols-9 text-gray-400 font-semibold text-xs uppercase mb-2">
          <div class="col-span-2">NAME</div>
          <div class="col-span-2">ID</div>
          <div class="col-span-3">LINKED</div>
          <div>EXPIRY</div>
          <div>ACTIVE</div>
        </div>
        <div v-for="(namespace, index) in namespaces" :key="index">
          <div class="grid grid-cols-9 text-xs my-4 ">
            <div class="col-span-2 break-all pr-7" >{{namespace.name}}</div>
            <a :href="explorerLink(namespace.id)" class="col-span-2 break-all pr-7" target=_new ><div >{{namespace.id}}</div></a>
            <div class="col-span-3 break-all pr-7">{{namespace.linkedAssetAddress}}</div>
            <div class=" break-all pr-7">{{namespace.expiringBlock}}</div>
            <div class="flex">
              <div>
                <img v-if="namespace.isActive" src="@/assets/img/icon-green-tick.svg" class="h-5 w-5 ml-1">
                <img v-else src="@/assets/img/icon-red-x.svg" class="h-5 w-5 ml-1">
              </div>
              <img v-if="namespace.isActive" src="@/modules/dashboard/img/icon-more-options.svg" class="w-4 h-4 cursor-pointer inline-block ml-2 mt-0.5" @mouseover="isHover[index] = true" @mouseout="isHover[index] = false" @click="toggleMenu[index]=!toggleMenu[index]">
              <div v-if="toggleMenu[index]==true" class="mt-5 pop-option inline-block w-32 absolute rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 text-left lg:mr-2" >
                  <div class="my-2" >
                    <router-link :to="{ name: 'ViewServicesNamespaceExtend', params: { address: address, namespaceId: namespace.id} }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">{{$t('general.extendDuration')}}</router-link>
                    <router-link :to="{ name: 'ViewUpdateNamespaceMetadata', params: { targetId: namespace.id } }"  class="block hover:bg-gray-100 transition duration-200 p-2 z-20">Update Metadata</router-link>
                  </div>
              </div>
            </div>
          </div>
          <div v-if="index != (namespaces.length - 1)" class='my-2 gray-line' ></div>
        </div>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class=" bg-blue-primary py-3 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-52 "><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('namespace.registerNewNamespace')}}</router-link>
      </div>
        
    </div>
</div>
</template>

<script setup lang="ts">
import AccountComponent from "@/modules/account/components/AccountComponent.vue";
import { AppState } from "@/state/appState";
import { networkState } from "@/state/networkState";
import { walletState } from "@/state/walletState";
import { Address, AliasType } from "tsjs-xpx-chain-sdk";
import { computed, getCurrentInstance, ref, watch } from "vue";
import AccountTabs from "@/modules/account/components/AccountTabs.vue"
    
  const props = defineProps({
    address: String
  }) 

  const acc = computed(()=>{
    if(!walletState.currentLoggedInWallet){
      return null
    }
    let acc = walletState.currentLoggedInWallet.accounts.find((add) => add.address == props.address) || walletState.currentLoggedInWallet.others.find((add) => add.address == props.address);
    if(!acc){
      return null
    }
    return acc
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
  
  const isMultiSig = computed(() => {
    if(!acc.value){
      return false
    }
    let isMulti = acc.value.getDirectParentMultisig().length? true: false
    return isMulti;
  });  

  const toggleMenu = ref([])

  const isHover = ref([])

  const namespaces = ref<{name:string,id: string,linkType :AliasType,linkedAssetAddress:string,expiringBlock: number,isActive: boolean}[]>([])
  
  const getNamespaceInfo = () =>{
    acc.value.namespaces.forEach(namespace=>{
      namespaces.value.push({
        name:namespace.name,
        id: namespace.idHex,
        linkType: namespace.linkType,
        linkedAssetAddress: namespace.linkedId!=''?namespace.linkType==2?Address.createFromRawAddress(namespace.linkedId).pretty():namespace.linkedId:'-',
        expiringBlock: namespace.endHeight,
        isActive: namespace.active
      })
    })
  }

  const init = async() =>{
    await getNamespaceInfo()
    for(let i = 0;i<namespaces.value.length;i++){
      isHover.value.push(false)
      toggleMenu.value.push(false)
    }
  }
  
  if(AppState.isReady){
    init();
  }else{
    let readyWatcher = watch(AppState, (value) => {
      if(value.isReady){
        init();
        readyWatcher();
      }
    });
  }
  const internalInstance = getCurrentInstance(); 
  const emitter = internalInstance.appContext.config.globalProperties.emitter;

   const explorerLink = namespaceId=>{ 
    if(!networkState.currentNetworkProfile){
      return ''
    }
    return networkState.currentNetworkProfile.chainExplorer.url + '/' + networkState.currentNetworkProfile.chainExplorer.namespaceInfoRoute + '/' + namespaceId
  }

  emitter.on('PAGE_CLICK', () => {
    if(isHover.value.every(value=>value==false) && toggleMenu.value.includes(true)){
      for(let i=0;i<toggleMenu.value.length;i++){
        toggleMenu.value[i] = false
      }
    } else if(isHover.value.includes(true) && toggleMenu.value.includes(true)){
      let hoverIndexes = []
      let menuIndexes = []
      isHover.value.filter((elem, index)=>{
        if(elem == true) {
            hoverIndexes.push(index);
        }
      });
      toggleMenu.value.filter((elem, index)=>{
        if(elem == true) {
            menuIndexes.push(index);
        }
      });
      if(hoverIndexes!=menuIndexes){
        for(let i=0;i<toggleMenu.value.length;i++){
            toggleMenu.value[i] = false
        }
        toggleMenu.value[hoverIndexes[0]] = true
      }
    } 
  });
</script>

