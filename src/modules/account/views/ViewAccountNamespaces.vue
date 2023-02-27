<template>
<div>
    
    <div class="lg:w-9/12 ml-2 mr-2 lg:ml-auto lg:mr-auto mt-5">
      <AccountComponent :address="address" class="mb-6"/>
      <AccountTabs :address="address" selected="namespaces"/>
      <div class="border-2 border-t-0 pb-3" >
        <NamespaceDataTable :namespaces="namespaces" :address="address"/>
        <router-link :to="{ name : 'ViewServicesNamespaceCreate'}" class="mt-2 bg-blue-primary py-3 mx-6 text-gray-100 text-xs font-bold rounded-md flex items-center justify-center w-52 "><img src="@/assets/img/icon-plus.svg" class="inline-block mr-2">{{$t('namespace.registerNewNamespace')}}</router-link>
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
import NamespaceDataTable from "../components/NamespaceDataTable.vue"
    
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

  /* const namespaces = ref<{name:string,id: string,linkType :AliasType,linkedAssetAddress:string,expiringBlock: number | string,isActive: boolean}[]>([]) */
  const namespaces = computed(()=>{
    if(!acc.value){
      return
    }
    let namespaces :{name:string,id: string,linkedAssetAddress:string,expiringBlock: number | string,isActive: boolean }[] =[]
    for(let i=0;i<acc.value.namespaces.length;i++){
      let namespace = acc.value.namespaces[i]
       namespaces.push({
        name:namespace.name,
        id: namespace.idHex,
        linkedAssetAddress: namespace.linkedId!=''?namespace.linkType==2?Address.createFromRawAddress(namespace.linkedId).pretty():namespace.linkedId:'-',
        expiringBlock: namespace.endHeight,
        isActive: validateExpiry(namespace.name)? true:  namespace.endHeight > AppState.readBlockHeight 
      })
    }
    return namespaces
  })

  const validateExpiry = (name :string)=>{
    if(name.includes('prx')){
      return true
    }
    return false
  }
  
  /* const getNamespaceInfo = () =>{
    if(!acc.value){
      return
    }
    acc.value.namespaces.forEach(namespace=>{
      namespaces.push({
        name:namespace.name,
        id: namespace.idHex,
        linkType: namespace.linkType,
        linkedAssetAddress: namespace.linkedId!=''?namespace.linkType==2?Address.createFromRawAddress(namespace.linkedId).pretty():namespace.linkedId:'-',
        expiringBlock: namespace.endHeight,
        isActive: namespace.active
      })
    })
  } */

  const init = async() =>{
    /* await getNamespaceInfo() */
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

<style lang="scss" scoped>

::v-deep(.p-paginator) {
    .p-paginator-current {
        
        padding: 1rem;
        padding-right:0.5rem;
        font-size: 12px;
        
    }
    .p-paginator-bottom {
        display:flex;
        align-items: center;
        justify-content: space-between;
    }
    .p-dropdown{
        margin-top:0px;
    }
   
}
</style>